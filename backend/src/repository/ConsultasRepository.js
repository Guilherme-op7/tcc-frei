import { connection } from "../config/connection.js";

/* ============================
      LISTAR CONSULTAS
============================ */
export async function ListarConsultas() {
  let [consultas] = await connection.query(`
    SELECT 
      c.id,
      c.paciente_id,
      c.funcionario_id,
      c.data_hora,
      c.tipo_consulta,
      c.unidade,
      c.status,
      p.nome AS nome_paciente,
      f.nome AS nome_medico
    FROM consultas c
    INNER JOIN pacientes p ON c.paciente_id = p.id
    INNER JOIN funcionarios f ON c.funcionario_id = f.id
    ORDER BY c.data_hora DESC
  `);

  return consultas;
}

/* ============================
   CONSULTAS POR PACIENTE
============================ */
export async function BuscarConsultaPorPaciente(pacienteId) {
  let [consultas] = await connection.query(`
    SELECT 
      c.id,
      c.paciente_id,
      c.funcionario_id,
      c.data_hora,
      c.tipo_consulta,
      c.unidade,
      c.status,
      f.nome AS nome_medico
    FROM consultas c
    INNER JOIN funcionarios f ON c.funcionario_id = f.id
    WHERE c.paciente_id = ?
    ORDER BY c.data_hora DESC
  `, [pacienteId]);

  return consultas;
}

/* ============================
     CONSULTAS POR MÉDICO
============================ */
export async function BuscarConsultaPorMedico(medicoId) {
  let [medico] = await connection.query(
    `SELECT id_funcionario FROM medicos WHERE id = ?`,
    [medicoId]
  );

  if (!medico.length) return [];

  let funcionario_id = medico[0].id_funcionario;

  let [consultas] = await connection.query(`
    SELECT 
      c.id,
      c.paciente_id,
      c.funcionario_id,
      c.data_hora,
      c.tipo_consulta,
      c.unidade,
      c.status,
      p.nome AS nome_paciente
    FROM consultas c
    INNER JOIN pacientes p ON c.paciente_id = p.id
    WHERE c.funcionario_id = ?
    ORDER BY c.data_hora DESC
  `, [funcionario_id]);

  return consultas;
}

/* ============================
  PRÓXIMAS CONSULTAS PACIENTE
============================ */
export async function BuscarProximasConsultasPaciente(pacienteId) {
  let [consultas] = await connection.query(`
    SELECT 
      c.id,
      c.data_hora,
      c.tipo_consulta,
      c.unidade,
      c.status,
      f.nome AS nome_medico,
      e.nome AS especialidade
    FROM consultas c
    INNER JOIN funcionarios f ON c.funcionario_id = f.id
    INNER JOIN medicos m ON m.id_funcionario = f.id
    LEFT JOIN especialidades e ON m.id_especialidade = e.id
    WHERE c.paciente_id = ? 
      AND c.data_hora >= NOW()
      AND c.status IN ('Agendada', 'Confirmada')
    ORDER BY c.data_hora ASC
    LIMIT 10
  `, [pacienteId]);

  return consultas;
}

/* ============================
   PRÓXIMAS CONSULTAS MÉDICO
============================ */
export async function BuscarProximasConsultasMedico(medicoId) {
  let [medico] = await connection.query(
    `SELECT id_funcionario FROM medicos WHERE id = ?`,
    [medicoId]
  );

  if (!medico.length) return [];

  let funcionario_id = medico[0].id_funcionario;

  let [consultas] = await connection.query(`
    SELECT 
      c.id,
      c.data_hora,
      c.tipo_consulta,
      c.unidade,
      c.status,
      p.nome AS nome_paciente
    FROM consultas c
    INNER JOIN pacientes p ON c.paciente_id = p.id
    WHERE c.funcionario_id = ?
      AND c.data_hora >= NOW()
      AND c.status IN ('Agendada', 'Confirmada')
    ORDER BY c.data_hora ASC
    LIMIT 10
  `, [funcionario_id]);

  return consultas;
}

/* ============================
  HISTÓRICO CONSULTAS PACIENTE
============================ */
export async function BuscarHistoricoConsultasPaciente(pacienteId) {
  let [consultas] = await connection.query(`
    SELECT 
      c.id,
      c.data_hora,
      c.tipo_consulta,
      c.unidade,
      c.status,
      f.nome AS nome_medico,
      e.nome AS especialidade
    FROM consultas c
    INNER JOIN funcionarios f ON c.funcionario_id = f.id
    INNER JOIN medicos m ON m.id_funcionario = f.id
    LEFT JOIN especialidades e ON m.id_especialidade = e.id
    WHERE c.paciente_id = ? 
      AND c.status = 'Concluída'
    ORDER BY c.data_hora DESC
    LIMIT 10
  `, [pacienteId]);

  return consultas;
}

/* ============================
     CONSULTA POR UNIDADE
============================ */
export async function BuscarConsultaPorUnidade(unidade) {
  let [consultas] = await connection.query(`
    SELECT 
      c.id,
      c.paciente_id,
      c.funcionario_id,
      c.data_hora,
      c.tipo_consulta,
      c.unidade,
      c.status,
      p.nome AS nome_paciente,
      f.nome AS nome_medico
    FROM consultas c
    INNER JOIN pacientes p ON c.paciente_id = p.id
    INNER JOIN funcionarios f ON c.funcionario_id = f.id
    WHERE c.unidade LIKE ?
    ORDER BY c.data_hora DESC
  `, [`%${unidade}%`]);

  return consultas;
}

/* ============================
         CRIAR CONSULTA
============================ */
export async function CriarConsulta({ paciente_id, medico_id, data_hora, tipo_consulta, unidade, status }) {
  let statusNormalizado = status || 'Agendada';

  if (['realizada', 'concluída', 'concluida'].includes(statusNormalizado?.toLowerCase())) {
    statusNormalizado = 'Concluída';
  }

  let [medico] = await connection.query(
    `SELECT id_funcionario FROM medicos WHERE id = ?`,
    [medico_id]
  );

  if (!medico.length) throw new Error("Médico não encontrado");

  let funcionario_id = medico[0].id_funcionario;

  let [resultado] = await connection.query(`
    INSERT INTO consultas (paciente_id, funcionario_id, data_hora, tipo_consulta, unidade, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [paciente_id, funcionario_id, data_hora, tipo_consulta, unidade, statusNormalizado]);

  return { 
    id: resultado.insertId, 
    paciente_id, 
    medico_id, 
    data_hora, 
    tipo_consulta, 
    unidade, 
    status: statusNormalizado 
  };
}

/* ============================
       ATUALIZAR CONSULTA
============================ */
export async function AtualizarConsulta(idConsulta, dadosConsulta) {
  let { paciente_id, medico_id, data_hora, tipo_consulta, unidade, status } = dadosConsulta;

  let statusNormalizado = status || 'Agendada';

  if (['realizada', 'concluída', 'concluida'].includes(statusNormalizado?.toLowerCase())) {
    statusNormalizado = 'Concluída';
  }

  let funcionario_id = null;

  if (medico_id) {
    let [medico] = await connection.query(
      `SELECT id_funcionario FROM medicos WHERE id = ?`,
      [medico_id]
    );

    if (medico.length) {
      funcionario_id = medico[0].id_funcionario;
    }
  }

  let [resultado] = await connection.query(`
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

/* ============================
         DELETAR CONSULTA
============================ */
export async function DeletarConsulta(idConsulta) {
  let [resultado] = await connection.query(`
    DELETE FROM consultas WHERE id = ?
  `, [idConsulta]);

  return resultado.affectedRows > 0;
}
