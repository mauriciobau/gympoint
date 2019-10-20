// importa o Sequelize de sequelize
import Sequelize from 'sequelize';

// importa model User
import User from '../app/models/User';

// importa model Student
import Student from '../app/models/Student';

// importa model Plan
import Plan from '../app/models/Plan';

// importa configurações do banco de dados
import databaseConfig from '../config/database';

// cria um array com todos os models
// const models = [User, File, Appointment ];
const models = [User, Student, Plan];

class Database {
  constructor() {
    this.init();
  }

  // metodo que conecta com o banco de dados e carrega as models
  init() {
    // variável esperada pelas models dentro do método init da model
    this.connection = new Sequelize(databaseConfig);

    // percorre o arrey através do map, retornando os models passados, chamando o metodo init
    // de cada model passando a conexão
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

// exportar database
export default new Database();
