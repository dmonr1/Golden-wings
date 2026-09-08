import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import catalogRoutes from './routes/catalog.routes.js'
import chatRoutes from './routes/chat.routes.js'
import contactRoutes from './routes/contact.routes.js'

const app = express()
const port = Number(process.env.PORT || 3000)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'golden-wings-api' })
})

app.use('/api', catalogRoutes)
app.use('/api', chatRoutes)
app.use('/api', contactRoutes)

const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))

app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ error: 'Internal server error.' })
})

app.listen(port, () => {
  console.log(`Golden Wings server listening on port ${port}`)
})
