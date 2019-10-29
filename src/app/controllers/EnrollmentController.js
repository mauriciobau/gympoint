// importa o Yup para realizar as validações das informações
// o Yup não possui um export defaul, por isso utiliza-se o *
import * as Yup from 'yup';
// importa date-fns para calular a data final da matricula
import { parseISO, addMonths } from 'date-fns';

// importa a model Plan
import Enrollment from '../models/Enrollment';

// importa a model de planos
import Plan from '../models/Plan';
import Student from '../models/Student'

import EnrollmentMail from '../jobs/EnrollmentMail';
import Queue from '../../lib/Queue';

class EnrollmentController {
  // criar plano, async pois irá trabalhar com banco de dados
  async store(req, res) {
    // cria o schema e recebe o objeto Yup com a estrutura de verificação

    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .required(),
      plan_id: Yup.number()
        .integer()
        .required(),
      start_date: Yup.date()
        .required()
        .min(new Date()),
      // end_date: Yup.date()
      // .required(),
      // price: Yup.number()
      //   .positive()
      //   .required(),
    });


    // faz a verificação através do schema criado pela função isValid dos dados passado pelo req.body
    if (!(await schema.isValid(req.body))) {
      // retorna erro de validação
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    // procura uma matricula que tenha o estudante informado
    const enrollmentExists = await Enrollment.findOne({
      where: { student_id },
    });

    // verificar se o estudante ja esta matriculado
    if (enrollmentExists) {
      return res
        .status(400)
        .json({ error: 'Student already have a enrollment.' });
    }

    // busca plano selecionado
    const plan = await Plan.findByPk(plan_id);

    const end_date = addMonths(parseISO(start_date), plan.duration);

    const price = plan.price*plan.duration;

    //price.toLocaleString('pt-BR');

    // cria plano no banco de dados
    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    const enrollmentCreated = await Enrollment.findOne({ where: student_id == enrollment.student_id ,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        }
      ],
    });

    await Queue.add(EnrollmentMail.key, {
      enrollmentCreated,
    });

    // retorna o plano criado
    return res.json(enrollmentCreated);
  }

  async index(req, res) {
    const enrollments = await Enrollment.findAll();

    return res.status(200).json(enrollments);
  }

  // editar plano
  async update(req, res) {
    // cria o schema e recebe o objeto Yup com a estrutura de verificação
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .required(),
      plan_id: Yup.number()
        .integer()
        .required(),
      start_date: Yup.date()
        .required()
        .min(new Date()),
      end_date: Yup.date().required(),
      price: Yup.number()
        .positive()
        .required(),
    });

    // verificar schema dos dados enviados
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // pega o id do estudante de req.body
    const { id, plan_id } = req.body;

    // procura matricula no banco de dados pelo ID informado
    const enrollment = await Enrollment.findByPk(req.params.id);

    // verificar se o titulo é diferente do que esta no cadastro
    if (enrollment.plan_id != plan_id ) {
      // busca title no banco de dados para verificar se ja existe.
      const planExists = await Plan.findOne({ where: { title } });

      if (planExists) {
        // retorna erro de plano ja existe
        return res.status(400).json({ error: 'Title paln already exists.' });
      }
    }

    // pega os valores e atualiza o cadastro no banco
    const { id, duration, price } = await plan.update(req.body);

    // retorna as informações do plano
    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    // pega o id informado
    const { id } = req.params;

    // procura o plano com id informado
    const planExists = await Plan.findByPk(id);

    // retorna erro caso não encontre o plano
    if (!planExists) {
      return res.status(400).json({
        error: 'Plan does not exists',
      });
    }

    await Plan.destroy({ where: { id } });

    return res.status(200).json();
  }
}

// exporta PlanControllher
export default new EnrollmentController();
