import { connection } from '../config/connection.js';


export async function inserirUbs(nome, endereco) {
  let comando = `
    INSERT INTO unidades_saude (nome, endereco)
    VALUES (?, ?);
  `;

  let [info] = await connection.query(comando, [nome, endereco]);
  return info.insertId;
}


export async function listarUbs() {
  let comando = `SELECT * FROM unidades_saude ORDER BY nome ASC;`;
  let [linhas] = await connection.query(comando);
  return linhas;
}


export async function buscarUbsPorNome(nome) {
  let comando = `
    SELECT * FROM unidades_saude
    WHERE nome LIKE ?;
  `;
  let [linhas] = await connection.query(comando, [`%${nome}%`]);
  return linhas;
}


export async function atualizarUbs(id, nome, endereco) {
  let comando = `
    UPDATE unidades_saude
    SET nome = ?, endereco = ?
    WHERE id = ?;
  `;
  let [info] = await connection.query(comando, [nome, endereco, id]);
  return info.affectedRows;
}


export async function deletarUbs(id) {
  let comando = `DELETE FROM unidades_saude WHERE id = ?;`;
  let [info] = await connection.query(comando, [id]);
  return info.affectedRows;
}
