import "../Styles/EstadoVazio.scss";

export default function EstadoVazio({ busca }) {
  return (
    <div className="estado-vazio">
      <p>
        {busca
          ? "Nenhum médico encontrado com os filtros aplicados."
          : "Nenhum médico cadastrado ainda."}
      </p>
    </div>
  );
}

