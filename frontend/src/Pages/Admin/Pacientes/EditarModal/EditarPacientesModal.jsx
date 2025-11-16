import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import api from "../../../../api";
import "./EditarPacientesModal.scss"

export default function EditarPacienteModal({ paciente, onClose, onAtualizado }) {
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    cartao_sus: "",
    email: "",
    telefone: "",
    endereco: "",
    data_nascimento: "",
    tipo_sanguineo: "",
    alergias: "",
    contato_emergencia: "",
    status: "ativo",
  });

  useEffect(() => {
    if (paciente) {
      let dataFormatada = "";
      if (paciente.data_nascimento) {
        if (paciente.data_nascimento.includes("-") && paciente.data_nascimento.length === 10) {
          dataFormatada = paciente.data_nascimento;
        } else if (paciente.data_nascimento.includes("/")) {
          const partes = paciente.data_nascimento.split("/");
          if (partes.length === 3) {
            const [dia, mes, ano] = partes;
            dataFormatada = `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
          }
        }
      }

      setForm({
        nome: paciente.nome || "",
        cpf: paciente.cpf || "",
        cartao_sus: paciente.cartao_sus || "",
        email: paciente.email || "",
        telefone: paciente.telefone || "",
        endereco: paciente.endereco || "",
        data_nascimento: dataFormatada,
        tipo_sanguineo: paciente.tipo_sanguineo || "",
        alergias: paciente.alergias || "",
        contato_emergencia: paciente.contato_emergencia || "",
        status: paciente.status || "ativo",
      });
    }
  }, [paciente]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const payload = {
        nome: form.nome,
        cpf: form.cpf,
        email: form.email,
        data_nascimento: form.data_nascimento || null,
        endereco: form.endereco || null,
        telefone: form.telefone || null,
        cartao_sus: form.cartao_sus || null,
        tipo_sanguineo: form.tipo_sanguineo || null,
        alergias: form.alergias || null,
        contato_emergencia: form.contato_emergencia || null,
        status: form.status,
      };
      await api.put(`/pacientes/${paciente.id}`, payload);
      toast.success("Paciente atualizado com sucesso!");
      onAtualizado();
      onClose();
    } 
    
    catch (erro) {
      console.error("Erro ao atualizar paciente:", erro);
      const mensagem = erro.response?.data?.erro || erro.message || "Erro ao atualizar paciente. Verifique os dados e tente novamente.";
      toast.error(mensagem);
    }
  }

  if (!paciente) return null;

  return (
    <div className="modal-editar-paciente">
      <div className="modal-conteudo">
        <button className="fechar" onClick={onClose}><X size={18} /></button>
        <h2>Editar Paciente</h2>

        <form onSubmit={handleSubmit}>
          <label>Nome *</label>
          <input name="nome" value={form.nome} onChange={handleChange} required />

          <label>CPF *</label>
          <input name="cpf" value={form.cpf} onChange={handleChange} required />

          <label>Data de Nascimento</label>
          <input type="date" name="data_nascimento" value={form.data_nascimento} onChange={handleChange} />

          <label>Email *</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />

          <label>Telefone</label>
          <input name="telefone" value={form.telefone} onChange={handleChange} />

          <label>Endereço</label>
          <input name="endereco" value={form.endereco} onChange={handleChange} />

          <label>Cartão SUS</label>
          <input name="cartao_sus" value={form.cartao_sus} onChange={handleChange} />

          <label>Tipo Sanguíneo</label>
          <select name="tipo_sanguineo" value={form.tipo_sanguineo} onChange={handleChange}>
            <option value="">Selecione</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>

          <label>Alergias</label>
          <textarea name="alergias" value={form.alergias} onChange={handleChange} rows="3" />

          <label>Contato de Emergência</label>
          <input name="contato_emergencia" value={form.contato_emergencia} onChange={handleChange} />

          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>

          <button type="submit" className="btn-salvar">Salvar Alterações</button>
        </form>
      </div>
    </div>
  );
}
