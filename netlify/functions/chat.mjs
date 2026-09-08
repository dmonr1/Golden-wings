import catalog from '../../server/data/catalog.json' with { type: 'json' }

export default async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed.' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { message = '' } = await request.json()
    const query = message.trim().toLowerCase()

    if (!query) {
      return new Response(JSON.stringify({ error: 'Message is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const products = catalog.filter((item) =>
      [item.partNumber, item.description, item.fleet, item.category, item.condition]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    )

    return new Response(JSON.stringify({
      reply: products.length
        ? `I found ${products.length} product(s) related to your query.`
        : 'I could not find an exact match. We can send your request to our team.',
      products: products.slice(0, 5),
      needsContact: products.length === 0,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Chat function error:', error)
    return new Response(JSON.stringify({ error: 'Unable to process your request right now.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
