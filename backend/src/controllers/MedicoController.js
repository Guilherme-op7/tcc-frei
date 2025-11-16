import { Router } from "express";
import { getAuthentication } from "../utils/jwt.js";
import { 
    criarMedicoService, 
    listarMedicosService,   
    buscarMedicoPorIdService,   
    buscarMedicoPorNomeService,   
    atualizarMedicoService,   
    deletarMedicoService
} from "../services/MedicoService.js";

const autenticador = getAuthentication();
const endpoints = Router();

endpoints.get("/medicos", autenticador, async (req, res) => {
    try {
        const resposta = await listarMedicosService();
        res.status(200).send(resposta);
    } catch (err) {
        res.status(500).send({ erro: err.message || err });
    }
});

endpoints.get("/medicos/:id", autenticador, async (req, res) => {
    try {
        const id = req.params.id;
        const resposta = await buscarMedicoPorIdService(id);
        res.status(200).send(resposta);
    } catch (err) {
        res.status(404).send({ erro: err.message || err });
    }
});

endpoints.get("/filtrar/medicos", autenticador, async (req, res) => {
    try {
        const nome = req.query.nome;
        const resposta = await buscarMedicoPorNomeService(nome);
        res.status(200).send(resposta);
    } catch (err) {
        res.status(400).send({ erro: err.message || err });
    }
});

endpoints.post("/medicos", autenticador, async (req, res) => {
    try {
        const dados = req.body;
        const resposta = await criarMedicoService(dados);

        res.status(201).send({
            mensagem: "Médico cadastrado com sucesso!",
            id: resposta.insertId
        });
    } catch (err) {
        res.status(400).send({ erro: err.message || err });
    }
});

endpoints.put("/medicos/:id", autenticador, async (req, res) => {
    try {
        const id = req.params.id;
        const dados = req.body;

        await atualizarMedicoService(dados, id);

        res.status(200).send({ mensagem: "Médico atualizado com sucesso!" });
    } catch (err) {
        res.status(400).send({ erro: err.message || err });
    }
});

endpoints.delete("/medicos/:id", autenticador, async (req, res) => {
    try {
        const id = req.params.id;

        await deletarMedicoService(id);

        res.status(200).send({ mensagem: "Médico removido com sucesso!" });
    } catch (err) {
        res.status(400).send({ erro: err.message || err });
    }
});

export default endpoints;
