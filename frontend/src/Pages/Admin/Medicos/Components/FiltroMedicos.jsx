import { Search } from "lucide-react";
import "../Styles/FiltroMedicos.scss";

export default function FiltroMedicos({ busca, setBusca }) {
  return (
    <div className="filtro-medicos">
      <div className="campo-busca">
        <Search size={20} />
        <input
          type="text"
          placeholder="Buscar por nome, email ou CRM..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>
    </div>
  );
}

