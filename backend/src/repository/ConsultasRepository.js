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
      funcionarios.nome AS nome_funcionario
    FROM consultas
    JOIN pacientes ON consultas.paciente_id = pacientes.id
    JOIN funcionarios ON consultas.funcionario_id = funcionarios.id
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
      funcionarios.nome AS nome_funcionario
    FROM consultas
    JOIN funcionarios ON consultas.funcionario_id = funcionarios.id
    WHERE consultas.paciente_id = ?
    ORDER BY consultas.data_hora DESC
  `, [pacienteId]);
  return consultas;
}

export async function BuscarConsultaPorFuncionario(funcionarioId) {
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
    WHERE consultas.funcionario_id = ?
    ORDER BY consultas.data_hora DESC
  `, [funcionarioId]);
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
      funcionarios.nome AS nome_funcionario
    FROM consultas
    INNER JOIN pacientes ON consultas.paciente_id = pacientes.id
    INNER JOIN funcionarios ON consultas.funcionario_id = funcionarios.id
    WHERE consultas.unidade LIKE ?
    ORDER BY consultas.data_hora DESC
  `, [`%${unidade}%`]);
  return consultas;
}

export async function CriarConsulta(dadosConsulta) {
  const { paciente_id, funcionario_id, data_hora, tipo_consulta, unidade, status } = dadosConsulta;
  
  let statusNormalizado = status || 'Agendada';
  if (statusNormalizado.toLowerCase() === 'agendada') statusNormalizado = 'Agendada';
  if (statusNormalizado.toLowerCase() === 'realizada' || statusNormalizado.toLowerCase() === 'concluída') statusNormalizado = 'Concluída';

  const [resultado] = await connection.query(`
    INSERT INTO consultas (paciente_id, funcionario_id, data_hora, tipo_consulta, unidade, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [paciente_id, funcionario_id, data_hora, tipo_consulta, unidade, statusNormalizado]);

  return { id: resultado.insertId, ...dadosConsulta };
}

export async function AtualizarConsulta(idConsulta, dadosConsulta) {
  const { paciente_id, funcionario_id, data_hora, tipo_consulta, unidade, status } = dadosConsulta;
  
  let statusNormalizado = status || 'Agendada';
  if (statusNormalizado.toLowerCase() === 'agendada') statusNormalizado = 'Agendada';
  if (statusNormalizado.toLowerCase() === 'realizada' || statusNormalizado.toLowerCase() === 'concluída') statusNormalizado = 'Concluída';

  const [resultado] = await connection.query(`
    UPDATE consultas
    SET paciente_id = ?, funcionario_id = ?, data_hora = ?, tipo_consulta = ?, unidade = ?, status = ?
    WHERE id = ?
  `, [paciente_id, funcionario_id, data_hora, tipo_consulta, unidade, statusNormalizado, idConsulta]);

  return resultado.affectedRows > 0;
}

export async function DeletarConsulta(idConsulta) {
  const [resultado] = await connection.query(`
    DELETE FROM consultas WHERE id = ?
  `, [idConsulta]);

  return resultado.affectedRows > 0;
}
