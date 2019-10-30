// importa Sequelize e  Model do sequelize
import Sequelize, { Model } from 'sequelize';

class Checkin extends Model {
  // metodo chamado automaticamente pelo sequelize
  static init(sequelize) {
    // classe pai de Model
    super.init(
      {
        student_id: Sequelize.INTEGER,
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

// exporta checkin
export default Checkin;
