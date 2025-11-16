import PacienteController from './controllers/PacienteController.js'
import UnidadeSaudeController from './controllers/UnidadeSaudeController.js'
import FuncionarioController from './controllers/FuncionarioController.js'
import MedicamentosController from './controllers/MedicamentosController.js'
import ConsultasController from './controllers/ConsultasController.js'
import UsuarioController from './controllers/UsuarioController.js'
import PrescricoesController from './controllers/PrescricoesController.js'
import EstatisticasController from './controllers/EstatisticasController.js'
import MedicoController from './controllers/MedicoController.js'
import EspecialidadesController from './controllers/EspecialidadesController.js'
import PacienteLogadoController from './controllers/PacienteLogadoController.js'
import MedicoLogadoController from './controllers/MedicoLogadoController.js'
export function adicionarRotas(api) {
  api.use(PacienteController);
  api.use(UnidadeSaudeController);
  api.use(FuncionarioController);
  api.use(MedicamentosController);
  api.use(ConsultasController)
  api.use(UsuarioController)
  api.use(PrescricoesController)
  api.use(EstatisticasController)
  api.use(MedicoController)
  api.use(EspecialidadesController)
  api.use(PacienteLogadoController)
  api.use(MedicoLogadoController)
}