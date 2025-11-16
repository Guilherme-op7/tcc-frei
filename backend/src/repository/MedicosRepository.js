import { connection } from "../config/connection.js";

export async function CadastrarMedico(dados) {
    const [resultado] = await connection.query(
        `INSERT INTO medicos (
            id_funcionario, 
            crm, 
            id_especialidade
        ) VALUES (?, ?, ?)`,
        [
            dados.id_funcionario,
            dados.crm,
            dados.id_especialidade || null
        ]
    );

    return resultado;
}

export async function ListarMedicos() {
    const [resultados] = await connection.query(
        `SELECT 
            m.id,
            m.crm,
            m.id_especialidade,
            e.nome AS nome_especialidade,
            
            f.id AS funcionario_id,
            f.nome AS funcionario_nome,
            f.email AS funcionario_email,
            f.telefone AS funcionario_telefone,
            f.salario AS funcionario_salario

         FROM medicos m
         INNER JOIN funcionarios f ON f.id = m.id_funcionario
         LEFT JOIN especialidades e ON e.id = m.id_especialidade
         ORDER BY f.nome ASC`
    );

    return resultados;
}

export async function BuscarMedicoPorId(id) {
    const [resultados] = await connection.query(
        `SELECT 
            m.id,
            m.crm,
            m.id_especialidade,
            e.nome AS nome_especialidade,
            
            f.id AS funcionario_id,
            f.nome AS funcionario_nome,
            f.email AS funcionario_email,
            f.telefone AS funcionario_telefone,
            f.salario AS funcionario_salario

         FROM medicos m
         INNER JOIN funcionarios f ON f.id = m.id_funcionario
         LEFT JOIN especialidades e ON e.id = m.id_especialidade
         WHERE m.id = ?`,
        [id]
    );

    return resultados[0];
}

export async function BuscarMedicoPorEmail(email) {
    const [resultados] = await connection.query(
        `SELECT 
            m.id,
            m.crm,
            m.id_especialidade,
            e.nome AS nome_especialidade,
            
            f.id AS funcionario_id,
            f.nome AS funcionario_nome,
            f.email AS funcionario_email,
            f.telefone AS funcionario_telefone,
            f.salario AS funcionario_salario

         FROM medicos m
         INNER JOIN funcionarios f ON f.id = m.id_funcionario
         LEFT JOIN especialidades e ON e.id = m.id_especialidade
         WHERE f.email = ?`,
        [email]
    );

    return resultados[0];
}

export async function AtualizarMedico(dados, id) {
    const [resultado] = await connection.query(
        `UPDATE medicos SET
            id_funcionario = ?,
            crm = ?,
            id_especialidade = ?
         WHERE id = ?`,
        [
            dados.id_funcionario,
            dados.crm,
            dados.id_especialidade || null,
            id
        ]
    );

    return resultado.affectedRows;
}

export async function DeletarMedico(id) {
    const [resultado] = await connection.query(
        `DELETE FROM medicos WHERE id = ?`,
        [id]
    );

    return resultado;
}

export async function ContarPacientesDoMedico(medicoId) {
    const [resultado] = await connection.query(
        `SELECT COUNT(DISTINCT consultas.paciente_id) AS total
         FROM consultas
         INNER JOIN medicos ON medicos.id_funcionario = consultas.funcionario_id
         WHERE medicos.id = ?`,
        [medicoId]
    );
    return resultado[0].total;
}

export async function ContarConsultasAgendadasMedico(medicoId) {
    const [resultado] = await connection.query(
        `SELECT COUNT(*) AS total
         FROM consultas
         INNER JOIN medicos ON medicos.id_funcionario = consultas.funcionario_id
         WHERE medicos.id = ?
         AND consultas.status IN ('Agendada', 'Confirmada')`,
        [medicoId]
    );
    return resultado[0].total;
}

export async function ContarAtendimentosMedico(medicoId) {
    const [resultado] = await connection.query(
        `SELECT COUNT(*) AS total
         FROM consultas
         INNER JOIN medicos ON medicos.id_funcionario = consultas.funcionario_id
         WHERE medicos.id = ?
         AND consultas.status = 'Concluída'`,
        [medicoId]
    );
    return resultado[0].total;
}

export async function ContarTotalConsultasMedico(medicoId) {
    const [resultado] = await connection.query(
        `SELECT COUNT(*) AS total
         FROM consultas
         INNER JOIN medicos ON medicos.id_funcionario = consultas.funcionario_id
         WHERE medicos.id = ?`,
        [medicoId]
    );
    return resultado[0].total;
}

export async function ListarPacientesDoMedico(medicoId) {
    const [resultados] = await connection.query(
        `SELECT DISTINCT 
            pacientes.id,
            pacientes.nome,
            pacientes.telefone,
            pacientes.tipo_sanguineo,
            pacientes.alergias,
            COUNT(DISTINCT consultas.id) AS total_consultas,
            COUNT(DISTINCT CASE 
                WHEN consultas.status IN ('Agendada', 'Confirmada') THEN consultas.id 
            END) AS consultas_agendadas,
            MAX(CASE 
                WHEN consultas.status = 'Concluída' THEN consultas.data_hora 
            END) AS ultima_consulta
         FROM pacientes
         INNER JOIN consultas ON pacientes.id = consultas.paciente_id
         INNER JOIN medicos ON medicos.id_funcionario = consultas.funcionario_id
         WHERE medicos.id = ?
         GROUP BY pacientes.id
         ORDER BY pacientes.nome ASC`,
        [medicoId]
    );

    return resultados;
}

export async function BuscarMedicoPorNome(nome) {
    const [resultados] = await connection.query(
        `SELECT 
            m.id,
            m.crm,
            m.id_especialidade,
            e.nome AS nome_especialidade,
            
            f.id AS funcionario_id,
            f.nome AS funcionario_nome,
            f.email AS funcionario_email,
            f.telefone AS funcionario_telefone,
            f.salario AS funcionario_salario

         FROM medicos m
         INNER JOIN funcionarios f ON f.id = m.id_funcionario
         LEFT JOIN especialidades e ON e.id = m.id_especialidade
         WHERE f.nome LIKE ?
         ORDER BY f.nome ASC`,
        [`%${nome}%`]
    );

    return resultados;
}

