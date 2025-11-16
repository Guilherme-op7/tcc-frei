import { useState } from "react";
import { toast } from "sonner";
import Sidebar from "../../../../components/Sidebar/Sidebar";
import DashboardHeader from "../../../../components/Header/DashboardHeader";
import api from "../../../../api";
import "./CadastroUsuariosPage.scss";

export default function CadastroUsuariosPage() {
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    tipo_usuario: "admin",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.senha !== form.confirmarSenha) {
      toast.error("As senhas não coincidem!");
      return;
    }

    if (form.senha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        tipo_usuario: form.tipo_usuario,
      };

      await api.post("/criar/conta", payload);
      toast.success("Usuário criado com sucesso!");
      setForm({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        tipo_usuario: "admin",
      });
    } catch (erro) {
      console.error("Erro ao cadastrar usuário:", erro);
      const mensagem = erro.response?.data?.erro || erro.message || "Erro ao criar conta. Tente novamente.";
      toast.error(mensagem);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pagina-cadastro-usuarios">
      <Sidebar definirSidebarAberta={setSidebarAberta} />
      <div className={`conteudo-principal ${sidebarAberta ? "menu-aberto" : "menu-colapsado"}`}>
        <DashboardHeader />
        <main className="area-principal">
          <div className="cabecalho-secao">
            <div>
              <h1>Cadastro de Usuários</h1>
              <p>Cadastre novos administradores e médicos no sistema</p>
            </div>
          </div>

          <div className="formulario-cadastro">
            <form onSubmit={handleSubmit} className="form-cadastro">
              <div className="form-group">
                <label>Tipo de Usuário *</label>
                <select
                  name="tipo_usuario"
                  value={form.tipo_usuario}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="admin">Administrador</option>
                  <option value="medico">Médico</option>
                </select>
              </div>

              <div className="form-group">
                <label>Nome Completo *</label>
                <input
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Digite o nome completo"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Senha *</label>
                <input
                  type="password"
                  name="senha"
                  value={form.senha}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Confirmar Senha *</label>
                <input
                  type="password"
                  name="confirmarSenha"
                  value={form.confirmarSenha}
                  onChange={handleChange}
                  placeholder="Confirme sua senha"
                  required
                  className="form-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading || form.senha !== form.confirmarSenha || form.senha.length < 6}
                className="btn-cadastrar"
              >
                {loading ? "Cadastrando..." : "Cadastrar Usuário"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}


