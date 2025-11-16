import { connection } from '../config/connection.js';


export async function inserirPaciente(paciente) {
  const comando = `
    INSERT INTO pacientes (
      nome, data_nascimento, cpf, email, endereco,
      telefone, cartao_sus, tipo_sanguineo, alergias,
      contato_emergencia
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  const [info] = await connection.query(comando, [
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
  const comando = `SELECT * FROM pacientes ORDER BY nome ASC;`;
  const [linhas] = await connection.query(comando);
  return linhas;
}


export async function buscarPacientePorNome(nome) {
  const comando = `
    SELECT * FROM pacientes
    WHERE nome LIKE ?;
  `;
  const [linhas] = await connection.query(comando, [`%${nome}%`]);
  return linhas;
}


export async function buscarPacientePorCpf(cpf) {
  const comando = `
    SELECT * FROM pacientes
    WHERE cpf = ?;
  `;
  const [linhas] = await connection.query(comando, [cpf]);
  return linhas[0];
}


export async function buscarPacientePorId(id) {
  const comando = `
    SELECT * FROM pacientes
    WHERE id = ?;
  `;
  const [linhas] = await connection.query(comando, [id]);
  return linhas[0];
}



export async function atualizarPaciente(id, paciente) {
  const comando = `
    UPDATE pacientes
    SET nome = ?, cpf = ?, cartao_sus = ?, email = ?, tipo_sanguineo = ?,
        status =?
    WHERE id = ?;
  `;

  const [info] = await connection.query(comando, [
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
  const comando = `DELETE FROM pacientes WHERE id = ?;`;
  const [info] = await connection.query(comando, [id]);
  return info.affectedRows;
}

export async function buscarPacientePorEmail(email) {
  const comando = `
    SELECT * FROM pacientes
    WHERE email = ?;
  `;
  const [linhas] = await connection.query(comando, [email]);
  return linhas[0];
}

export async function contarConsultasAgendadas(pacienteId) {
  const [resultado] = await connection.query(
    `SELECT COUNT(*) as total FROM consultas 
     WHERE paciente_id = ? AND status IN ('Agendada', 'Confirmada')`,
    [pacienteId]
  );
  return resultado[0].total;
}

export async function contarConsultasRealizadas(pacienteId) {
  const [resultado] = await connection.query(
    `SELECT COUNT(*) as total FROM consultas 
     WHERE paciente_id = ? AND status = 'Concluída'`,
    [pacienteId]
  );
  return resultado[0].total;
}

export async function contarPrescricoesAtivas(pacienteId) {
  const [resultado] = await connection.query(
    `SELECT COUNT(*) as total FROM prescricoes 
     WHERE paciente_id = ? AND (fim IS NULL OR fim >= CURDATE())`,
    [pacienteId]
  );
  return resultado[0].total;
}