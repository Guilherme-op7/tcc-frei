import { connection } from "../config/connection.js";

export async function ListarConsultas() {
  const [consultas] = await connection.query(`
    SELECT 
      consultas.id,
      consultas.paciente_id,
      consultas.medico_id,
      consultas.data_hora,
      consultas.tipo_consulta,
      consultas.unidade,
      consultas.status,
      pacientes.nome AS nome_paciente,
      medicos.nome AS nome_medico
    FROM consultas
    JOIN pacientes ON consultas.paciente_id = pacientes.id
    JOIN medicos ON consultas.medico_id = medicos.id
    ORDER BY consultas.data_hora DESC
  `);

  return consultas;
}

export async function BuscarConsultaPorPaciente(pacienteId) {
  const [consultas] = await connection.query(`
    SELECT 
      consultas.id,
      consultas.paciente_id,
      consultas.medico_id,
      consultas.data_hora,
      consultas.tipo_consulta,
      consultas.unidade,
      consultas.status,
      medicos.nome AS nome_medico
    FROM consultas
    JOIN medicos ON consultas.medico_id = medicos.id
    WHERE consultas.paciente_id = ?
    ORDER BY consultas.data_hora DESC
  `, [pacienteId]);

  return consultas;
}

export async function BuscarConsultaPorMedico(medicoId) {
  const [consultas] = await connection.query(`
    SELECT 
      consultas.id,
      consultas.paciente_id,
      consultas.medico_id,
      consultas.data_hora,
      consultas.tipo_consulta,
      consultas.unidade,
      consultas.status,
      pacientes.nome AS nome_paciente
    FROM consultas
    JOIN pacientes ON consultas.paciente_id = pacientes.id
    WHERE consultas.medico_id = ?
    ORDER BY consultas.data_hora DESC
  `, [medicoId]);

  return consultas;
}

export async function BuscarConsultaPorUnidade(unidade) {
  const [consultas] = await connection.query(`
    SELECT 
      consultas.id,
      consultas.paciente_id,
      consultas.medico_id,
      consultas.data_hora,
      consultas.tipo_consulta,
      consultas.unidade,
      consultas.status,
      pacientes.nome AS nome_paciente,
      medicos.nome AS nome_medico
    FROM consultas
    INNER JOIN pacientes ON consultas.paciente_id = pacientes.id
    INNER JOIN medicos ON consultas.medico_id = medicos.id
    WHERE consultas.unidade LIKE ?
    ORDER BY consultas.data_hora DESC
  `, [`%${unidade}%`]);

  return consultas;
}

export async function CriarConsulta({ paciente_id, medico_id, data_hora, tipo_consulta, unidade, status }) {

  let statusNormalizado = status || 'Agendada';

  if (['realizada', 'concluída', 'concluida'].includes(statusNormalizado?.toLowerCase())) {
    statusNormalizado = 'Concluída';
  }

  const [resultado] = await connection.query(`
    INSERT INTO consultas (paciente_id, medico_id, data_hora, tipo_consulta, unidade, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [paciente_id, medico_id, data_hora, tipo_consulta, unidade, statusNormalizado]);

  return { id: resultado.insertId, paciente_id, medico_id, data_hora, tipo_consulta, unidade, status: statusNormalizado };
}

export async function AtualizarConsulta(idConsulta, dadosConsulta) {
  const { paciente_id, medico_id, data_hora, tipo_consulta, unidade, status } = dadosConsulta;

  let statusNormalizado = status || 'Agendada';

  if (['realizada', 'concluída', 'concluida'].includes(statusNormalizado?.toLowerCase())) {
    statusNormalizado = 'Concluída';
  }

  const [resultado] = await connection.query(`
    UPDATE consultas
    SET paciente_id = ?, medico_id = ?, data_hora = ?, tipo_consulta = ?, unidade = ?, status = ?
    WHERE id = ?
  `, [
    paciente_id,
    medico_id,
    data_hora,
    tipo_consulta,
    unidade,
    statusNormalizado,
    idConsulta
  ]);

  return resultado.affectedRows > 0;
}

export async function DeletarConsulta(idConsulta) {
  const [resultado] = await connection.query(`
    DELETE FROM consultas WHERE id = ?
  `, [idConsulta]);

  return resultado.affectedRows > 0;
}
