import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import api from "../../../../api";
import "./EditarMedicoModal.scss";

export default function CadastrarMedicoModal({ onClose, onCadastrado }) {
  const [form, setForm] = useState({
    id_funcionario: "",
    crm: "",
    id_especialidade: "",
  });

  const [funcionarios, setFuncionarios] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);

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
        toast.error("Erro ao carregar dados.");
      }
    }
    carregarDados();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "id_funcionario") {
      const func = funcionarios.find((f) => f.id == value);
      setFuncionarioSelecionado(func || null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const payload = {
        id_funcionario: Number(form.id_funcionario),
        crm: form.crm,
        id_especialidade: form.id_especialidade
          ? Number(form.id_especialidade)
          : null,
      };

      await api.post("/medicos", payload);

      toast.success("Médico cadastrado!");
      onCadastrado();
      onClose();
    } catch (erro) {
      toast.error(
        erro.response?.data?.erro ||
          "Erro ao cadastrar médico. Verifique os dados."
      );
    }
  }

  return (
    <div className="modal-editar-medico">
      <div className="modal-conteudo">
        <button className="fechar" onClick={onClose}>
          <X size={18} />
        </button>

        <h2>Cadastrar Médico</h2>

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
                {f.nome} — {f.email}
              </option>
            ))}
          </select>

          {funcionarioSelecionado && (
            <div className="dados-func">
              <p><strong>Nome:</strong> {funcionarioSelecionado.nome}</p>
              <p><strong>Email:</strong> {funcionarioSelecionado.email}</p>
              <p><strong>Telefone:</strong> {funcionarioSelecionado.telefone}</p>
              <p><strong>Salário:</strong> R$ {funcionarioSelecionado.salario}</p>
            </div>
          )}

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
            Cadastrar Médico
          </button>
        </form>
      </div>
    </div>
  );
}
