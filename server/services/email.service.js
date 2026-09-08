import nodemailer from 'nodemailer'

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    throw new Error('SMTP is not configured. Add the SMTP variables to the environment.')
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })
}

export async function sendContactEmail({ name, email, message, product }) {
  const transporter = getTransporter()
  const recipient = process.env.CONTACT_EMAIL || process.env.SMTP_USER

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: recipient,
    replyTo: email,
    subject: `Chatbot inquiry${product ? ` - ${product}` : ''}`,
    text: [`Name: ${name}`, `Email: ${email}`, `Product: ${product || 'Not specified'}`, '', message].join('\n'),
  })
}
