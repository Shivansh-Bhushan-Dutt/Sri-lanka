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

  const subject = 'Sri Panj Takht Sahib Yatra Enquiry';
  const text = `Name: ${name}\nContact Number: ${phone || ''}\nEmail: ${email}\nMessage:\n${message || ''}`;

  // SMTP configuration via environment variables
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.FROM_EMAIL || smtpUser;
  const toEmail = process.env.TO_EMAIL || 'shivansh@immerseindiatours.com';

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    console.warn('SMTP not configured. Will attempt FormSubmit fallback.');

    try {
      const formSubmitResp = await fetch('https://formsubmit.co/ajax/shivansh@immerseindiatours.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: subject,
          _captcha: 'false',
          _template: 'table',
          name,
          phone,
          email,
          message,
        }),
      });

      const formText = await formSubmitResp.text();
      if (!formSubmitResp.ok) {
        console.error('FormSubmit error status', formSubmitResp.status, 'body', formText);
        return res.status(500).json({ error: 'Failed to send email', provider: 'formsubmit', details: formText });
      }

      console.log('FormSubmit response:', formText);
      return res.json({ ok: true, provider: 'formsubmit', details: formText });
    } catch (formSubmitErr) {
      console.error('FormSubmit fallback failed', formSubmitErr);
      return res.status(500).json({ error: 'Mail server not configured and FormSubmit fallback failed' });
    }
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: Number(smtpPort) === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject,
      text,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error('SMTP error, falling back to FormSubmit', err);

    try {
      const formSubmitResp = await fetch('https://formsubmit.co/ajax/shivansh@immerseindiatours.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: subject,
          _captcha: 'false',
          _template: 'table',
          name,
          phone,
          email,
          message,
        }),
      });

      const formText = await formSubmitResp.text();
      if (!formSubmitResp.ok) {
        console.error('FormSubmit error status', formSubmitResp.status, 'body', formText);
        return res.status(500).json({ error: 'Failed to send email', provider: 'formsubmit', details: formText });
      }

      console.log('FormSubmit response:', formText);
      return res.json({ ok: true, provider: 'formsubmit', details: formText });
    } catch (formSubmitErr) {
      console.error('FormSubmit fallback failed', formSubmitErr);
      return res.status(500).json({ error: 'Failed to send email' });
    }
  }
});

app.listen(port, () => {
  console.log(`Email server listening on port ${port}`);
  console.log('Ensure SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS are set in environment.');
});
