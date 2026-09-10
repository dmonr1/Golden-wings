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

    const smtpUser = process.env.SMTP_USER?.trim()
    // Gmail displays app passwords in groups of four characters. Remove those
    // presentation spaces so either format works in local and Netlify settings.
    const smtpPassword = process.env.SMTP_PASSWORD?.replace(/\s/g, '')

    if (!smtpUser || !smtpPassword) {
      throw new Error('Missing SMTP configuration.')
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 465),
      secure: process.env.SMTP_SECURE !== 'false',
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    })

    await transporter.sendMail({
      from: smtpUser,
      to: process.env.CONTACT_EMAIL?.trim() || smtpUser,
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
