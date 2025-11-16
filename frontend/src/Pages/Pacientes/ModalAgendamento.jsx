import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import api from "../../api";

export default function ModalAgendamento({ pacienteId, onClose, onAgendado }) {
  const [form, setForm] = useState({
    especialidade: "",
    data_preferencial: "",
    unidade: "",
    medico_id: "",
  });
  const [especialidades, setEspecialidades] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [resEspecialidades, resUnidades, resMedicos] = await Promise.all([
          api.get("/especialidades").catch(() => ({ data: [] })),
          api.get("/ubs").catch(() => ({ data: [] })),
          api.get("/medicos").catch(() => ({ data: [] })),
        ]);

        setEspecialidades(resEspecialidades.data || []);
        setUnidades(resUnidades.data || []);
        const medicosData = Array.isArray(resMedicos.data) ? resMedicos.data : (resMedicos.data.resposta || []);
        setMedicos(medicosData);
      } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (!form.medico_id || !form.data_preferencial || !form.unidade) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }

      const payload = {
        paciente_id: pacienteId,
        medico_id: parseInt(form.medico_id),
        data_hora: `${form.data_preferencial}T10:00`,
        tipo_consulta: form.especialidade || "Consulta Geral",
        unidade: form.unidade,
        status: "Agendada",
      };

      await api.post("/consultas", payload);
      toast.success("Consulta agendada com sucesso!");
      onAgendado();
      onClose();
    } catch (erro) {
      console.error("Erro ao agendar consulta:", erro);
      const mensagem = erro.response?.data?.erro || erro.message || "Erro ao agendar consulta. Tente novamente.";
      toast.error(mensagem);
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
        <div className="bg-white w-full max-w-md rounded-lg p-6">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4">Agendar Nova Consulta</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm mb-1 block">Médico *</label>
            <select
              name="medico_id"
              value={form.medico_id}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Selecione um médico</option>
              {medicos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome} {m.nome_especialidade ? `- ${m.nome_especialidade}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm mb-1 block">Data Preferencial *</label>
            <input
              type="date"
              name="data_preferencial"
              value={form.data_preferencial}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div>
            <label className="text-sm mb-1 block">Unidade de Saúde *</label>
            <select
              name="unidade"
              value={form.unidade}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Selecione uma unidade</option>
              {unidades.map((u) => (
                <option key={u.id} value={u.nome}>
                  {u.nome}
                </option>
              ))}
              {unidades.length === 0 && (
                <>
                  <option value="UBS Centro">UBS Centro</option>
                  <option value="UBS Vila Nova">UBS Vila Nova</option>
                  <option value="Hospital Central">Hospital Central</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="text-sm mb-1 block">Tipo de Consulta</label>
            <select
              name="especialidade"
              value={form.especialidade}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Selecione (opcional)</option>
              {especialidades.map((e) => (
                <option key={e.id} value={e.nome}>
                  {e.nome}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#75B7F5] hover:bg-[#5fa3e0] text-white py-2 rounded-md"
          >
            Confirmar Agendamento
          </button>

          <button
            type="button"
            className="w-full mt-2 py-2 border rounded-md"
            onClick={onClose}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}


