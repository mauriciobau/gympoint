// importa o Yup para realizar as validações das informações
// o Yup não possui um export defaul, por isso utiliza-se o *
import * as Yup from 'yup';
// importa date-fns para calular a data final da matricula
import { parseISO, addMonths } from 'date-fns';

// importa a model Plan
import Enrollment from '../models/Enrollment';

// importa a model de planos
import Plan from '../models/Plan';
import Student from '../models/Student';

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
    });

    // faz a verificação através do schema criado pela função isValid dos dados passado pelo req.body
    if (!(await schema.isValid(req.body))) {
      // retorna erro de validação
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    // procura uma matricula que tenha o estudante informado
    const enrollmentExists = await Enrollment.findOne({
      where: { student_id, canceled_at: null },
    });

    // verificar se o estudante ja esta matriculado
    if (enrollmentExists) {
      return res
        .status(400)
        .json({ error: 'Student already have a enrollment.' });
    }

    // busca aluno no banco de dados para verificar se ja existe.
    const studentExists = await Student.findOne({
      where: { id: student_id, canceled_at: null },
    });

    if (!studentExists) {
      // retorna erro de aluno esta cadastrado
      return res.status(400).json({ error: 'Non-student.' });
    }

    // verifica se plano esta cadastrado e ativo.
    const planExists = await Plan.findOne({
      where: { id: plan_id, canceled_at: null },
    });

    if (!planExists) {
      // retorna erro de plano não esta cadastrado ou não esta ativo
      return res
        .status(400)
        .json({ error: 'Plan is not registered or is inactive.' });
    }

    // busca plano selecionado
    const plan = await Plan.findByPk(plan_id);

    const end_date = addMonths(parseISO(start_date), plan.duration);

    const price = plan.price * plan.duration;

    // price.toLocaleString('pt-BR');

    // cria plano no banco de dados
    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    const enrollmentCreated = await Enrollment.findOne({
      where: student_id == enrollment.student_id,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    await Queue.add(EnrollmentMail.key, {
      enrollmentCreated,
    });

    // retorna o plano criado
    return res.json(enrollmentCreated);
  }

  async index(req, res) {
    const enrollments = await Enrollment.findAll({
      where: { canceled_at: null },
    });

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
    });

    // verificar schema dos dados enviados
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // pega o id da matricula e o id do plano de req.body
    const { plan_id, start_date, student_id } = req.body;

    // procura matricula no banco de dados pelo ID informado
    const enrollment = await Enrollment.findOne({
      where: { id: req.params.id, canceled_at: null },
    });

    if (!enrollment) {
      // retorna erro de aluno esta cadastrado
      return res.status(400).json({ error: 'Registration not found.' });
    }

    // verificar se o aluno esta no cadastrado
    if (enrollment.student_id != student_id) {
      // retorna erro de aluno não possui matrícula
      return res.status(400).json({ error: 'Unregistered student.' });
    }

    // busca aluno no banco de dados para verificar se ja existe.
    const studentExists = await Student.findOne({
      where: { id: student_id, canceled_at: null },
    });

    if (!studentExists) {
      // retorna erro de aluno esta cadastrado
      return res.status(400).json({ error: 'Non-student.' });
    }

    // verifica se plano esta cadastrado e ativo.
    const planExists = await Plan.findOne({
      where: { id: plan_id, canceled_at: null },
    });

    if (!planExists) {
      // retorna erro de plano não esta cadastrado ou não esta ativo
      return res
        .status(400)
        .json({ error: 'Plan is not registered or is inactive.' });
    }

    // verificar se o plano é diferente do que esta no cadastro
    if (enrollment.plan_id == plan_id) {
      return res
        .status(400)
        .json({ error: 'Student is already enrolled in this plan.' });
    }

    const end_date = addMonths(parseISO(start_date), planExists.duration);

    const price = planExists.price * planExists.duration;

    // pega os valores e atualiza o cadastro no banco
    enrollment.setAttributes({ plan_id, start_date, end_date, price });

    // pega os valores id, nome e provides e atualiza o cadastro no banco
    await enrollment.update({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    // retorna as informações da matrícula
    return res.json({ enrollment });
  }

  async delete(req, res) {
    // pega o id informado
    const { id } = req.params;

    // procura o plano com id informado
    const enrollmentExists = await Enrollment.findByPk(id);

    // retorna erro caso não encontre o plano
    if (!enrollmentExists) {
      return res.status(400).json({
        error: 'Enrollment does not exists',
      });
    }

    enrollmentExists.canceled_at = new Date();

    await enrollmentExists.save();

    return res.status(200).json();
  }
}

// exporta PlanControllher
export default new EnrollmentController();
