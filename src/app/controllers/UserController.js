// importa o Yup para realizar as validações das informações
// o Yup não possui um export defaul, por isso utiliza-se o *
import * as Yup from 'yup';

// importa a model User
import User from '../models/User';

class UserController {
  // criar usuário, async pois irá trabalhar com banco de dados
  async store(req, res) {
    // cria o schema e recebe o objeto Yup com a estrutura de verificação
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
      // faz a verificação se as senhas conferem e torna o campo obrigatorio
      confirmPassword: Yup.string().when('password', (password, field) =>
        // oneOf -
        // Yup.ref - faz a referencia com o campo password
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    // faz a verificação através do schema criado pela função isValid dos dados passado pelo req.body
    if (!(await schema.isValid(req.body))) {
      // retorna erro de validação
      return res.status(400).json({ error: 'Validation fails' });
    }

    // procura um usuário que tenha o email informado em req.body.email
    const userExists = await User.findOne({ where: { email: req.body.email } });

    // verificar se o usuário ja existe
    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // cria usuario no banco de dados
    const { id, name, email, provider } = await User.create(req.body);

    // precisa retornar algo
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  // editar usuário
  async update(req, res) {
    // cria o schema e recebe o objeto Yup com a estrutura de verificação
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      // torna o password obrigatorio apenas se foi informado o oldPassword, caracterizando uma troca de senha
      password: Yup.string()
        .min(6)
        .when(
          'odlPassword',
          (oldPassword, field) => (oldPassword ? field.required() : field) // field - refere-se ao campo password
        ),
      // faz a verificação se as senhas conferem e torna o campo obrigatorio
      confirmPassword: Yup.string().when('password', (password, field) =>
        // oneOf -
        // Yup.ref - faz a referencia com o campo password
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // pega email e senha antiga de req.body
    const { email, oldPassword } = req.body;

    // procura usuario no banco de dados pelo ID informado no req.userId
    const user = await User.findByPk(req.userId);

    // verificar se o email é diferente do que esta no cadastro
    if (email != user.email) {
      // busca emial no banco de dados para verificar se ja existe.
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        // retorna erro de usuário ja existe
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    // verificar se a senha antiga passada confere com a do banco de dados.
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      // retorna erro de senha inválida
      return res.status(401).json({ error: 'Password does not match' });
    }

    // pega os valores id, nome e provides e atualiza o cadastro no banco
    const { id, name, provider } = await user.update(req.body);

    // retorna as informações do usuário
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

// exporta UserControllher
export default new UserController();
