import { Router } from "express";
import { getAuthentication } from "../utils/jwt.js";
import { connection } from "../config/connection.js";

const autenticador = getAuthentication();
const endpoints = Router();

endpoints.get("/especialidades", autenticador, async (req, res) => {
    try {
        const [resultados] = await connection.query(
            `SELECT * FROM especialidades ORDER BY nome ASC`
        );
        res.status(200).send(resultados);
    } catch (err) {
        console.error("Erro ao listar especialidades:", err);
        res.status(500).send({ erro: err.message || "Erro ao buscar especialidades" });
    }
});

export default endpoints;

