import {
    CadastrarMedico,
    ListarMedicos,
    BuscarMedicoPorId,
    BuscarMedicoPorNome,
    AtualizarMedico,
    DeletarMedico
} from "../repository/MedicosRepository.js";

export async function criarMedicoService(dados) {
    if (!dados.nome || !dados.crm || !dados.email)
        throw "Campos obrigatórios: nome, CRM e e-mail.";

    return await CadastrarMedico(dados);
}

export async function listarMedicosService() {
    return await ListarMedicos();
}

export async function buscarMedicoPorIdService(id) {
    const medico = await BuscarMedicoPorId(id);
    if (!medico) throw "Médico não encontrado.";
    return medico;
}

export async function buscarMedicoPorNomeService(nome) {
    return await BuscarMedicoPorNome(nome);
}

export async function atualizarMedicoService(dados, id) {
    const linhasAfetadas = await AtualizarMedico(dados, id);
    if (linhasAfetadas === 0) throw "Nenhum médico encontrado para atualizar.";
    return linhasAfetadas;
}

export async function deletarMedicoService(id) {
    const linhasAfetadas = await DeletarMedico(id);
    if (linhasAfetadas === 0) throw "Médico não encontrado para deletar.";
    return linhasAfetadas;
}
