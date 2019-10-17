// importa o JWT para poder verificar o token gerado ao logar
import jwt from 'jsonwebtoken';

// util - biblioteca padrão do nodejs
// importamos apenas o promisify que serve para pegar uma função de callback e transforma em
// uma função que pode utilizar o async/await
import { promisify } from 'util';

// arquivo com as configurações do token pois precisamos do segredo do token para valida-lo
import authConfig from '../../config/auth';

// exporta o middleware
export default async (req, res, next) => {
  // pega o toke gerado ao logar que é passado através de req.headers.authorization.
  const authHeader = req.headers.authorization;

  // Verificar se existe o token
  if (!authHeader) {
    // retorna erro de token não enviado
    return res.status(401).json({ error: 'Token not provided' });
  }

  // o token é passado com a palavra Bearer antes do token
  // separa a string através do split retornando um array com Bearer na primeira
  // posição e o token na segunda posição, por isso usa-se a desestruturação,
  // como n vamos usar o Bearer, n informamos a variavel para o Bearer descartando ele.
  const [, token] = authHeader.split(' ');

  // usa-se try - catch pois pode retornar erro
  try {
    // jwt.verify - verifica se token esta correto através de função callback
    // promisify - para usar o await no lugar do callback e melhorar o processamento
    // o decoded irá receber as informações que foram usada para gerar o token
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // inclui o ID do usuário que fez o login no req
    req.userId = decoded.id;

    // retorna o next() pois passou pelas verificações e o usuário esta autenticado
    // seguindo assim a aplicação.
    return next();
  } catch (err) {
    // retorna erro de token inválido
    return res.status(401).json({ error: 'Token invalid' });
  }
};
