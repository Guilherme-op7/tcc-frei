import { Router } from "express";
import { getAuthentication } from "../utils/jwt.js";
import { ListarEspecialidades } from "../repository/EspecialidadeRepository.js";

const autenticador = getAuthentication();
const endpoints = Router();

endpoints.get('/especialidades', autenticador, async (req, res) => {
    try {
        let dados = req.body;

        let resposta = await ListarEspecialidades(dados);

        res.status(200).send(resposta)
    }

    catch (err) {
        console.error("Erro ao listar especialidades:", err);
        res.status(500).send({ erro: err.message || "Erro ao buscar especialidades" });
    }
})

export default endpoints;