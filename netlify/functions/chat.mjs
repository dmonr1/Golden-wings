import catalog from '../../server/data/catalog.json' with { type: 'json' }

const CATALOG_CONTEXT = catalog.map(({ partNumber, description, price, condition, fleet, category, quantity }) => (
  `${partNumber} | ${description} | price: ${price} | condition: ${condition} | fleet: ${fleet} | quantity: ${quantity} | category: ${category}`
)).join('\n')

async function getAiReply({ message, language, activePart }) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-5-mini',
      store: false,
      max_output_tokens: 220,
      instructions: `You are Golden Wings International's aviation parts assistant. Reply in ${language === 'es' ? 'Spanish' : 'English'} in a concise, professional tone. Use only the catalog facts supplied below for prices, conditions, quantities, and availability. Never invent a price, stock level, certification, lead time, or company policy. If the answer is not in the catalog, state that the sales team must confirm it. When the visitor wants a quote, tell them you can start an RFQ in the chat.\n\nCatalog:\n${CATALOG_CONTEXT}`,
      input: `Visitor question: ${message}\n${activePart ? `Current selected part: ${JSON.stringify(activePart)}` : ''}`,
    }),
  })

  if (!response.ok) return null
  const data = await response.json()
  return data.output_text?.trim() || null
}

export default async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed.' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { message = '', activePartNumber = '', language = 'en' } = await request.json()
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
        reply: language === 'es'
          ? `${activePart.partNumber} — ${activePart.description} esta listado en ${activePart.price}. Condicion disponible: ${activePart.condition}. Cantidad mostrada: ${activePart.quantity}.`
          : `${activePart.partNumber} — ${activePart.description} is currently listed at ${activePart.price}. Available condition: ${activePart.condition}. Quantity shown: ${activePart.quantity}.`,
        action: {
          type: 'rfq',
          label: language === 'es' ? `Iniciar RFQ para ${activePart.partNumber}` : `Start RFQ for ${activePart.partNumber}`,
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

    if (products.length) {
      return new Response(JSON.stringify({
        reply: language === 'es'
          ? `Encontre ${products.length} producto(s) relacionado(s) con su busqueda.`
          : `I found ${products.length} product(s) related to your query.`,
        products: products.slice(0, 5),
        handled: true,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const aiReply = await getAiReply({ message, language, activePart })
    return new Response(JSON.stringify({
      reply: aiReply || (language === 'es'
        ? 'No encontre una coincidencia exacta. Puedo ayudarle a iniciar una RFQ para que nuestro equipo la revise.'
        : 'I could not find an exact match. I can help you start an RFQ so our team can review it.'),
      action: /\b(rfq|quote|quotation|price|pricing|cost|precio|cotiz)/.test(query)
        ? { type: 'rfq', label: language === 'es' ? 'Iniciar RFQ en el chat' : 'Start RFQ in chat' }
        : undefined,
      handled: Boolean(aiReply),
      needsContact: !aiReply,
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
