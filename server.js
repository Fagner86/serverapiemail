const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
const ics = require('ics');



const app = express();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);




app.use(cors()); // Adicione essa linha antes das rotas
app.use(express.json()); // Para analisar JSON no corpo da solicitação
app.use(express.urlencoded({ extended: true })); // Para analisar dados de formulário no corpo da solicitação
app.post('/send-email', async (req, res) => {
  console.log('Endpoint /send-email');



  try {
    const { email, date, endDate, startTime, endTime, nomeReserva} = req.body;

    const startDateArray = date.split('-').map(Number);
    const endDateArray = endDate.split('-').map(Number);
    const startTimeArray = startTime.split(':').map(Number);
    const endTimeArray = endTime.split(':').map(Number);

  
    const event = {
      start: [...startDateArray, ...startTimeArray],
      end: [...endDateArray, ...endTimeArray],
      title:`Você reservou ${nomeReserva}`,
      description: 'Sua reserva foi confirmada.',
      location:   `DI UERN`,
      organizer: { email: 'ambitechdi@gmail.com', name: 'Ambitech' },
      method: 'REQUEST',
      status: 'CONFIRMED',
      attendees: [
        { email, name: 'Nome do Participante', rsvp: true, partstat: 'NEEDS-ACTION' },
      ],
    };

    const { error, value } = await ics.createEvent(event);

    if (error) {
      console.error('Erro ao criar o evento ICS:', error);
      res.status(500).json({ error: 'Erro ao criar o evento ICS.' });
      return;
    }
    const texMessage = `Sua reserva foi confirmada para o período de 
    ${date} às ${startTime} até ${endDate} às ${endTime}.`;


    const icsContent = value;
    const message = {
      to: email,
      from: 'ambitechdi@gmail.com',
      subject: 'Confirmação de reserva',
      text: texMessage,
      attachments: [
        {
          content: Buffer.from(icsContent).toString('base64'),
          filename: 'convite.ics',
          type: 'text/calendar',
          disposition: 'attachment',
          contentDisposition: 'inline',
        },
        
      ],
    };

    await sgMail.send(message);

    console.log('Email de confirmação enviado com sucesso.');

    res.status(200).json({ message: 'Email de confirmação enviado com sucesso.' });
  } catch (error) {
    console.error('Erro ao enviar o email de confirmação:', error);
    res.status(500).json({ error: 'Erro ao enviar o email de confirmação.' });
  }
});

app.listen(process.env.PORT, () => {
  console.log('Servidor iniciado na porta 4000');
});

