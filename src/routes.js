// ARQUIVO DE ROTEAMENTO

// importa o roteamento do express para poder criar as rotas do sistema
import { Router } from 'express';

// importa a controller de Usuário
import UserController from './app/controllers/UserController';

// importa a controller de Usuário
import StudentController from './app/controllers/StudentController';

// importa a controller de Plano
import PlanController from './app/controllers/PlanController';

// importa a controller de Enrollment
import EnrollmentController from './app/controllers/EnrollmentController';

// importa a controller de Checkin
import CheckinController from './app/controllers/CheckinController';

// importa a controller de HelpOrder
import GymHelpOrderController from './app/controllers/GymHelpOrderController';
import StudentHelpOrderController from './app/controllers/StudentHelpOrderController';

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

// rota para criar ordens de ajuda
routes.post(
  '/students/:student_id/help-orders',
  StudentHelpOrderController.store
);

// rota para listar ordens de ajuda
routes.get(
  '/students/:student_id/help-orders',
  StudentHelpOrderController.index
);

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

// rota para excluir matriculas
routes.delete('/enrollments/:id', EnrollmentController.delete);

// rota para crirar checkins
routes.post('/students/:student_id/checkins', CheckinController.store);

// rota para listar checkins
routes.get('/students/:student_id/checkins', CheckinController.index);

// rota para listar ordens de ajuda
routes.get('/help-orders', GymHelpOrderController.index);

// rota para responder ordens de ajuda
routes.post('/help-orders/:id/answer', GymHelpOrderController.store);

// exporta as rotas criadas
export default routes;
