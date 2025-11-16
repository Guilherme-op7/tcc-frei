import { Router } from "express";
import { getAuthentication } from "../utils/jwt.js";
import { buscarPacientePorEmail, contarConsultasAgendadas, contarConsultasRealizadas, contarPrescricoesAtivas } from "../repository/PacienteRepository.js";
import { BuscarProximasConsultasPaciente, BuscarHistoricoConsultasPaciente } from "../repository/ConsultasRepository.js";
import { listarPrescricoesPorPaciente } from "../repository/PrescricoesRepository.js";

const endpoints = Router();
const autenticador = getAuthentication();

endpoints.get('/paciente/meus-dados', autenticador, async (req, res) => {
    try {
        let userEmail = req.user.email;
        let paciente = await buscarPacientePorEmail(userEmail);

        if (!paciente) {
            return res.status(404).json({ erro: 'Paciente não encontrado' });
        }

        res.status(200).json(paciente);
    } 
    
    catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

endpoints.get('/paciente/estatisticas', autenticador, async (req, res) => {
    try {
        let userEmail = req.user.email;
        let paciente = await buscarPacientePorEmail(userEmail);

        if (!paciente) {
            return res.status(404).json({ erro: 'Paciente não encontrado' });
        }

        let consultasAgendadas = await contarConsultasAgendadas(paciente.id);
        let consultasRealizadas = await contarConsultasRealizadas(paciente.id);
        let prescricoesAtivas = await contarPrescricoesAtivas(paciente.id);

        res.status(200).json({
            consultasAgendadas,
            consultasRealizadas,
            prescricoesAtivas
        });

    } 
    
    catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

endpoints.get('/paciente/proximas-consultas', autenticador, async (req, res) => {
    try {
        let userEmail = req.user.email;
        let paciente = await buscarPacientePorEmail(userEmail);

        if (!paciente) {
            return res.status(404).json({ erro: 'Paciente não encontrado' });
        }

        let consultas = await BuscarProximasConsultasPaciente(paciente.id);
        res.status(200).json(consultas);
    } 
    
    catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

endpoints.get('/paciente/historico', autenticador, async (req, res) => {
    try {
        let userEmail = req.user.email;
        let paciente = await buscarPacientePorEmail(userEmail);

        if (!paciente) {
            return res.status(404).json({ erro: 'Paciente não encontrado' });
        }

        let consultas = await BuscarHistoricoConsultasPaciente(paciente.id);
        let prescricoes = await listarPrescricoesPorPaciente(paciente.id);

        res.status(200).json({
            consultas,
            prescricoes
        });
    } 
    
    catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

export default endpoints;


