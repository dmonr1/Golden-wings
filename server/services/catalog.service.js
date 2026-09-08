import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const catalogPath = path.join(__dirname, '..', 'data', 'catalog.json')

export async function getCatalog() {
  const file = await fs.readFile(catalogPath, 'utf8')
  return JSON.parse(file)
}

export async function searchCatalog(query = '') {
  const catalog = await getCatalog()
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) return catalog

  return catalog.filter((item) =>
    [item.partNumber, item.description, item.fleet, item.category, item.condition]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(normalizedQuery)),
  )
}
