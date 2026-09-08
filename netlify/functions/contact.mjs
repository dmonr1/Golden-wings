import nodemailer from 'nodemailer'

export default async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed.' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { name, email, partNumber = '', request: inquiry } = await request.json()

    if (!name || !email || !inquiry) {
      return new Response(JSON.stringify({ error: 'Name, email, and request are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 465),
      secure: process.env.SMTP_SECURE !== 'false',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      replyTo: email,
      subject: `RFQ Inquiry: Part #${partNumber || 'General'} - ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Part Number: ${partNumber || 'Not specified'}`,
        '',
        'Request / Specifications:',
        inquiry,
      ].join('\n'),
    })

    return new Response(JSON.stringify({ ok: true }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Contact function error:', error)
    return new Response(JSON.stringify({ error: 'Unable to send your request right now.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
