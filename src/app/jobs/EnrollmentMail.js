import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const { enrollmentCreated } = data;

    await Mail.sendMail({
      to: `${enrollmentCreated.student.name} <${enrollmentCreated.student.email}>`,
      subject: 'Matrícula realizada',
      template: 'enrollment',
      context: {
        student: enrollmentCreated.student.name,
        price: enrollmentCreated.price,
        date_start: format(
          parseISO(enrollmentCreated.start_date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
        date_end: format(
          parseISO(enrollmentCreated.end_date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new EnrollmentMail();
