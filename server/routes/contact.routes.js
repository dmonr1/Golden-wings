import { Router } from 'express'
import { sendContactEmail } from '../services/email.service.js'

const router = Router()

router.post('/contact', async (req, res, next) => {
  try {
    const { name, email, message, product } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required.' })
    }

    await sendContactEmail({ name, email, message, product })
    return res.status(201).json({ ok: true })
  } catch (error) {
    next(error)
  }
})

export default router
