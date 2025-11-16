import { Router } from "express";
import { getAuthentication } from "../utils/jwt.js";
import { AtualizarConsulta, BuscarConsultaPorMedico, BuscarConsultaPorPaciente, BuscarConsultaPorUnidade, CriarConsulta, DeletarConsulta, ListarConsultas } from "../repository/ConsultasRepository.js";

const endpoints = Router();
const autenticador = getAuthentication();

endpoints.get('/consultas', autenticador, async (req, res) => {
    try {
        let resposta = await ListarConsultas();
        res.status(200).json(resposta);
    }

    catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

endpoints.get('/consultas/paciente/:id', autenticador, async (req, res) => {
    try {
        let resposta = await BuscarConsultaPorPaciente(req.params.id);
        res.status(200).json(resposta);
    }

    catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

endpoints.get('/consultas/medico/:id', autenticador, async (req, res) => {
    try {
        let resposta = await BuscarConsultaPorMedico(req.params.id);
        res.status(200).json(resposta);
    }

    catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

endpoints.get('/consultas/unidade', autenticador, async (req, res) => {
    try {
        let unidade = req.query.nome;
        let resposta = await BuscarConsultaPorUnidade(unidade);
        res.status(200).json(resposta);
    }

    catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

endpoints.post('/consultas', autenticador, async (req, res) => {
    try {
        let resposta = await CriarConsulta(req.body);
        res.status(201).json(resposta);
    }

    catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

endpoints.put('/consultas/:id', autenticador, async (req, res) => {
    try {
        let resposta = await AtualizarConsulta(req.params.id, req.body);
        res.status(200).json(resposta);
    }

    catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

endpoints.delete('/consultas/:id', autenticador, async (req, res) => {
    try {
        let resposta = await DeletarConsulta(req.params.id);
        res.status(200).json(resposta);
    }

    catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

export default endpoints;
