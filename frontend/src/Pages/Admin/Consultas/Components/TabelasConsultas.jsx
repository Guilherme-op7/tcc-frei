import { Calendar, Clock, User, MapPin, Edit, Trash2 } from "lucide-react";
import "../Styles/TabelasConsultas.scss";

export default function TabelaConsultas({ consultas, aoDeletar, aoEditar }) {
  const classeStatus = (status) => `status status-${(status || "").toLowerCase()}`;

  if (!consultas || consultas.length === 0) {
    return (
      <div className="estado-vazio">
        <Calendar size={48} />
        <h3>Nenhuma consulta encontrada</h3>
        <p>Ajuste os filtros ou agende uma nova consulta.</p>
      </div>
    );
  }

  return (
    <div className="tabela-container">
      <table>
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Data/Hora</th>
            <th>Tipo</th>
            <th>Unidade</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {consultas.map((c) => {
            const dataObj = c?.data_hora ? new Date(c.data_hora) : null;
            const dataFormatada = dataObj && !isNaN(dataObj.getTime()) ? dataObj.toLocaleDateString("pt-BR") : "-";
            const horaFormatada = dataObj && !isNaN(dataObj.getTime()) ? dataObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "-";

            return (
              <tr key={c.id}>
                <td>
                  <div className="paciente-cell">
                    <User size={16} />
                    {c?.nome_paciente || "-"}
                  </div>
                </td>
                <td>{c?.nome_medico || "-"}</td>
                <td>
                  <div className="data-cell">
                    <Calendar size={14} />
                    <span>{dataFormatada}</span>
                    <Clock size={14} />
                    <span>{horaFormatada}</span>
                  </div>
                </td>
                <td>{c?.tipo_consulta || "-"}</td>
                <td>
                  <div className="unidade-cell">
                    <MapPin size={14} />
                    <span>{c?.unidade || "-"}</span>
                  </div>
                </td>
                <td>
                  <span className={classeStatus(c?.status)}>{(c?.status || "-").replace("_", " ")}</span>
                </td>
                <td className="acoes">
                  <button onClick={() => aoEditar(c)}><Edit size={16} /></button>
                  <button className="delete" onClick={() => aoDeletar(c.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
