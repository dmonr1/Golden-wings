import catalog from '../../server/data/catalog.json' with { type: 'json' }

export default async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed.' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { message = '', activePartNumber = '' } = await request.json()
    const query = message.trim().toLowerCase()

    if (!query) {
      return new Response(JSON.stringify({ error: 'Message is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const activePart = catalog.find(
      (item) => item.partNumber.toLowerCase() === activePartNumber.trim().toLowerCase(),
    )
    const isPricingQuestion = /\b(price|pricing|cost|quote|quotation|rfq|precio|cotiz)/.test(query)

    if (isPricingQuestion && activePart) {
      return new Response(JSON.stringify({
        handled: true,
        reply: `${activePart.partNumber} — ${activePart.description} is currently listed at ${activePart.price}. Available condition: ${activePart.condition}. Quantity shown: ${activePart.quantity}.`,
        action: {
          label: `Request RFQ for ${activePart.partNumber}`,
          link: `/contact?partNumber=${encodeURIComponent(activePart.partNumber)}`,
        },
      }), {
        status: 200,
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
      handled: products.length > 0,
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
