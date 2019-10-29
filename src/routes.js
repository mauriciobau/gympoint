// ARQUIVO DE ROTEAMENTO

// importa o roteamento do express para poder criar as rotas do sistema
import { Router } from 'express';

// importa a controller de Usuário
import UserController from './app/controllers/UserController';

// importa a controller de Usuário
import StudentController from './app/controllers/StudentController';

// importa a controller de Plano
import PlanController from './app/controllers/PlanController';

// importa a controller de Plano
import EnrollmentController from './app/controllers/EnrollmentController';

// importa a controlle de Seção / autenticação
import SessionController from './app/controllers/SessionController';

// importa o middleware de autenticação
import authMiddleware from './app/middlewares/auth';

// variável para criar as rotas
const routes = new Router();

// variável para realizar o upload
// const upload = multer(multerConfig);

// rota para logar
routes.post('/sessions', SessionController.store);

// rota para criar usuário
routes.post('/users', UserController.store);

// carrega rota do middleware de autenticação, as rotas abaixo desta, só serão
// acessiveis se o usuário estiver logado.
routes.use(authMiddleware);

// rota para editar usuários
routes.put('/users', UserController.update);

// rota para criar aluno
routes.post('/students', StudentController.store);

// rota para editar aluno
routes.put('/students/:id', StudentController.update);

// rota para criar plano
routes.post('/plans', PlanController.store);

// rota para listar plano
routes.get('/plans', PlanController.index);

// rota para atualizar plano
routes.put('/plans/:id', PlanController.update);

// rota para deletar plano
routes.delete('/plans/:id', PlanController.delete);

// rota para crirar matriculas
routes.post('/enrollments', EnrollmentController.store);

// rota para listar matriculas
routes.get('/enrollments', EnrollmentController.index);

// rota para editar matriculas
routes.put('/enrollments/:id', EnrollmentController.update);

// exporta as rotas criadas
export default routes;
