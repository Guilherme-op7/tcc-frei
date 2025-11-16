import { useState } from "react";
import {
  Calendar,
  FileText,
  User,
  LogOut,
  X,
  Plus,
  Download,
} from "lucide-react";
import { toast } from "sonner";

import imgLogo from "../../assets/images/logo.png";
import { useNavigate } from "react-router";

export default function PacientesPa() {
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const handleExportData = () => {
    toast.success("Dados exportados com sucesso!");

    const data = {
      nome: "João Santos Da Silva",
      cpf: "123.456.789-00",
      dataNascimento: "1983-02-15",
      consultas: 2,
    };

    console.log("Exportando:", data);
  };

  function handleLogout() {


    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/");

    toast.success("Logout realizado com sucesso!")

  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* ===================== CABEÇALHO ===================== */}
      <header className="bg-gradient-to-r from-cyan-100/40 to-cyan-50/40 shadow-lg px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={imgLogo} alt="Logo SUS" className="w-14 h-14" />
            <div>
              <h1 className="text-black font-semibold text-lg">Sistema de Gestão SUS</h1>
              <p className="text-black text-sm md:text-base">Paciente - João Santos</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm text-black">Paciente</p>
              <p className="text-black">João Santos</p>
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

      {/* ===================== CONTEÚDO ===================== */}
      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* ===================== DADOS PESSOAIS ===================== */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-cyan-100/30 to-white/30 rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6" />
              <h2 className="text-black font-semibold text-lg">Meus Dados Pessoais</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Item label="Nome Completo" valor="João Santos Da Silva" />
              <Item label="Data de Nascimento" valor="15/02/1983" />
              <Item label="Tipo Sanguíneo" valor="O+" />
              <Item label="CPF" valor="123.456.789-00" />
              <Item label="Endereço" valor="Rua das Flores, 123 - Centro" />
              <Item label="Telefone" valor="(11) 98078-4576" />
              <Item label="Cartão SUS" valor="123456789012345" />

              <div className="sm:col-span-2">
                <p className="text-black mb-1 font-medium">Alergias</p>
                <p className="text-red-500">Paracetamol, Sertralina</p>
              </div>
            </div>

          </div>
        </section>

        {/* ===================== CARDS ===================== */}
        <section className="mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            <Card cor="#75B7F5" titulo="Consultas Agendadas" valor="2">
              <Calendar className="w-6 h-6" />
            </Card>

            <Card cor="#65D9D3" titulo="Consultas Realizadas" valor="2">
              <FileText className="w-6 h-6" />
            </Card>

            <Card cor="#9792ED" titulo="Prescrições Ativas" valor="1">
              <X className="w-6 h-6" />
            </Card>

          </div>
        </section>

        {/* ===================== CONSULTAS ===================== */}
        <section className="mb-10">
          <div className="bg-white/40 backdrop-blur-lg rounded-xl shadow-lg p-8 border border-gray-300/25">
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-black font-semibold text-lg">Minhas Próximas Consultas</h2>

              <button
                onClick={() => setOpenModal(true)}
                className="bg-[#75B7F5] hover:bg-[#5fa3e0] text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Agendar Consulta
              </button>
            </div>

            {/* CARD DA CONSULTA */}
            <div className="border border-gray-300/50 rounded-lg p-6 bg-white/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                <ConsultaInfo label="Médico" valor="Dr. Carlos Oliveira" extra="Clínica Geral" />
                <ConsultaInfo label="Data" valor="15/01/2024" />
                <ConsultaInfo label="Horário" valor="14:00" />
                <ConsultaInfo label="Local" valor="UBS Centro" tag="Consulta" />

              </div>
            </div>

          </div>
        </section>

        {/* ===================== HISTÓRICO ===================== */}
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

            {/* HISTÓRICO PRINCIPAL */}
            <HistoricoItem
              data="14/01/2024"
              diagnostico="Resfriado comum"
              sinais={[
                "Pressão: 120/80",
                "Peso: 65kg",
                "Temperatura: 36.5°C",
                "Frequência Cardíaca: 72bpm",
              ]}
              prescricao="Paracetamol 500mg – 1 comprimido de 8/8h por 3 dias"
              observacoes="Paciente apresenta sintomas leves. Repouso recomendado."
              retorno="18/02/2024"
            />

            {showFullHistory && (
              <HistoricoItem
                data="10/12/2023"
                diagnostico="Consulta de rotina – Tudo normal"
                prescricao=""
                observacoes="Paciente saudável e exames em ordem."
              />
            )}
          </div>
        </section>

      </main>

      {/* ===================== MODAL ===================== */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg p-6">

            <h2 className="text-lg font-semibold mb-4">Agendar Nova Consulta</h2>

            <div className="space-y-4">

              <div>
                <label className="text-sm mb-1 block">Especialidade</label>
                <select className="w-full p-2 border rounded-md">
                  <option>Clínica Geral</option>
                  <option>Cardiologia</option>
                  <option>Dermatologia</option>
                  <option>Ortopedia</option>
                </select>
              </div>

              <div>
                <label className="text-sm mb-1 block">Data Preferencial</label>
                <input type="date" className="w-full p-2 border rounded-md" />
              </div>

              <div>
                <label className="text-sm mb-1 block">Unidade de Saúde</label>
                <select className="w-full p-2 border rounded-md">
                  <option>UBS Centro</option>
                  <option>UBS Vila Nova</option>
                  <option>Hospital Central</option>
                </select>
              </div>

              <button
                className="w-full bg-[#75B7F5] hover:bg-[#5fa3e0] text-white py-2 rounded-md"
                onClick={() => {
                  toast.success("Consulta agendada!");
                  setOpenModal(false);
                }}
              >
                Confirmar Agendamento
              </button>

              <button
                className="w-full mt-2 py-2 border rounded-md"
                onClick={() => setOpenModal(false)}
              >
                Cancelar
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* ===================== COMPONENTES AUXILIARES ===================== */

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
