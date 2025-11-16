import {
    CadastrarMedico,
    ListarMedicos,
    BuscarMedicoPorId,
    BuscarMedicoPorNome,
    AtualizarMedico,
    DeletarMedico
} from "../repository/MedicosRepository.js";

import { BuscarFuncionarioPorId } from "../repository/FuncionarioRepository.js";

export async function criarMedicoService(dados) {
    if (!dados.id_funcionario || !dados.crm)
        throw new Error("Campos obrigatórios: id_funcionario e CRM.");

    const funcionario = await BuscarFuncionarioPorId(dados.id_funcionario);

    if (!funcionario)
        throw new Error("Funcionário não encontrado.");

    // Montando médico baseado NO funcionário
    const medico = {
        id_funcionario: funcionario.id,
        nome: funcionario.nome,
        email: funcionario.email,
        telefone: funcionario.telefone,
        salario: funcionario.salario,
        crm: dados.crm,
        id_especialidade: dados.id_especialidade || null
    };

    return await CadastrarMedico(medico);
}

export async function listarMedicosService() {
    return await ListarMedicos();
}

export async function buscarMedicoPorIdService(id) {
    const medico = await BuscarMedicoPorId(id);
    if (!medico) throw new Error("Médico não encontrado.");
    return medico;
}

export async function buscarMedicoPorNomeService(nome) {
    return await BuscarMedicoPorNome(nome);
}

export async function atualizarMedicoService(dados, id) {
    const linhasAfetadas = await AtualizarMedico(dados, id);

    if (linhasAfetadas === 0)
        throw new Error("Nenhum médico encontrado para atualizar.");

    return linhasAfetadas;
}

export async function deletarMedicoService(id) {
    const linhasAfetadas = await DeletarMedico(id);

    if (linhasAfetadas === 0)
        throw new Error("Médico não encontrado para deletar.");

    return linhasAfetadas;
}
