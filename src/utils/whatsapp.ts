import { tattooArtist } from '../config/artist'

export type Consultation = {
  style?: string
  zone?: string
  size?: string
  design?: string
  idea?: string
  hasReferences?: boolean
}

export function whatsappUrl(message?: string): string {
  const phone = tattooArtist.whatsapp.replace(/\D/g, '')
  const base = `https://wa.me/${phone}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export function buildConsultationMessage(c: Consultation): string {
  const lines = [`Hola ${tattooArtist.firstName}, me gustaría consultar por un tatuaje.`, '']

  if (c.style) lines.push(`Estilo: ${c.style}`)
  if (c.zone) lines.push(`Zona: ${c.zone}`)
  if (c.size) lines.push(`Tamaño: ${c.size}`)
  if (c.design) lines.push(`Diseño: ${c.design}`)

  const idea = c.idea?.trim()
  if (idea) lines.push('', 'Idea:', idea)
  if (c.hasReferences) lines.push('', 'Tengo imágenes de referencia, te las envío por aquí.')

  lines.push('', 'Me gustaría saber disponibilidad y presupuesto.')
  return lines.join('\n')
}

export function openWhatsApp(message?: string): void {
  window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer')
}
