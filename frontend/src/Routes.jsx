import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./Pages/Admin/Dashboard/Components/Dashboard";
import FuncionariosPage from "./Pages/Admin/Funcionarios/Components/FuncionarioPage";
import PacientesPage from "./Pages/Admin/Pacientes/Components/PacientesPage";
import RelatoriosPage from "./Pages/Admin/Relatorios/Components/RelatoriosPage";
import MedicamentosPage from "./Pages/Admin/Medicamentos/Components/MedicamentosPage";
import LoginPage from "./Pages/Login/LoginPage";
import CadastroPage from "./Pages/Cadastro/CadastroPage";
import RotaProtegida from "./RotaProtegida";
import PacientesPag from "./Pages/Pacientes/Pacentes";
import ConsultasPage from "./Pages/Admin/Consultas/Components/App";
import MedicosPage from "./Pages/Medicos/Medicos";
import PaginaLanding from "./Pages/Landing/LandingPage";
import CadastroUsuariosPage from "./Pages/Admin/CadastroUsuarios/Components/CadastroUsuariosPage";
import MedicosAdminPage from "./Pages/Admin/Medicos/Components/MedicosPage";

export default function Navegacao() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <PaginaLanding />
        } />

        <Route path="/medicospage" element={
          <RotaProtegida role="medico" >

            <MedicosPage />
          </RotaProtegida>} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/cadastro" element={<CadastroPage />} />

        <Route path="/PacientesPage" element={
          <RotaProtegida role="paciente">

            <PacientesPag />
          </RotaProtegida>} />

        <Route path="/dashboard" element={
          <RotaProtegida role="admin">
            <Dashboard />
          </RotaProtegida>
        } />

        <Route path="/funcionarios" element={
          <RotaProtegida>
            <FuncionariosPage role="admin" />
          </RotaProtegida>
        } />

        <Route path="/medicos-admin" element={
          <RotaProtegida role="admin">
            <MedicosAdminPage />
          </RotaProtegida>
        } />

        <Route path="/cadastro-usuarios" element={
          <RotaProtegida role="admin">
            <CadastroUsuariosPage />
          </RotaProtegida>
        } />

        <Route path="/pacientes" element={
          <RotaProtegida>
            <PacientesPage role="admin" />
          </RotaProtegida>
        } />

        <Route path="/medicamentos" element={
          <RotaProtegida role="admin">
            <MedicamentosPage />
          </RotaProtegida>
        } />

        <Route path="/relatorios" element={
          <RotaProtegida role="admin">
            <RelatoriosPage />
          </RotaProtegida>
        } />

        <Route path="/consultas" element={
          <RotaProtegida role="admin">
            <ConsultasPage />
          </RotaProtegida>
        } />


      </Routes>
    </BrowserRouter>
  );
}
