// importa Sequelize e  Model do sequelize
import Sequelize, { Model } from 'sequelize';

class Student extends Model {
  // metodo chamado automaticamente pelo sequelize
  static init(sequelize) {
    // classe pai de Model
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        age: Sequelize.INTEGER,
        weight: Sequelize.DECIMAL,
        height: Sequelize.DECIMAL,
      },
      // passa o objeto com o sequelize
      {
        sequelize,
      }
    );

    // retorna o model que acabou de ser inicializado no init().
    return this;
  }
}

// exporta aluno
export default Student;
