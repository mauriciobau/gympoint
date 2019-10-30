// importa o Yup para realizar as validações das informações
// o Yup não possui um export defaul, por isso utiliza-se o *
import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class StudentHelpOrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .required(),
      question: Yup.string().required(),
    });

    if (
      !(await schema.isValid({
        student_id: req.params.student_id,
        question: req.body.question,
      }))
    ) {
      // retorna erro de validação
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id } = req.params;

    const { question } = req.body;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student not registred.' });
    }

    const helpOrder = await HelpOrder.create({
      student_id,
      question,
    });

    return res.status(200).json(helpOrder);
  }

  async index(req, res) {
    const { student_id } = req.params;

    if (student_id) {
      const student = await Student.findByPk(student_id);

      if (!student) {
        return res.status(400).json({ error: 'Student not registred.' });
      }

      const helpOrders = await HelpOrder.findAll({
        where: { student_id },
      });

      return res.status(200).json(helpOrders);
    }

    const helpOrders = await HelpOrder.findAll({
      where: { student_id },
    });

    return res.status(200).json(helpOrders);
  }
}

export default new StudentHelpOrderController();
