import { connection } from "../config/connection.js";

export async function ListarEspecialidades() {
    let [resultados] = 
        await connection.query(
            `SELECT * FROM especialidades ORDER BY nome ASC`
        )

    return resultados;
}