import { connection } from '../config/connection.js';


export async function inserirPaciente(paciente) {
  let comando = `
    INSERT INTO pacientes (
      nome, data_nascimento, cpf, email, endereco,
      telefone, cartao_sus, tipo_sanguineo, alergias,
      contato_emergencia
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  let [info] = await connection.query(comando, [
    paciente.nome,
    paciente.data_nascimento,
    paciente.cpf,
    paciente.email,
    paciente.endereco,
    paciente.telefone,
    paciente.cartao_sus,
    paciente.tipo_sanguineo,
    paciente.alergias,
    paciente.contato_emergencia
  ]);

  return info.insertId;
}


export async function listarPacientes() {
  let comando = `SELECT * FROM pacientes ORDER BY nome ASC;`;
  let [linhas] = await connection.query(comando);
  return linhas;
}


export async function buscarPacientePorNome(nome) {
  let comando = `
    SELECT * FROM pacientes
    WHERE nome LIKE ?;
  `;
  let [linhas] = await connection.query(comando, [`%${nome}%`]);
  return linhas;
}


export async function buscarPacientePorCpf(cpf) {
  let comando = `
    SELECT * FROM pacientes
    WHERE cpf = ?;
  `;
  let [linhas] = await connection.query(comando, [cpf]);
  return linhas[0];
}


export async function buscarPacientePorId(id) {
  let comando = `
    SELECT * FROM pacientes
    WHERE id = ?;
  `;
  let [linhas] = await connection.query(comando, [id]);
  return linhas[0];
}



export async function atualizarPaciente(id, paciente) {
  let comando = `
    UPDATE pacientes
    SET nome = ?, cpf = ?, cartao_sus = ?, email = ?, tipo_sanguineo = ?,
        status =?
    WHERE id = ?;
  `;

  let [info] = await connection.query(comando, [
    paciente.nome,
    paciente.cpf,
    paciente.cartao_sus,
    paciente.email,
    paciente.tipo_sanguineo,
    paciente.status,
    id
  ]);

  return info.affectedRows;
}


export async function deletarPaciente(id) {
  let comando = `DELETE FROM pacientes WHERE id = ?;`;
  let [info] = await connection.query(comando, [id]);
  return info.affectedRows;
}

export async function buscarPacientePorEmail(email) {
  let comando = `
    SELECT * FROM pacientes
    WHERE email = ?;
  `;
  let [linhas] = await connection.query(comando, [email]);
  return linhas[0];
}

export async function contarConsultasAgendadas(pacienteId) {
  let [resultado] = await connection.query(
    `SELECT COUNT(*) as total FROM consultas 
     WHERE paciente_id = ? AND status IN ('Agendada', 'Confirmada')`,
    [pacienteId]
  );
  return resultado[0].total;
}

export async function contarConsultasRealizadas(pacienteId) {
  let [resultado] = await connection.query(
    `SELECT COUNT(*) as total FROM consultas 
     WHERE paciente_id = ? AND status = 'Concluída'`,
    [pacienteId]
  );
  return resultado[0].total;
}

export async function contarPrescricoesAtivas(pacienteId) {
  let [resultado] = await connection.query(
    `SELECT COUNT(*) as total FROM prescricoes 
     WHERE paciente_id = ? AND (fim IS NULL OR fim >= CURDATE())`,
    [pacienteId]
  );
  return resultado[0].total;
}