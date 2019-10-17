// importa o JWT para gerar o token de autenticação
import jwt from 'jsonwebtoken';

// importa o Yup para realizar as validações das informações
// o Yup não possui um export defaul, por isso utiliza-se o *
import * as Yup from 'yup';

// arquivo com as configurações do token
import authConfig from '../../config/auth';

// importa a model User para ter a estrutura do usuário
import User from '../models/User';

class SessionController {
  async store(req, res) {
    // cria o schema e recebe o objeto Yup com a estrutura de verificação
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    // faz a verificação através do schema criado pela função isValid dos dados passado pelo req.body
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // pegar email e senha passados pelo req.body
    const { email, password } = req.body;

    // procura no banco de dados um usuário que contenha o email informado no req.body
    const user = await User.findOne({ where: { email } });

    // verificar se existe o usuário informado
    if (!user) {
      // retorna erro de usuário não encontrado
      return res.status(401).json({ error: 'User not found' });
    }

    // verifica se a senha informada esta correta.
    if (!(await user.checkPassword(password))) {
      // retorna erro de senha incorreta
      return res.status(401).json({ error: 'Password does not match' });
    }

    // pega id e nome do usuário encontrado no banco de dados.
    const { id, name } = user;

    // retorna os dados do usuário com o token
    return res.json({
      user: {
        id,
        name,
        email,
      },
      // gera o token para retornar, e passa a id do usuario no token,
      // authConfig.secret string de assinatura
      token: jwt.sign({ id }, authConfig.secret, {
        // tempo de expiração do token
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}
// exporta SessionControllher
export default new SessionController();
