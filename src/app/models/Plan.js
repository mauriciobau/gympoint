// importa Sequelize e  Model do sequelize
import Sequelize, { Model } from 'sequelize';

class Plan extends Model {
  // metodo chamado automaticamente pelo sequelize
  static init(sequelize) {
    // classe pai de Model
    super.init(
      {
        title: Sequelize.STRING,
        duration: Sequelize.INTEGER,
        price: Sequelize.DECIMAL(13, 2),
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
export default Plan;
