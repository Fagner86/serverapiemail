const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');

const app = express();
sgMail.setApiKey('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');

app.use(cors()); // Adicione essa linha antes das rotas
app.use(express.json()); // Para analisar JSON no corpo da solicitação
app.use(express.urlencoded({ extended: true })); // Para analisar dados de formulário no corpo da solicitação
app.post('/send-email', async (req, res) => {
  console.log('Endpoint /send-email');

  try {
    const { email, date, endDate, startTime, endTime } = req.body;
    console.log(email);

    // Aqui pode usar as datas e horas da reserva para personalizar o conteúdo do email
    const mensagem = `Sua reserva foi confirmada para o período de ${date} as ${startTime} até ${endDate} as ${endTime}.`;

    const msg = {
      to: email,
      from: 'ambitechdi@gmail.com',
      subject: 'Confirmação de reserva',
      text: mensagem,
    };

    await sgMail.send(msg);

    console.log('Email de confirmação enviado com sucesso.');

    res.status(200).json({ message: 'Email de confirmação enviado com sucesso.' });
  } catch (error) {
    console.error('Erro ao enviar o email de confirmação:', error);
    res.status(500).json({ error: 'Erro ao enviar o email de confirmação.' });
  }
});


app.listen(4000, () => {
  console.log('Servidor iniciado na porta 4000');
});
