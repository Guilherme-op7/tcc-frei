import { useState, useEffect } from "react";
import { toast } from "sonner";
import Sidebar from "../../../../components/Sidebar/Sidebar";
import DashboardHeader from "../../../../components/Header/DashboardHeader";
import api from "../../../../api";

import CabecalhoMedicos from "./CabecalhoMedicos";
import FiltroMedicos from "./FiltroMedicos";
import TabelaMedicos from "./TabelaMedicos";
import EstadoVazio from "./EstadoVazio";
import CadastrarMedicoModal from "../EditarModal/CadastrarMedicoModal";
import EditarMedicoModal from "../EditarModal/EditarMedicoModal";

import "../Styles/MedicosPage.scss";

export default function MedicosPage() {
  const [busca, setBusca] = useState("");
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [modalCadastrarAberto, setModalCadastrarAberto] = useState(false);
  const [medicoSelecionado, setMedicoSelecionado] = useState(null);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);

  async function carregarMedicos() {
    setLoading(true);
    try {
      const res = await api.get("/medicos");

      const medicosData = Array.isArray(res.data)
        ? res.data
        : res.data.resposta || [];

      setMedicos(
        medicosData.map((m) => ({
          id: m.id,
          id_funcionario: m.funcionario_id,
          nome: m.funcionario_nome || "",
          email: m.funcionario_email || "",
          telefone: m.funcionario_telefone || "",
          salario: m.funcionario_salario
            ? `R$ ${parseFloat(m.funcionario_salario).toFixed(2)}`
            : "R$ 0,00",
          crm: m.crm,
          id_especialidade: m.id_especialidade,
          especialidade: m.nome_especialidade || "-",
        }))
      );
    } catch (erro) {
      console.error("Erro ao carregar médicos:", erro);
      toast.error("Erro ao carregar médicos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarMedicos();
  }, []);

  async function deletarMedico(id) {
    if (!window.confirm("Tem certeza que deseja deletar este médico?")) return;

    try {
      await api.delete(`/medicos/${id}`);
      toast.success("Médico deletado com sucesso!");
      carregarMedicos();
    } catch (erro) {
      console.error("Erro ao deletar médico:", erro);
      const mensagem =
        erro.response?.data?.erro || erro.message || "Erro ao deletar médico.";
      toast.error(mensagem);
    }
  }

  const medicosFiltrados = medicos.filter((m) =>
    (m.nome || "").toLowerCase().includes(busca.toLowerCase()) ||
    (m.email || "").toLowerCase().includes(busca.toLowerCase()) ||
    (m.crm || "").toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="pagina-medicos">
      <Sidebar definirSidebarAberta={setSidebarAberta} />
      <div
        className={`conteudo-principal ${
          sidebarAberta ? "menu-aberto" : "menu-colapsado"
        }`}
      >
        <DashboardHeader />
        <main className="area-principal">
          <CabecalhoMedicos abrirModalCadastrar={() => setModalCadastrarAberto(true)} />

          <FiltroMedicos busca={busca} setBusca={setBusca} />

          {loading ? (
            <div className="caixa-carregando">Carregando médicos...</div>
          ) : medicosFiltrados.length ? (
            <TabelaMedicos
              medicos={medicosFiltrados}
              deletarMedico={deletarMedico}
              aoEditar={(medico) => {
                setMedicoSelecionado(medico);
                setModalEditarAberto(true);
              }}
            />
          ) : (
            <EstadoVazio busca={busca} />
          )}
        </main>
      </div>

      {modalCadastrarAberto && (
        <CadastrarMedicoModal
          onClose={() => setModalCadastrarAberto(false)}
          onCadastrado={carregarMedicos}
        />
      )}

      {modalEditarAberto && medicoSelecionado && (
        <EditarMedicoModal
          medico={medicoSelecionado}
          onClose={() => {
            setModalEditarAberto(false);
            setMedicoSelecionado(null);
          }}
          onAtualizado={() => {
            carregarMedicos();
            setModalEditarAberto(false);
            setMedicoSelecionado(null);
          }}
        />
      )}
    </div>
  );
}
