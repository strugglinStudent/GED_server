const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transportOptions = {
    pool: true,
    host: `${process.env.EMAIL_HOST}`,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: `${process.env.EMAIL_USER}`,
      pass: `${process.env.EMAIL_PASS}`,
    },
  };
  if (process.env.EMAIL_DKIM_PRIVATE_KEY) {
    const emailDkimPrivateKey = Buffer.from(process.env.EMAIL_DKIM_PRIVATE_KEY, 'base64').toString();
    transportOptions.dkim = {
      domainName: 'tic-nova.com',
      keySelector: 'tic-nova',
      privateKey: emailDkimPrivateKey,
    };
  }
  const transport = nodemailer.createTransport(transportOptions);

  const mailOptions = {
    from: `${process.env.EMAIL_USER}`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };
  if (process.env.BCC_EMAIL_USER) {
    mailOptions.bcc = process.env.BCC_EMAIL_USER;
  }

  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
