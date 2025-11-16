import { Edit, Trash2 } from "lucide-react";
import "../Styles/LinhaMedico.scss";

export default function LinhaMedico({ medico, deletarMedico, aoEditar }) {
  return (
    <tr>
      <td>
        <div className="info-medico">
          <strong>{medico.nome}</strong>
          <span className="email">{medico.email}</span>
        </div>
      </td>
      <td>{medico.crm}</td>
      <td>{medico.especialidade}</td>
      <td>{medico.telefone || "-"}</td>
      <td>{medico.salario}</td>
      <td>
        <div className="acoes">
          <button className="btn-editar" onClick={() => aoEditar(medico)}>
            <Edit size={16} />
          </button>
          <button className="btn-deletar" onClick={() => deletarMedico(medico.id)}>
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

