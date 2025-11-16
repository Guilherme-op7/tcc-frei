import { Router } from "express";
import { getAuthentication } from "../utils/jwt.js";
import {
    BuscarMedicoPorEmail,
    ContarPacientesDoMedico,
    ContarConsultasAgendadasMedico,
    ContarAtendimentosMedico,
    ContarTotalConsultasMedico,
    ListarPacientesDoMedico
} from "../repository/MedicosRepository.js";
import { BuscarProximasConsultasMedico } from "../repository/ConsultasRepository.js";

const endpoints = Router();
const autenticador = getAuthentication();

// Buscar dados do médico logado
endpoints.get('/medico/meus-dados', autenticador, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const medico = await BuscarMedicoPorEmail(userEmail);
        
        if (!medico) {
            return res.status(404).json({ erro: 'Médico não encontrado' });
        }

        res.status(200).json(medico);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Buscar estatísticas do médico
endpoints.get('/medico/estatisticas', autenticador, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const medico = await BuscarMedicoPorEmail(userEmail);
        
        if (!medico) {
            return res.status(404).json({ erro: 'Médico não encontrado' });
        }

        const [meusPacientes, consultasAgendadas, atendimentos, totalConsultas] = await Promise.all([
            ContarPacientesDoMedico(medico.id),
            ContarConsultasAgendadasMedico(medico.id),
            ContarAtendimentosMedico(medico.id),
            ContarTotalConsultasMedico(medico.id)
        ]);

        res.status(200).json({
            meusPacientes,
            consultasAgendadas,
            atendimentos,
            totalConsultas
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Buscar próximos atendimentos do médico
endpoints.get('/medico/proximos-atendimentos', autenticador, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const medico = await BuscarMedicoPorEmail(userEmail);
        
        if (!medico) {
            return res.status(404).json({ erro: 'Médico não encontrado' });
        }

        const consultas = await BuscarProximasConsultasMedico(medico.id);
        res.status(200).json(consultas);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Buscar pacientes do médico
endpoints.get('/medico/meus-pacientes', autenticador, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const medico = await BuscarMedicoPorEmail(userEmail);
        
        if (!medico) {
            return res.status(404).json({ erro: 'Médico não encontrado' });
        }

        const pacientes = await ListarPacientesDoMedico(medico.id);
        res.status(200).json(pacientes);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

export default endpoints;

