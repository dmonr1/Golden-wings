import { Router } from 'express'
import { getCatalog, searchCatalog } from '../services/catalog.service.js'

const router = Router()

router.get('/catalog', async (_req, res, next) => {
  try {
    res.json(await getCatalog())
  } catch (error) {
    next(error)
  }
})

router.get('/catalog/search', async (req, res, next) => {
  try {
    res.json(await searchCatalog(req.query.q))
  } catch (error) {
    next(error)
  }
})

export default router
