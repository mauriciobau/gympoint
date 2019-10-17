// importa Sequelize e  Model do sequelize
import Sequelize, { Model } from 'sequelize';

// importa bcrypt de bcruptjs para ciptografar a senha
import bcrypt from 'bcryptjs';

class User extends Model {
  // metodo chamado automaticamente pelo sequelize
  static init(sequelize) {
    // classe pai de Model
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // VIRTUAL - n vair existir no banco de dados
        password_hash: Sequelize.STRING,
      },
      // passa o objeto com o sequelize
      {
        sequelize,
      }
    );

    // Hook do Sequelize - beforeSave - será executando antes de salvar no banco de dados
    // para gerar o hash da senha antes de salvar.
    this.addHook('beforeSave', async user => {
      // verifica se foi passado senha, que no caso é na criação ou edição do usuário
      if (user.password) {
        // criptografa a senha com "força" de 8
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    // retorna o model que acabou de ser inicializado no init().
    return this;
  }

  // método para verificar a senha informada para login
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

// exporta usuário
export default User;
