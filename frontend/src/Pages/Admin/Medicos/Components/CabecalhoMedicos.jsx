import { Plus } from "lucide-react";
import "../Styles/CabecalhoMedicos.scss";

export default function CabecalhoMedicos({ abrirModalCadastrar }) {
  return (
    <div className="cabecalho-secao">
      <div>
        <h1>Gestão de Médicos</h1>
        <p>Gerencie médicos e suas especialidades</p>
      </div>
      <div className="botoes-cabecalho">
        <button className="botao-azul" onClick={abrirModalCadastrar}>
          <Plus size={20} /> Novo Médico
        </button>
      </div>
    </div>
  );
}

