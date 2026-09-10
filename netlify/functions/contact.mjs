import nodemailer from 'nodemailer'

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const emailRow = (label, value) => `
  <tr>
    <td style="padding: 0 0 6px; color: #6b7a90; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">${label}</td>
  </tr>
  <tr>
    <td style="padding: 0 0 18px; color: #10233f; font-size: 16px; font-weight: 600; line-height: 1.45;">${value}</td>
  </tr>
`

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
      html: `
        <div style="margin: 0; padding: 28px 16px; background: #f2f6fa; font-family: Arial, Helvetica, sans-serif; color: #10233f;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 28px rgba(16, 35, 63, 0.12);">
            <tr>
              <td style="padding: 28px 32px; background: #144485;">
                <p style="margin: 0 0 8px; color: #f4c542; font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;">Golden Wings International</p>
                <h1 style="margin: 0; color: #ffffff; font-size: 25px; line-height: 1.25;">New RFQ inquiry</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px 32px 12px;">
                <p style="margin: 0 0 24px; color: #53657d; font-size: 15px; line-height: 1.55;">A new request was sent from the Golden Wings website.</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  ${emailRow('Contact name', escapeHtml(name))}
                  ${emailRow('Email address', `<a href="mailto:${encodeURIComponent(email)}" style="color: #1467ae; text-decoration: none;">${escapeHtml(email)}</a>`)}
                  ${emailRow('Part number', escapeHtml(partNumber || 'Not specified'))}
                </table>
                <div style="margin: 4px 0 24px; padding: 18px 20px; background: #f2f6fa; border-left: 4px solid #f4c542; border-radius: 0 8px 8px 0;">
                  <p style="margin: 0 0 8px; color: #6b7a90; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">Request / specifications</p>
                  <p style="margin: 0; color: #10233f; font-size: 15px; line-height: 1.6; white-space: pre-line;">${escapeHtml(inquiry)}</p>
                </div>
                <a href="mailto:${encodeURIComponent(email)}" style="display: inline-block; padding: 13px 20px; background: #144485; border-radius: 7px; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none;">Reply to inquiry</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 18px 32px 24px; border-top: 1px solid #e5ecf3; color: #8090a5; font-size: 12px; line-height: 1.5;">This message was generated from the Golden Wings website contact form.</td>
            </tr>
          </table>
        </div>
      `,
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
