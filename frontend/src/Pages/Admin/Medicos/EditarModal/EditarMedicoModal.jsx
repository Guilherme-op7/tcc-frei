import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import api from "../../../../api";
import "./EditarMedicoModal.scss";

export default function EditarMedicoModal({ medico, onClose, onAtualizado }) {
  const [form, setForm] = useState({
    id_funcionario: "",
    nome: "",
    email: "",
    telefone: "",
    salario: "",
    crm: "",
    id_especialidade: "",
  });
  const [funcionarios, setFuncionarios] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [resFuncionarios, resEspecialidades] = await Promise.all([
          api.get("/funcionarios"),
          api.get("/especialidades"),
        ]);
        setFuncionarios(resFuncionarios.data.resposta || []);
        setEspecialidades(resEspecialidades.data || []);
      } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        setFuncionarios([]);
        setEspecialidades([]);
      } finally {
        setLoading(false);
      }
    }

    if (medico) {
      let salarioFormatado = "";
      if (medico.salario) {
        if (typeof medico.salario === "string") {
          salarioFormatado = medico.salario.replace("R$ ", "").replace(",", ".").trim();
        } else if (typeof medico.salario === "number") {
          salarioFormatado = medico.salario.toString();
        }
      }

      setForm({
        id_funcionario: medico.id_funcionario || "",
        nome: medico.nome || "",
        email: medico.email || "",
        telefone: medico.telefone || "",
        salario: salarioFormatado,
        crm: medico.crm || "",
        id_especialidade: medico.id_especialidade || "",
      });
    }

    carregarDados();
  }, [medico]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const payload = {
        id_funcionario: form.id_funcionario ? parseInt(form.id_funcionario) : null,
        nome: form.nome,
        email: form.email,
        telefone: form.telefone || null,
        salario: form.salario ? parseFloat(form.salario) : null,
        crm: form.crm,
        id_especialidade: form.id_especialidade ? parseInt(form.id_especialidade) : null,
      };
      await api.put(`/medicos/${medico.id}`, payload);
      toast.success("Médico atualizado com sucesso!");
      onAtualizado();
    } catch (erro) {
      console.error("Erro ao atualizar médico:", erro);
      const mensagem = erro.response?.data?.erro || erro.message || "Erro ao salvar alterações. Verifique os dados e tente novamente.";
      toast.error(mensagem);
    }
  }

  if (!medico || loading) return null;

  return (
    <div className="modal-editar-medico">
      <div className="modal-conteudo">
        <button className="fechar" onClick={onClose}>
          <X size={18} />
        </button>

        <h2>Editar Médico</h2>

        <form onSubmit={handleSubmit}>
          <label>Funcionário *</label>
          <select
            name="id_funcionario"
            value={form.id_funcionario}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um funcionário</option>
            {funcionarios.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome} - {f.email}
              </option>
            ))}
          </select>

          <label>Nome *</label>
          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
          />

          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Telefone</label>
          <input
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
          />

          <label>Salário</label>
          <input
            type="number"
            step="0.01"
            name="salario"
            value={form.salario}
            onChange={handleChange}
          />

          <label>CRM *</label>
          <input
            name="crm"
            value={form.crm}
            onChange={handleChange}
            required
          />

          <label>Especialidade</label>
          <select
            name="id_especialidade"
            value={form.id_especialidade}
            onChange={handleChange}
          >
            <option value="">Selecione uma especialidade</option>
            {especialidades.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome}
              </option>
            ))}
          </select>

          <button type="submit" className="btn-salvar">
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}

