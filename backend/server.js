require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Serve static files (the frontend) from ../frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Serve resume.pdf from project root so frontend can request '/resume.pdf'
app.get('/resume.pdf', (req, res) => {
  const resumePath = path.join(__dirname, '..', 'resume.pdf');
  if (fs.existsSync(resumePath)) return res.sendFile(resumePath);
  return res.status(404).send('Not found');
});

function validateEmail(email) {
  return typeof email === 'string' && /\S+@\S+\.\S+/.test(email);
}

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message || !validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid submission' });
  }

  // If SMTP configured, send email via nodemailer
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const toEmail = process.env.TO_EMAIL || process.env.SMTP_USER;

  if (smtpHost && smtpUser && smtpPass && toEmail) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: smtpUser, pass: smtpPass }
      });

      await transporter.sendMail({
        from: `${name} <${email}>`,
        to: toEmail,
        subject: `Portfolio inquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`
      });

      return res.json({ ok: true });
    } catch (err) {
      console.error('Mail send error:', err);
      return res.status(500).json({ error: 'Failed to send email' });
    }
  }

  // Fallback: append to submissions.json inside backend
  try {
    const submissionsPath = path.join(__dirname, 'submissions.json');
    const entry = { name, email, message, date: new Date().toISOString() };
    let arr = [];
    if (fs.existsSync(submissionsPath)) {
      arr = JSON.parse(fs.readFileSync(submissionsPath, 'utf8') || '[]');
    }
    arr.push(entry);
    fs.writeFileSync(submissionsPath, JSON.stringify(arr, null, 2));
    return res.json({ ok: true, saved: true });
  } catch (err) {
    console.error('Fallback save error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
