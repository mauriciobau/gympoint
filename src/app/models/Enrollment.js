// importa Sequelize e  Model do sequelize
import Sequelize, { Model } from 'sequelize';

class Enrollment extends Model {
  // metodo chamado automaticamente pelo sequelize
  static init(sequelize) {
    // classe pai de Model
    super.init(
      {
        student_id: Sequelize.INTEGER,
        plan_id: Sequelize.INTEGER,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.DECIMAL(13, 2),
        canceled_at: Sequelize.DATE,
      },
      // passa o objeto com o sequelize
      {
        sequelize,
      }
    );

    // retorna o model que acabou de ser inicializado no init().
    return this;
  }

  // método para associação com Matriculas.
  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
    this.belongsTo(models.Plan, { foreignKey: 'plan_id', as: 'plan' });
  }
}

// exporta aluno
export default Enrollment;
