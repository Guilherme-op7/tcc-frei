import { connection } from "../config/connection.js";

export async function ListarConsultas() {
  const [consultas] = await connection.query(`
    SELECT 
      consultas.id,
      consultas.paciente_id,
      consultas.funcionario_id,
      consultas.data_hora,
      consultas.tipo_consulta,
      consultas.unidade,
      consultas.status,
      pacientes.nome AS nome_paciente,
      medicos.nome AS nome_medico
    FROM consultas
    JOIN pacientes ON consultas.paciente_id = pacientes.id
    JOIN medicos ON medicos.id_funcionario = consultas.funcionario_id
    ORDER BY consultas.data_hora DESC
  `);

  return consultas;
}

export async function BuscarConsultaPorPaciente(pacienteId) {
  const [consultas] = await connection.query(`
    SELECT 
      consultas.id,
      consultas.paciente_id,
      consultas.funcionario_id,
      consultas.data_hora,
      consultas.tipo_consulta,
      consultas.unidade,
      consultas.status,
      medicos.nome AS nome_medico
    FROM consultas
    JOIN funcionarios ON consultas.funcionario_id = funcionarios.id
    JOIN medicos ON medicos.id_funcionario = funcionarios.id
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
      consultas.funcionario_id,
      consultas.data_hora,
      consultas.tipo_consulta,
      consultas.unidade,
      consultas.status,
      pacientes.nome AS nome_paciente
    FROM consultas
    JOIN pacientes ON consultas.paciente_id = pacientes.id
    JOIN medicos ON medicos.id_funcionario = consultas.funcionario_id
    WHERE medicos.id = ?
    ORDER BY consultas.data_hora DESC
  `, [medicoId]);

  return consultas;
}

export async function BuscarProximasConsultasPaciente(pacienteId) {
  const [consultas] = await connection.query(`
    SELECT 
      consultas.id,
      consultas.data_hora,
      consultas.tipo_consulta,
      consultas.unidade,
      consultas.status,
      medicos.nome AS nome_medico,
      e.nome AS especialidade
    FROM consultas
    JOIN funcionarios ON consultas.funcionario_id = funcionarios.id
    JOIN medicos ON medicos.id_funcionario = funcionarios.id
    LEFT JOIN especialidades e ON medicos.id_especialidade = e.id
    WHERE consultas.paciente_id = ? 
      AND consultas.data_hora >= NOW()
      AND consultas.status IN ('Agendada', 'Confirmada')
    ORDER BY consultas.data_hora ASC
    LIMIT 10
  `, [pacienteId]);

  return consultas;
}

export async function BuscarProximasConsultasMedico(medicoId) {
  const [consultas] = await connection.query(`
    SELECT 
      consultas.id,
      consultas.data_hora,
      consultas.tipo_consulta,
      consultas.unidade,
      consultas.status,
      pacientes.nome AS nome_paciente
    FROM consultas
    JOIN pacientes ON consultas.paciente_id = pacientes.id
    JOIN medicos ON medicos.id_funcionario = consultas.funcionario_id
    WHERE medicos.id = ? 
      AND consultas.data_hora >= NOW()
      AND consultas.status IN ('Agendada', 'Confirmada')
    ORDER BY consultas.data_hora ASC
    LIMIT 10
  `, [medicoId]);

  return consultas;
}

export async function BuscarHistoricoConsultasPaciente(pacienteId) {
  const [consultas] = await connection.query(`
    SELECT 
      consultas.id,
      consultas.data_hora,
      consultas.tipo_consulta,
      consultas.unidade,
      consultas.status,
      medicos.nome AS nome_medico,
      e.nome AS especialidade
    FROM consultas
    JOIN funcionarios ON consultas.funcionario_id = funcionarios.id
    JOIN medicos ON medicos.id_funcionario = funcionarios.id
    LEFT JOIN especialidades e ON medicos.id_especialidade = e.id
    WHERE consultas.paciente_id = ? 
      AND consultas.status = 'Concluída'
    ORDER BY consultas.data_hora DESC
    LIMIT 10
  `, [pacienteId]);

  return consultas;
}

export async function BuscarConsultaPorUnidade(unidade) {
  const [consultas] = await connection.query(`
    SELECT 
      consultas.id,
      consultas.paciente_id,
      consultas.funcionario_id,
      consultas.data_hora,
      consultas.tipo_consulta,
      consultas.unidade,
      consultas.status,
      pacientes.nome AS nome_paciente,
      medicos.nome AS nome_medico
    FROM consultas
    INNER JOIN pacientes ON consultas.paciente_id = pacientes.id
    INNER JOIN medicos ON medicos.id_funcionario = consultas.funcionario_id
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

  // Buscar funcionario_id do médico
  const [medicoResult] = await connection.query(
    `SELECT id_funcionario FROM medicos WHERE id = ?`,
    [medico_id]
  );

  if (!medicoResult || medicoResult.length === 0) {
    throw new Error('Médico não encontrado');
  }

  const funcionario_id = medicoResult[0].id_funcionario;

  const [resultado] = await connection.query(`
    INSERT INTO consultas (paciente_id, funcionario_id, data_hora, tipo_consulta, unidade, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [paciente_id, funcionario_id, data_hora, tipo_consulta, unidade, statusNormalizado]);

  return { id: resultado.insertId, paciente_id, medico_id, data_hora, tipo_consulta, unidade, status: statusNormalizado };
}

export async function AtualizarConsulta(idConsulta, dadosConsulta) {
  const { paciente_id, medico_id, data_hora, tipo_consulta, unidade, status } = dadosConsulta;

  let statusNormalizado = status || 'Agendada';

  if (['realizada', 'concluída', 'concluida'].includes(statusNormalizado?.toLowerCase())) {
    statusNormalizado = 'Concluída';
  }

  // Buscar funcionario_id do médico
  let funcionario_id = null;
  if (medico_id) {
    const [medicoResult] = await connection.query(
      `SELECT id_funcionario FROM medicos WHERE id = ?`,
      [medico_id]
    );
    if (medicoResult && medicoResult.length > 0) {
      funcionario_id = medicoResult[0].id_funcionario;
    }
  }

  const [resultado] = await connection.query(`
    UPDATE consultas
    SET paciente_id = ?, funcionario_id = ?, data_hora = ?, tipo_consulta = ?, unidade = ?, status = ?
    WHERE id = ?
  `, [
    paciente_id,
    funcionario_id,
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
