import { connection } from "../config/connection.js";

export async function CadastrarMedico(NovosDados) {
    const [resultados] = await connection.query(
        `INSERT INTO medicos (id_funcionario, nome, email, telefone, salario, crm, id_especialidade)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            NovosDados.id_funcionario,
            NovosDados.nome,
            NovosDados.email,
            NovosDados.telefone,
            NovosDados.salario,
            NovosDados.crm,
            NovosDados.id_especialidade
        ]
    );
    return resultados;
}

export async function ListarMedicos() {
    const [resultados] = await connection.query(`SELECT * FROM medicos`);
    return resultados;
}

export async function BuscarMedicoPorId(id) {
    const [resultados] = await connection.query(
        `SELECT * FROM medicos WHERE id = ?`, [id]
    );
    return resultados[0];
}

export async function BuscarMedicoPorNome(nome) {
    const [resultados] = await connection.query(
        `SELECT * FROM medicos WHERE nome LIKE ?`, [`%${nome}%`]
    );
    return resultados;
}

export async function AtualizarMedico(NovosDados, id) {
    const [resultados] = await connection.query(
        `UPDATE medicos
         SET id_funcionario = ?,
             nome = ?,
             email = ?,
             telefone = ?,
             salario = ?,
             crm = ?,
             id_especialidade = ?
         WHERE id = ?`,
        [
            NovosDados.id_funcionario,
            NovosDados.nome,
            NovosDados.email,
            NovosDados.telefone,
            NovosDados.salario,
            NovosDados.crm,
            NovosDados.id_especialidade,
            id
        ]
    );
    return resultados.affectedRows;
}

export async function DeletarMedico(id) {
    const [resultados] = await connection.query(
        `DELETE FROM medicos WHERE id = ?`, [id]
    );
    return resultados;
}
