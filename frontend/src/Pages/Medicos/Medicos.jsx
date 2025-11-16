import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../../api";
import "./MedicosPage.scss";
import Header from "./Header";

export default function MedicosPage() {
  const [loading, setLoading] = useState(true);
  const [medico, setMedico] = useState(null);
  const [estatisticas, setEstatisticas] = useState({
    meusPacientes: 0,
    consultasAgendadas: 0,
    atendimentos: 0,
    totalConsultas: 0,
  });
  const [proximosAtendimentos, setProximosAtendimentos] = useState([]);
  const [meusPacientes, setMeusPacientes] = useState([]);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [resMedico, resEstatisticas, resProximos, resPacientes] = await Promise.all([
          api.get("/medico/meus-dados"),
          api.get("/medico/estatisticas"),
          api.get("/medico/proximos-atendimentos"),
          api.get("/medico/meus-pacientes"),
        ]);

        setMedico(resMedico.data);
        setEstatisticas(resEstatisticas.data);
        setProximosAtendimentos(resProximos.data || []);
        setMeusPacientes(resPacientes.data || []);
      } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        toast.error("Erro ao carregar dados do médico");
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  function formatarData(data) {
    if (!data) return "";
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR");
  }

  function formatarHora(data) {
    if (!data) return "";
    const date = new Date(data);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatarDataHora(data) {
    if (!data) return "";
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR");
  }

  if (loading) {
    return (
      <div className="medico-dashboard">
        <Header />
        <div className="conteudo">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!medico) {
    return (
      <div className="medico-dashboard">
        <Header />
        <div className="conteudo">
          <p>Médico não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="medico-dashboard">
      <Header />

      <div className="conteudo">
        <section className="perfil-medico">
          <div className="perfil-info">
            <a href="#" className="perfil-link">
              <i className="fa-solid fa-user-doctor"></i> Meu Perfil médico
            </a>
            <div className="dados">
              <p><strong>Nome</strong><br />{medico.funcionario_nome || medico.nome || "-"}</p>
              <p><strong>CRM</strong><br />{medico.crm || "-"}</p>
              <p><strong>UBS</strong><br />{medico.nome_unidade || "-"}</p>
              <p><strong>Especialidade</strong><br />{medico.nome_especialidade || "-"}</p>
            </div>
            <span className="email">{medico.funcionario_email || medico.email || "-"}</span>
          </div>
        </section>

        <section className="cards-resumo">
          <div className="card azul">
            <h3>Meus Pacientes</h3>
            <span>{estatisticas.meusPacientes || 0}</span>
          </div>
          <div className="card verde">
            <h3>Consultas Agendadas</h3>
            <span>{estatisticas.consultasAgendadas || 0}</span>
          </div>
          <div className="card roxo">
            <h3>Atendimentos</h3>
            <span>{estatisticas.atendimentos || 0}</span>
          </div>
          <div className="card laranja">
            <h3>Total Consultas</h3>
            <span>{estatisticas.totalConsultas || 0}</span>
          </div>
        </section>

        <section className="proximos-atendimentos">
          <h2>Meus Próximos Atendimentos</h2>

          {proximosAtendimentos.length > 0 ? (
            proximosAtendimentos.map((atendimento) => (
              <div key={atendimento.id} className="atendimento">
                <div className="linha">
                  <p><strong>Paciente:</strong> {atendimento.nome_paciente || "-"}</p>
                  <p><strong>Data:</strong> {formatarData(atendimento.data_hora)}</p>
                  <p><strong>Horário:</strong> {formatarHora(atendimento.data_hora)}</p>
                  <span className={`status ${atendimento.tipo_consulta?.toLowerCase().includes('alta') ? 'alta' : 'normal'}`}>
                    {atendimento.tipo_consulta || "Consulta Normal"}
                  </span>
                </div>
                <p className="obs"><strong>Observação:</strong> {atendimento.unidade || "Avaliação de rotina."}</p>
              </div>
            ))
          ) : (
            <p>Nenhum atendimento agendado</p>
          )}
        </section>

        <section className="meus-pacientes">
          <h2>Meus Pacientes</h2>

          {meusPacientes.length > 0 ? (
            meusPacientes.map((paciente) => (
              <div key={paciente.id} className="paciente">
                <div>
                  <p><strong>Nome:</strong> {paciente.nome || "-"}</p>
                  <p className="fone">{paciente.telefone || "-"}</p>
                </div>
                <div>
                  <p><strong>Informações:</strong> Tipo: {paciente.tipo_sanguineo || "-"}</p>
                  <p className="alergias">Alergias: {paciente.alergias || "Nenhuma"}</p>
                </div>
                <div>
                  <p><strong>Consultas:</strong> {paciente.total_consultas || 0} total / {paciente.consultas_agendadas || 0} agendada</p>
                  <p><strong>Última:</strong> {paciente.ultima_consulta ? formatarDataHora(paciente.ultima_consulta) : "-"}</p>
                  <p>Consulta de Rotina</p>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum paciente encontrado</p>
          )}
        </section>
      </div>
    </div>
  );
}
