import { useState } from "react";
import { Calendar, FileText, User, LogOut, X, Plus, Download } from "lucide-react";

export default function PacientesPa() {
  const [showFullHistory, setShowFullHistory] = useState(false);

  const handleExportData = () => {
    toast.success("Dados exportados com sucesso!");
    // Simulação de export
    const data = {
      nome: "João Santos Da Silva",
      cpf: "123.456.789-00",
      dataNascimento: "1983-02-15",
      consultas: 2,
    };
    console.log("Exportando:", data);
  };

  const handleLogout = () => {
    toast.info("Logout realizado com sucesso!");
  };

  return (
    <div className="min-h-screen bg-white">
<header className="bg-gradient-to-r from-cyan-100/35 to-cyan-50/35 shadow-lg px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <img src={imgLogo} alt="Logo SUS" className="w-12 h-12 md:w-16 md:h-16 object-cover" />
            <div>
              <h1 className="text-black">Sistema de Gestão SUS</h1>
              <p className="text-black text-sm md:text-base">Paciente - João Santos</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm text-black">Paciente</p>
              <p className="text-black">João Santos</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="rounded-full bg-white/20 hover:bg-white/30"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8">
<section className="mb-8">
          <div className="bg-gradient-to-r from-cyan-100/25 to-white/25 rounded-xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-6 h-6" />
              <h2 className="text-black">Meus Dados Pessoais</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-black mb-1">Nome Completo</p>
                <p className="text-black/80">João Santos Da Silva</p>
              </div>
              
              <div>
                <p className="text-black mb-1">Data de Nascimento</p>
                <p className="text-black/80">15/02/1983</p>
              </div>
              
              <div>
                <p className="text-black mb-1">Tipo Sanguíneo</p>
                <p className="text-black/80">O+</p>
              </div>
              
              <div>
                <p className="text-black mb-1">CPF</p>
                <p className="text-black/80">123.456.789-00</p>
              </div>
              
              <div>
                <p className="text-black mb-1">Endereço</p>
                <p className="text-black/80">Rua das Flores, 123 - Centro</p>
              </div>
              
              <div>
                <p className="text-black mb-1">Telefone</p>
                <p className="text-black/80">(11) 98078-4576</p>
              </div>
              
              <div>
                <p className="text-black mb-1">Cartão SUS</p>
                <p className="text-black/80">123456789012345</p>
              </div>
              
              <div className="sm:col-span-2">
                <p className="text-black mb-1">Alergias</p>
                <p className="text-red-500">Paracetamol, Sertralina</p>
              </div>
            </div>
          </div>
        </section> 

          <section className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Consultas Agendadas */}
            <Card className="bg-[#75B7F5] text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-white/90 mb-2">Consultas Agendadas</p>
                    <p className="text-white">2</p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          <Card className="bg-[#65D9D3] text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-white/90 mb-2">Consultas Realizadas</p>
                    <p className="text-white">2</p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <FileText className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
<Card className="bg-[#9792ED] text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer sm:col-span-2 lg:col-span-1">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-white/90 mb-2">Prescrições Ativas</p>
                    <p className="text-white">1</p>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <X className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
           <section className="mb-8">
          <div className="bg-gradient-to-r from-white/11 to-green-200/6 rounded-xl shadow-lg p-6 md:p-8 border border-gray-300/25">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <h2 className="text-black">Minhas Próximas Consultas</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[#75B7F5] hover:bg-[#5fa3e0] text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Agendar Consulta
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agendar Nova Consulta</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="text-sm mb-2 block">Especialidade</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Clínica Geral</option>
                        <option>Cardiologia</option>
                        <option>Dermatologia</option>
                        <option>Ortopedia</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm mb-2 block">Data Preferencial</label>
                      <input type="date" className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                      <label className="text-sm mb-2 block">Unidade de Saúde</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>UBS Centro</option>
                        <option>UBS Vila Nova</option>
                        <option>Hospital Central</option>
                      </select>
                    </div>
                    <Button 
                      className="w-full bg-[#75B7F5] hover:bg-[#5fa3e0]"
                      onClick={() => toast.success("Consulta agendada com sucesso!")}
                    >
                      Confirmar Agendamento
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="bg-gradient-to-r from-white/11 to-green-200/6 rounded-xl p-4 md:p-6 border border-gray-300/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div>
                  <p className="text-black mb-1">Médico</p>
                  <p className="text-black/60 text-sm mb-2">Clínica Geral</p>
                  <p className="text-black">Dr. Carlos Oliveira</p>
                </div>
                
                <div>
                  <p className="text-black mb-1">Data</p>
                  <p className="text-black">15/01/2024</p>
                </div>
                
                <div>
                  <p className="text-black mb-1">Horário</p>
                  <p className="text-black">14:00</p>
                </div>
                
                <div>
                  <p className="text-black mb-1">Local</p>
                  <p className="text-black">UBS Centro</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-white/50 rounded-md border border-gray-300/50 text-xs">
                    Consulta
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

       
        <section>
          <div className="bg-white/6 rounded-xl shadow-lg p-6 md:p-8 border border-gray-300/20">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <h2 className="text-black">Histórico Médico</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFullHistory(!showFullHistory)}
                >
                  {showFullHistory ? "Ver Menos" : "Ver Mais"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportData}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            
            <div className="border border-gray-300/55 rounded-md p-4 md:p-6">
              <p className="text-black mb-6">Data: 14/01/2024</p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Coluna Esquerda */}
                <div className="space-y-4">
                  {/* Diagnóstico */}
                  <div>
                    <p className="text-black mb-2">Diagnóstico</p>
                    <div className="bg-gradient-to-r from-white/22 to-green-200/22 rounded-lg p-3">
                      <p className="text-black">Resfriado comum</p>
                    </div>
                  </div>

                  
                  <div>
                    <p className="text-black mb-2">Sinais Vitais</p>
                    <div className="bg-gradient-to-r from-white/22 to-green-200/22 rounded-lg p-3 space-y-1">
                      <p className="text-black">Pressão: 120/80</p>
                      <p className="text-black">Peso: 65kg</p>
                      <p className="text-black">Temperatura: 36.5°C</p>
                      <p className="text-black">Frequência Cardíaca: 72bpm</p>
                    </div>
                  </div>

                  
                  <div className="bg-gradient-to-r from-white/22 to-green-200/22 rounded-lg p-3">
                    <p className="text-black text-center">
                      Próximo retorno: 18/02/2024
                    </p>
                  </div>
                </div>

                
                <div className="space-y-4">
                  {/* Prescrição */}
                  <div>
                    <p className="text-black mb-2">Prescrição</p>
                    <div className="bg-gradient-to-r from-white/22 to-green-200/22 rounded-lg p-3">
                      <p className="text-black">
                        Paracetamol 500mg - 1 comprimido de 8/8h por 3 dias
                      </p>
                    </div>
                  </div>

                  
                  <div>
                    <p className="text-black mb-2">Observações</p>
                    <div className="bg-gradient-to-r from-green-200/12 to-green-200/22 rounded-lg p-3">
                      <p className="text-black">
                        Paciente apresenta sintomas leves. Repouso recomendado.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
            {showFullHistory && (
              <div className="mt-4 border border-gray-300/55 rounded-md p-4 md:p-6">
                <p className="text-black mb-4">Data: 10/12/2023</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <p className="text-black mb-2">Diagnóstico</p>
                    <div className="bg-gradient-to-r from-white/22 to-green-200/22 rounded-lg p-3">
                      <p className="text-black">Consulta de rotina - Check-up anual</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-black mb-2">Observações</p>
                    <div className="bg-gradient-to-r from-green-200/12 to-green-200/22 rounded-lg p-3">
                      <p className="text-black">
                        Todos os exames dentro da normalidade. Paciente saudável.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
