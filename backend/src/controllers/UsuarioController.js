import { Router } from "express";

import { generateToken } from '../utils/jwt.js'
import { CriarCredenciais, validarCredenciais } from "../repository/UsuarioRepository.js";

const endpoints = Router();

endpoints.post('/criar/conta', async (req, res) => {
  let dados = req.body;

  let credenciais = await CriarCredenciais(dados);

  let id = credenciais.insertId;

  res.send({
    mensagem: "Usuario criado com sucesso!",
    id: id
  })
})

endpoints.post('/login', async (req, res) => {
  let email = req.body.email;
  let senha = req.body.senha;

  let dados = await validarCredenciais(email, senha);
  if (!dados) {
    return res.status(401).send({ mensagem: 'Credenciais inválidas' });
  }

  const usuario = {
    id: dados.id,
    nome: dados.nome || dados.nome_usuario,
    email: dados.email,
    role: dados.tipo_usuario || dados.nivel_acesso || 'user'
  };

  res.send({
    mensagem: "Usuario logado com sucesso!",
    token: generateToken(usuario),
    usuario
  })
})

export default endpoints;