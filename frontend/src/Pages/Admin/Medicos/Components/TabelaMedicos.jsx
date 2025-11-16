import LinhaMedico from "./LinhaMedico";
import "../Styles/TabelaMedicos.scss";

export default function TabelaMedicos({ medicos, deletarMedico, aoEditar }) {
  return (
    <div className="cartao-tabela">
      <div className="tabela-container">
        <table className="tabela-medicos">
          <thead>
            <tr>
              <th>Médico</th>
              <th>CRM</th>
              <th>Especialidade</th>
              <th>Contato</th>
              <th>Salário</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {medicos.map((m) => (
              <LinhaMedico 
                key={m.id} 
                medico={m} 
                deletarMedico={deletarMedico}
                aoEditar={aoEditar}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

