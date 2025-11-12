import { connection } from "../config/connection.js"

export async function CriarCredenciais(NovoLogin) {
    let [resultados] = 
      await connection.query(
        `INSERT INTO usuario (nome, email, senha, tipo_usuario)
        VALUES (?, ?, MD5(?), ?)`, [NovoLogin.nome, NovoLogin.email, NovoLogin.senha, NovoLogin.tipo_usuario]
      )

    return resultados
}

export async function validarCredenciais(email, senha) {
    let [resultados] = 
      await connection.query(
        `SELECT * from usuario
        WHERE email = ? and senha = MD5(?)`, [email, senha]
      )

    return resultados[0]
}