// importa o Yup para realizar as validações das informações
// o Yup não possui um export defaul, por isso utiliza-se o *
import * as Yup from 'yup';
// importa date-fns para calular a data final da matricula
import { subDays } from 'date-fns';

import { Op } from 'sequelize';

import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .required(),
    });

    if (!(await schema.isValid(req.params))) {
      // retorna erro de validação
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id } = req.params;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student not registred.' });
    }

    const days = new Date();
    const maxDays = subDays(new Date(), 7);

    const checkin = await Checkin.findAndCountAll({
      where: {
        student_id,
        created_at: {
          [Op.between]: [maxDays, days],
        },
      },
    });

    if (checkin.count > 4) {
      return res
        .status(400)
        .json({ error: 'Studante has already checked 5 in the last 7 days.' });
    }

    const checked = await Checkin.create({
      student_id,
    });

    return res.status(200).json(checked);
  }

  async index(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .required(),
    });

    if (!(await schema.isValid(req.params))) {
      // retorna erro de validação
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id } = req.params;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student not registred.' });
    }

    const checkins = await Checkin.findAll({ where: { student_id } });

    return res.status(200).json(checkins);
  }
}

export default new CheckinController();
