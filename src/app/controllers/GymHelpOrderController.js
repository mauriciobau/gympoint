// importa o Yup para realizar as validações das informações
// o Yup não possui um export defaul, por isso utiliza-se o *
import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import AnswerHelpOrderMail from '../jobs/AnswerHelpOrderMail';
import Queue from '../../lib/Queue';

class GymHelpOrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .required(),
      answer: Yup.string().required(),
    });

    if (
      !(await schema.isValid({
        id: req.params.id,
        answer: req.body.answer,
      }))
    ) {
      // retorna erro de validação
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const { answer } = req.body;

    const helpOrder = await HelpOrder.findOne({
      where: id === id,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!helpOrder) {
      return res.status(400).json({ error: 'Help Order not registred.' });
    }

    const answer_at = new Date();

    helpOrder.setAttributes({ answer, answer_at });

    await HelpOrder.update(
      {
        answer,
        answer_at,
      },
      {
        where: {
          id,
        },
      }
    );

    await Queue.add(AnswerHelpOrderMail.key, {
      helpOrder,
    });

    return res.status(200).json(helpOrder);
  }

  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: { answer_at: null },
    });

    return res.status(200).json(helpOrders);
  }
}

export default new GymHelpOrderController();
