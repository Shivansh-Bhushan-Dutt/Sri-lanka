import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/enquiry', async (req, res) => {
  const { name, phone, email, message } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const fromName = process.env.FROM_NAME || 'Sikh Channel Yatras';
  const subject = 'Sri Panj Takht Sahib Yatra Enquiry';
  const text = [
    'New enquiry received from the website:',
    `Name: ${name}`,
    `Contact Number: ${phone || 'N/A'}`,
    `Email: ${email}`,
    'Message:',
    message || 'N/A',
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #222;">
      <h2 style="margin: 0 0 12px;">New website enquiry</h2>
      <table cellspacing="0" cellpadding="6" style="border-collapse: collapse;">
        <tr><td style="font-weight: bold;">Name</td><td>${name}</td></tr>
        <tr><td style="font-weight: bold;">Contact Number</td><td>${phone || 'N/A'}</td></tr>
        <tr><td style="font-weight: bold;">Email</td><td>${email}</td></tr>
        <tr><td style="font-weight: bold;">Message</td><td>${message || 'N/A'}</td></tr>
      </table>
      <p style="margin-top: 16px; color: #666;">Sent via the Sri Panj Takht Sahib Yatra website.</p>
    </div>
  `;

  // SMTP configuration via environment variables
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.FROM_EMAIL || smtpUser;
  const toEmail = process.env.TO_EMAIL || 'shivansh@immerseindiatours.com';

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    console.warn('SMTP not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.');
    return res.status(500).json({ error: 'Mail server not configured' });
  }

  try {
    const smtpPortNumber = Number(smtpPort);
    const secure = smtpPortNumber === 465; // true for 465 (SSL), false for 587 (TLS)

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPortNumber,
      secure,
      requireTLS: !secure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        servername: smtpHost,
      },
    });

    await transporter.verify();

    const info = await transporter.sendMail({
      from: `${fromName} <${fromEmail}>`,
      to: toEmail,
      subject,
      text,
      html,
      headers: {
        'X-Source': 'Website enquiry',
      },
      envelope: {
        from: fromEmail,
        to: toEmail,
      },
    });

    console.log('Email sent', { messageId: info.messageId, response: info.response });

    return res.json({ ok: true });
  } catch (err) {
    const errObj = err instanceof Error ? err : new Error(String(err));
    const details = {
      message: errObj.message,
      code: errObj.code,
      command: errObj.command,
      response: errObj.response,
    };
    console.error('SMTP error', details);
    return res.status(500).json({ error: 'Failed to send email', details });
  }
});

app.listen(port, () => {
  console.log(`Email server listening on port ${port}`);
  console.log('Ensure SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS are set in environment.');
});
