import { Router } from "express";
import { getAuthentication } from "../utils/jwt.js";
import { 
    buscarPacientePorEmail,
    contarConsultasAgendadas,
    contarConsultasRealizadas,
    contarPrescricoesAtivas
} from "../repository/PacienteRepository.js";
import {
    BuscarProximasConsultasPaciente,
    BuscarHistoricoConsultasPaciente
} from "../repository/ConsultasRepository.js";
import { listarPrescricoesPorPaciente } from "../repository/PrescricoesRepository.js";

const endpoints = Router();
const autenticador = getAuthentication();

// Buscar dados do paciente logado
endpoints.get('/paciente/meus-dados', autenticador, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const paciente = await buscarPacientePorEmail(userEmail);
        
        if (!paciente) {
            return res.status(404).json({ erro: 'Paciente não encontrado' });
        }

        res.status(200).json(paciente);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Buscar estatísticas do paciente
endpoints.get('/paciente/estatisticas', autenticador, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const paciente = await buscarPacientePorEmail(userEmail);
        
        if (!paciente) {
            return res.status(404).json({ erro: 'Paciente não encontrado' });
        }

        const [consultasAgendadas, consultasRealizadas, prescricoesAtivas] = await Promise.all([
            contarConsultasAgendadas(paciente.id),
            contarConsultasRealizadas(paciente.id),
            contarPrescricoesAtivas(paciente.id)
        ]);

        res.status(200).json({
            consultasAgendadas,
            consultasRealizadas,
            prescricoesAtivas
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Buscar próximas consultas do paciente
endpoints.get('/paciente/proximas-consultas', autenticador, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const paciente = await buscarPacientePorEmail(userEmail);
        
        if (!paciente) {
            return res.status(404).json({ erro: 'Paciente não encontrado' });
        }

        const consultas = await BuscarProximasConsultasPaciente(paciente.id);
        res.status(200).json(consultas);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Buscar histórico de consultas do paciente
endpoints.get('/paciente/historico', autenticador, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const paciente = await buscarPacientePorEmail(userEmail);
        
        if (!paciente) {
            return res.status(404).json({ erro: 'Paciente não encontrado' });
        }

        const consultas = await BuscarHistoricoConsultasPaciente(paciente.id);
        const prescricoes = await listarPrescricoesPorPaciente(paciente.id);

        res.status(200).json({
            consultas,
            prescricoes
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

export default endpoints;

