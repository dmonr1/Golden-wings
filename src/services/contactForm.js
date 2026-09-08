export async function submitContactForm(formData) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error || 'Unable to send your request.')
  }

  return data
}
