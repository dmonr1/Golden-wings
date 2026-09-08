import { Router } from 'express'
import { searchCatalog } from '../services/catalog.service.js'

const router = Router()

router.post('/chat', async (req, res, next) => {
  try {
    const { message = '' } = req.body

    if (!message.trim()) {
      return res.status(400).json({ error: 'Message is required.' })
    }

    const results = await searchCatalog(message)

    res.json({
      reply: results.length
        ? `I found ${results.length} product(s) related to your query.`
        : 'I could not find an exact match. We can send your request to our team.',
      products: results.slice(0, 5),
      needsContact: results.length === 0,
    })
  } catch (error) {
    next(error)
  }
})

export default router
