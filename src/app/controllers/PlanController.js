// importa o Yup para realizar as validações das informações
// o Yup não possui um export defaul, por isso utiliza-se o *
import * as Yup from 'yup';

// importa a model Plan
import Plan from '../models/Plan';

class PlanController {
  // criar plano, async pois irá trabalhar com banco de dados
  async store(req, res) {
    // cria o schema e recebe o objeto Yup com a estrutura de verificação
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .required(),
      price: Yup.number()
        .required()
        .positive(),
    });

    // faz a verificação através do schema criado pela função isValid dos dados passado pelo req.body
    if (!(await schema.isValid(req.body))) {
      // retorna erro de validação
      return res.status(400).json({ error: 'Validation fails' });
    }

    // procura um plano que tenha o titulo informado em req.body.title
    const planExists = await Plan.findOne({
      where: { title: req.body.title, canceled_at: null },
    });

    // verificar se o plano ja existe
    if (planExists) {
      return res.status(400).json({ error: 'Plan already exists.' });
    }

    // cria plano no banco de dados
    const { id, title, duration, price } = await Plan.create(req.body);

    // retorna o plano criado
    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async index(req, res) {
    const plans = await Plan.findAll({
      where: { canceled_at: null },
    });

    return res.status(200).json(plans);
  }

  // editar plano
  async update(req, res) {
    // cria o schema e recebe o objeto Yup com a estrutura de verificação
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .required(),
      price: Yup.number()
        .required()
        .positive(),
    });

    // verificar schema dos dados enviados
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // pega titulo de req.body
    const { title } = req.body;

    // procura plano no banco de dados pelo ID informado
    const plan = await Plan.findByPk(req.params.id);

    // verificar se o titule é diferente do que esta no cadastro
    if (title != plan.title) {
      // busca title no banco de dados para verificar se ja existe.
      const planExists = await Plan.findOne({
        where: { title, canceled_at: null },
      });

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

    // await Plan.destroy({ where: { id } });

    planExists.canceled_at = new Date();

    await planExists.save();

    return res.status(200).json();
  }
}

// exporta PlanControllher
export default new PlanController();
