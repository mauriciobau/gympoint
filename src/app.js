// importando o express para iniciar a aplicação
import express from 'express';

// importando arquivo de routes.js para carregar as rotas da aplicação
import routes from './routes';

// importa o arquivo database para realizar a conexão com o banco de dados
import './database';

class App {
  // metodo chamado automaticamento quando a classe é instanciada
  constructor() {
    // inicia o express
    this.server = express();

    // chama o método middlewares da classe
    this.middlewares();

    // chama o método routes da classe
    this.routes();
  }

  middlewares() {
    // define o formato json para trabalhar com as requisições
    this.server.use(express.json());
  }

  routes() {
    // define a utilização das rotas pelo arquivo rotes.js que foi importado
    this.server.use(routes);
  }
}

// exporta uma nova instancia de App definindo apenas o server para ser acessado
export default new App().server;
