import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import api from "../../api";
import "./Header.scss";

export default function Header() {
  const navigate = useNavigate();
  const [medico, setMedico] = useState(null);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        const usuarioStorage = localStorage.getItem("usuario");
        if (usuarioStorage) {
          setUsuario(JSON.parse(usuarioStorage));
        }

        const res = await api.get("/medico/meus-dados");
        setMedico(res.data);
      } catch (erro) {
        console.error("Erro ao carregar dados do médico:", erro);
      }
    }

    carregarDados();
  }, []);

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/");
  }

  return (
    <header className="cabecalho-dashboard3">
      
      <div className="logo-container">
        <img src="src/assets/images/logo.png" alt="Logo SUS" />
      </div>

      
      <div className="perfil-container">
        <div className="info-perfil">
          <p className="nome-usuario">Médico</p>
          <p className="cargo-usuario">{medico?.nome || usuario?.nome || "Médico"}</p>
        </div>
        <button onClick={sair} className="botao-sair" title="Sair">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
