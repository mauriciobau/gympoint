// importa o Yup para realizar as validações das informações
// o Yup não possui um export defaul, por isso utiliza-se o *
import * as Yup from 'yup';

// importa a model Student
import Student from '../models/Student';

class StudentController {
  // criar aluno, async pois irá trabalhar com banco de dados
  async store(req, res) {
    // cria o schema e recebe o objeto Yup com a estrutura de verificação
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .required()
        .positive()
        .max(120)
        .min(12)
        .integer(),
      weight: Yup.number()
        .required()
        .positive(),
      height: Yup.number()
        .required()
        .positive(),
    });

    // faz a verificação através do schema criado pela função isValid dos dados passado pelo req.body
    if (!(await schema.isValid(req.body))) {
      // retorna erro de validação
      return res.status(400).json({ error: 'Validation fails' });
    }

    // procura um aluno que tenha o email informado em req.body.email
    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    // verificar se o aluno ja existe
    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    // cria aluno no banco de dados
    const { id, name, email, age, weight, height } = await Student.create(
      req.body
    );

    // precisa retornar algo
    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }

  // editar aluno
  async update(req, res) {
    // cria o schema e recebe o objeto Yup com a estrutura de verificação
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .required()
        .positive()
        .max(120)
        .min(12)
        .integer(),
      weight: Yup.number()
        .required()
        .positive(),
      height: Yup.number()
        .required()
        .positive(),
    });

    // verificar schema dos dados enviados
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // pega email de req.body
    const { email } = req.body;

    // procura aluno no banco de dados pelo ID informado no req.studentId
    const student = await Student.findByPk(req.params.id);
    // const student = await Student.findOne({ where: { email } });

    // verificar se o email é diferente do que esta no cadastro
    if (email != student.email) {
      // busca emial no banco de dados para verificar se ja existe.
      const studentExists = await Student.findOne({ where: { email } });

      if (studentExists) {
        // retorna erro de aluno ja existe
        return res.status(400).json({ error: 'Email student already exists.' });
      }
    }

    // pega os valores e atualiza o cadastro no banco
    const { id, name, age, weight, height } = await student.update(req.body);

    // retorna as informações do aluno
    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }
}

// exporta StudentControllher
export default new StudentController();
