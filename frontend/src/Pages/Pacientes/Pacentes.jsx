import { useState, useEffect } from "react";
import { Calendar, FileText, User, LogOut, X, Plus, Download } from "lucide-react";
import { toast } from "sonner";
import api from "../../api";

import imgLogo from "../../assets/images/logo.png";
import { useNavigate } from "react-router";

export default function PacientesPa() {
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paciente, setPaciente] = useState(null);
  const [estatisticas, setEstatisticas] = useState({
    consultasAgendadas: 0,
    consultasRealizadas: 0,
    prescricoesAtivas: 0,
  });
  const [proximasConsultas, setProximasConsultas] = useState([]);
  const [historico, setHistorico] = useState({ consultas: [], prescricoes: [] });
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        const usuarioStorage = localStorage.getItem("usuario");
        if (usuarioStorage) {
          setUsuario(JSON.parse(usuarioStorage));
        }

        const [resPaciente, resEstatisticas, resProximas, resHistorico] = await Promise.all([
          api.get("/paciente/meus-dados"),
          api.get("/paciente/estatisticas"),
          api.get("/paciente/proximas-consultas"),
          api.get("/paciente/historico"),
        ]);

        setPaciente(resPaciente.data);
        setEstatisticas(resEstatisticas.data);
        setProximasConsultas(resProximas.data || []);
        setHistorico(resHistorico.data || { consultas: [], prescricoes: [] });
      } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        toast.error("Erro ao carregar dados do paciente");
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  const handleExportData = () => {
    toast.success("Dados exportados com sucesso!");

    const data = {
      nome: paciente?.nome || "",
      cpf: paciente?.cpf || "",
      dataNascimento: paciente?.data_nascimento || "",
      consultas: estatisticas.consultasRealizadas,
    };

    console.log("Exportando:", data);
  };

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/");
    toast.success("Logout realizado com sucesso!");
  }

  function formatarData(data) {
    if (!data) return "";
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR");
  }

  function formatarDataHora(data) {
    if (!data) return "";
    const date = new Date(data);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatarHora(data) {
    if (!data) return "";
    const date = new Date(data);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-black">Carregando...</p>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-black">Paciente não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      <header className="bg-gradient-to-r from-cyan-100/40 to-cyan-50/40 shadow-lg px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={imgLogo} alt="Logo SUS" className="w-14 h-14" />
            <div>
              <h1 className="text-black font-semibold text-lg">Sistema de Gestão SUS</h1>
              <p className="text-black text-sm md:text-base">Paciente - {paciente.nome || usuario?.nome || ""}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm text-black">Paciente</p>
              <p className="text-black">{paciente.nome || usuario?.nome || ""}</p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-full bg-white/30 hover:bg-white/40 p-2"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">

        <section className="mb-10">
          <div className="bg-gradient-to-r from-cyan-100/30 to-white/30 rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6" />
              <h2 className="text-black font-semibold text-lg">Meus Dados Pessoais</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Item label="Nome Completo" valor={paciente.nome || "-"} />
              <Item label="Data de Nascimento" valor={formatarData(paciente.data_nascimento)} />
              <Item label="Tipo Sanguíneo" valor={paciente.tipo_sanguineo || "-"} />
              <Item label="CPF" valor={paciente.cpf || "-"} />
              <Item label="Endereço" valor={paciente.endereco || "-"} />
              <Item label="Telefone" valor={paciente.telefone || "-"} />
              <Item label="Cartão SUS" valor={paciente.cartao_sus || "-"} />

              <div className="sm:col-span-2">
                <p className="text-black mb-1 font-medium">Alergias</p>
                <p className="text-red-500">{paciente.alergias || "Nenhuma alergia registrada"}</p>
              </div>
            </div>

          </div>
        </section>

        <section className="mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            <Card cor="#75B7F5" titulo="Consultas Agendadas" valor={estatisticas.consultasAgendadas || 0}>
              <Calendar className="w-6 h-6" />
            </Card>

            <Card cor="#65D9D3" titulo="Consultas Realizadas" valor={estatisticas.consultasRealizadas || 0}>
              <FileText className="w-6 h-6" />
            </Card>

            <Card cor="#9792ED" titulo="Prescrições Ativas" valor={estatisticas.prescricoesAtivas || 0}>
              <X className="w-6 h-6" />
            </Card>

          </div>
        </section>

        <section className="mb-10">
          <div className="bg-white/40 backdrop-blur-lg rounded-xl shadow-lg p-8 border border-gray-300/25">
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-black font-semibold text-lg">Minhas Próximas Consultas</h2>


            </div>

            {proximasConsultas.length > 0 ? (
              proximasConsultas.map((consulta) => (
                <div key={consulta.id} className="border border-gray-300/50 rounded-lg p-6 bg-white/50 mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <ConsultaInfo 
                      label="Médico" 
                      valor={consulta.nome_medico || "Médico não informado"} 
                      extra={consulta.especialidade || ""} 
                    />
                    <ConsultaInfo label="Data" valor={formatarData(consulta.data_hora)} />
                    <ConsultaInfo label="Horário" valor={formatarHora(consulta.data_hora)} />
                    <ConsultaInfo label="Local" valor={consulta.unidade || "-"} tag={consulta.tipo_consulta || "Consulta"} />
                  </div>
                </div>
              ))
            ) : (
              <div className="border border-gray-300/50 rounded-lg p-6 bg-white/50">
                <p className="text-black/60">Nenhuma consulta agendada</p>
              </div>
            )}

          </div>
        </section>

        <section>
          <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-8 border">

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-black font-semibold text-lg">Histórico Médico</h2>

              <div className="flex gap-2">
                <button
                  className="border px-4 py-1 rounded-md"
                  onClick={() => setShowFullHistory(!showFullHistory)}
                >
                  {showFullHistory ? "Ver Menos" : "Ver Mais"}
                </button>

                <button
                  className="border px-4 py-1 rounded-md flex items-center gap-2"
                  onClick={handleExportData}
                >
                  <Download className="w-4 h-4" /> Exportar
                </button>
              </div>
            </div>

            {historico.consultas.length > 0 ? (
              <>
                {historico.consultas.slice(0, showFullHistory ? historico.consultas.length : 1).map((consulta, index) => {
                  const prescricao = historico.prescricoes.find(p => {
                    const prescDate = new Date(p.inicio);
                    const consultaDate = new Date(consulta.data_hora);
                    return Math.abs(prescDate - consultaDate) < 7 * 24 * 60 * 60 * 1000; // 7 dias de diferença
                  });

                  return (
                    <HistoricoItem
                      key={consulta.id || index}
                      data={formatarData(consulta.data_hora)}
                      diagnostico={consulta.tipo_consulta || "Consulta"}
                      prescricao={prescricao ? `${prescricao.medicamento} ${prescricao.dosagem || ""} – ${prescricao.frequencia || ""}` : ""}
                      observacoes={prescricao?.observacoes || ""}
                    />
                  );
                })}
              </>
            ) : (
              <p className="text-black/60">Nenhum histórico disponível</p>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}


function Item({ label, valor }) {
  return (
    <div>
      <p className="text-black mb-1 font-medium">{label}</p>
      <p className="text-black/80">{valor}</p>
    </div>
  );
}

function Card({ cor, titulo, valor, children }) {
  return (
    <div className="rounded-xl shadow-lg p-6 text-white" style={{ background: cor }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-white/90">{titulo}</p>
          <p className="text-white text-2xl font-semibold">{valor}</p>
        </div>
        <div className="bg-white/20 rounded-full p-3">{children}</div>
      </div>
    </div>
  );
}

function ConsultaInfo({ label, valor, extra, tag }) {
  return (
    <div>
      <p className="text-black mb-1">{label}</p>
      {extra && <p className="text-black/60 text-sm">{extra}</p>}
      <p className="text-black">{valor}</p>
      {tag && (
        <span className="inline-block mt-2 px-3 py-1 bg-white/50 rounded-md border text-xs">
          {tag}
        </span>
      )}
    </div>
  );
}

function HistoricoItem({ data, diagnostico, sinais = [], prescricao, observacoes, retorno }) {
  return (
    <div className="border border-gray-300/50 rounded-md p-6 mt-6">
      <p className="text-black mb-6">Data: {data}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="space-y-4">
          {diagnostico && (
            <div>
              <p className="text-black mb-1">Diagnóstico</p>
              <div className="bg-white/60 p-3 rounded-lg text-black">{diagnostico}</div>
            </div>
          )}

          {sinais.length > 0 && (
            <div>
              <p className="text-black mb-1">Sinais Vitais</p>
              <div className="bg-white/60 p-3 rounded-lg space-y-1 text-black">
                {sinais.map((s, index) => (
                  <p key={index}>{s}</p>
                ))}
              </div>
            </div>
          )}

          {retorno && (
            <div className="bg-white/60 rounded-lg p-3 text-center text-black">
              Próximo retorno: {retorno}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {prescricao && (
            <div>
              <p className="text-black mb-1">Prescrição</p>
              <div className="bg-white/60 p-3 rounded-lg text-black">{prescricao}</div>
            </div>
          )}

          {observacoes && (
            <div>
              <p className="text-black mb-1">Observações</p>
              <div className="bg-white/60 p-3 rounded-lg text-black">{observacoes}</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
