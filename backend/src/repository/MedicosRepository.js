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
    const [resultados] = await connection.query(
        `SELECT m.*, e.nome as nome_especialidade 
         FROM medicos m 
         LEFT JOIN especialidades e ON m.id_especialidade = e.id 
         ORDER BY m.nome ASC`
    );
    return resultados;
}

export async function BuscarMedicoPorId(id) {
    const [resultados] = await connection.query(
        `SELECT m.*, e.nome as nome_especialidade 
         FROM medicos m 
         LEFT JOIN especialidades e ON m.id_especialidade = e.id 
         WHERE m.id = ?`, [id]
    );
    return resultados[0];
}

export async function BuscarMedicoPorNome(nome) {
    const [resultados] = await connection.query(
        `SELECT m.*, e.nome as nome_especialidade 
         FROM medicos m 
         LEFT JOIN especialidades e ON m.id_especialidade = e.id 
         WHERE m.nome LIKE ?`, [`%${nome}%`]
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

export async function BuscarMedicoPorEmail(email) {
    const [resultados] = await connection.query(
        `SELECT m.*, e.nome as nome_especialidade 
         FROM medicos m 
         LEFT JOIN especialidades e ON m.id_especialidade = e.id 
         WHERE m.email = ?`, [email]
    );
    return resultados[0];
}

export async function ContarPacientesDoMedico(medicoId) {
    const [resultado] = await connection.query(
        `SELECT COUNT(DISTINCT consultas.paciente_id) as total 
         FROM consultas
         JOIN medicos ON medicos.id_funcionario = consultas.funcionario_id
         WHERE medicos.id = ?`,
        [medicoId]
    );
    return resultado[0].total;
}

export async function ContarConsultasAgendadasMedico(medicoId) {
    const [resultado] = await connection.query(
        `SELECT COUNT(*) as total FROM consultas
         JOIN medicos ON medicos.id_funcionario = consultas.funcionario_id
         WHERE medicos.id = ? AND consultas.status IN ('Agendada', 'Confirmada')`,
        [medicoId]
    );
    return resultado[0].total;
}

export async function ContarAtendimentosMedico(medicoId) {
    const [resultado] = await connection.query(
        `SELECT COUNT(*) as total FROM consultas
         JOIN medicos ON medicos.id_funcionario = consultas.funcionario_id
         WHERE medicos.id = ? AND consultas.status = 'Concluída'`,
        [medicoId]
    );
    return resultado[0].total;
}

export async function ContarTotalConsultasMedico(medicoId) {
    const [resultado] = await connection.query(
        `SELECT COUNT(*) as total FROM consultas
         JOIN medicos ON medicos.id_funcionario = consultas.funcionario_id
         WHERE medicos.id = ?`,
        [medicoId]
    );
    return resultado[0].total;
}

export async function ListarPacientesDoMedico(medicoId) {
    const [resultados] = await connection.query(
        `SELECT DISTINCT 
            p.id,
            p.nome,
            p.telefone,
            p.tipo_sanguineo,
            p.alergias,
            COUNT(DISTINCT c.id) as total_consultas,
            COUNT(DISTINCT CASE WHEN c.status IN ('Agendada', 'Confirmada') THEN c.id END) as consultas_agendadas,
            MAX(CASE WHEN c.status = 'Concluída' THEN c.data_hora END) as ultima_consulta
         FROM pacientes p
         INNER JOIN consultas c ON p.id = c.paciente_id
         INNER JOIN medicos m ON m.id_funcionario = c.funcionario_id
         WHERE m.id = ?
         GROUP BY p.id, p.nome, p.telefone, p.tipo_sanguineo, p.alergias
         ORDER BY p.nome ASC`,
        [medicoId]
    );
    return resultados;
}
