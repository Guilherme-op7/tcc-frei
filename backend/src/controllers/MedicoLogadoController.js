import { Router } from "express";
import { getAuthentication } from "../utils/jwt.js";
import { BuscarMedicoPorEmail, ContarPacientesDoMedico, ContarConsultasAgendadasMedico, ContarAtendimentosMedico, ContarTotalConsultasMedico, ListarPacientesDoMedico } from "../repository/MedicosRepository.js";
import { BuscarProximasConsultasMedico } from "../repository/ConsultasRepository.js";

const endpoints = Router();
const autenticador = getAuthentication();

endpoints.get('/medico/meus-dados', autenticador, async (req, res) => {
    try {
        let userEmail = req.user.email;
        let medico = await BuscarMedicoPorEmail(userEmail);

        if (!medico) {
            return res.status(404).json({ erro: 'Médico não encontrado' });
        }

        res.status(200).json(medico);
    } 
    
    catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

endpoints.get('/medico/estatisticas', autenticador, async (req, res) => {
    try {
        let userEmail = req.user.email;
        let medico = await BuscarMedicoPorEmail(userEmail);

        if (!medico) {
            return res.status(404).json({ erro: 'Médico não encontrado' });
        }

        let meusPacientes = await ContarPacientesDoMedico(medico.id);
        let consultasAgendadas = await ContarConsultasAgendadasMedico(medico.id);
        let atendimentos = await ContarAtendimentosMedico(medico.id);
        let totalConsultas = await ContarTotalConsultasMedico(medico.id);

        res.status(200).json({
            meusPacientes,
            consultasAgendadas,
            atendimentos,
            totalConsultas
        });
    } 
    
    catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

endpoints.get('/medico/proximos-atendimentos', autenticador, async (req, res) => {
    try {
        let userEmail = req.user.email;
        let medico = await BuscarMedicoPorEmail(userEmail);

        if (!medico) {
            return res.status(404).json({ erro: 'Médico não encontrado' });
        }

        let consultas = await BuscarProximasConsultasMedico(medico.id);
        res.status(200).json(consultas);
    } 
    
    catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

endpoints.get('/medico/meus-pacientes', autenticador, async (req, res) => {
    try {
        let userEmail = req.user.email;
        let medico = await BuscarMedicoPorEmail(userEmail);

        if (!medico) {
            return res.status(404).json({ erro: 'Médico não encontrado' });
        }

        let pacientes = await ListarPacientesDoMedico(medico.id);
        res.status(200).json(pacientes);
    } 
    
    catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

export default endpoints;


