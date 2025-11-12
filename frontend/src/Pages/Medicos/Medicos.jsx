import "./MedicosPage.scss";
import Header from "./Header";

export default function MedicosPage() {
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
              <p><strong>Nome</strong><br />Dr. Carlos Oliveira</p>
              <p><strong>CRM</strong><br />12345 SP</p>
              <p><strong>UBS</strong><br />Porte III</p>
              <p><strong>Especialidade</strong><br />Clínica Geral</p>
            </div>
            <span className="email">carlos.oliveira@ubs-sp.br</span>
          </div>
        </section>

        <section className="cards-resumo">
          <div className="card azul">
            <h3>Meus Pacientes</h3>
            <span>2</span>
          </div>
          <div className="card verde">
            <h3>Consultas Agendadas</h3>
            <span>2</span>
          </div>
          <div className="card roxo">
            <h3>Atendimentos</h3>
            <span>1</span>
          </div>
          <div className="card laranja">
            <h3>Total Consultas</h3>
            <span>3</span>
          </div>
        </section>

        <section className="proximos-atendimentos">
          <h2>Meus Próximos Atendimentos</h2>

          <div className="atendimento">
            <div className="linha">
              <p><strong>Paciente:</strong> João Santos</p>
              <p><strong>Data:</strong> 2025-07-17</p>
              <p><strong>Horário:</strong> 14:00</p>
              <span className="status normal">Consulta Normal</span>
            </div>
            <p className="obs"><strong>Observação:</strong> Avaliação de rotina.</p>
          </div>

          <div className="atendimento">
            <div className="linha">
              <p><strong>Paciente:</strong> Carlos Nunes</p>
              <p><strong>Data:</strong> 2025-08-02</p>
              <p><strong>Horário:</strong> 15:30</p>
              <span className="status alta">Alta</span>
            </div>
            <p className="obs"><strong>Observação:</strong> Consulta de retorno.</p>
          </div>
        </section>

        <section className="meus-pacientes">
          <h2>Meus Pacientes</h2>

          <div className="paciente">
            <div>
              <p><strong>Nome:</strong> João Santos</p>
              <p className="fone">(11) 98319-7755</p>
            </div>
            <div>
              <p><strong>Informações:</strong> Tipo: O+</p>
              <p className="alergias">Alergias: Paracetamol, Septalfan</p>
            </div>
            <div>
              <p><strong>Consultas:</strong> 3 total / 1 agendada</p>
              <p><strong>Última:</strong> 24-07-2025</p>
              <p>Hipertensão Arterial Leve</p>
            </div>
          </div>

          <div className="paciente">
            <div>
              <p><strong>Nome:</strong> Carlos Nunes</p>
              <p className="fone">(11) 95499-2848</p>
            </div>
            <div>
              <p><strong>Informações:</strong> Tipo: D-</p>
              <p className="alergias">Alergias: Aspirina, Dipirona</p>
            </div>
            <div>
              <p><strong>Consultas:</strong> 2 total / 1 agendada</p>
              <p><strong>Última:</strong> 30-04-2025</p>
              <p>Consulta de Rotina</p>
            </div>
          </div>

          <div className="paciente">
            <div>
              <p><strong>Nome:</strong> José Diniz</p>
              <p className="fone">(11) 95499-2848</p>
            </div>
            <div>
              <p><strong>Informações:</strong> Tipo: B-</p>
              <p className="alergias">Alergias: Aspirina, Dipirona</p>
            </div>
            <div>
              <p><strong>Consultas:</strong> 1 total / 1 agendada</p>
              <p><strong>Última:</strong> 30-04-2025</p>
              <p>Consulta de Rotina</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
