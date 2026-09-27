/**
 * Datos del tatuador centralizados. Cambia aquí cualquier dato de contacto
 * y se actualizará en toda la web.
 */
export const tattooArtist = {
  name: 'Salva Leiva',
  firstName: 'Salva',
  lastName: 'Leiva',
  role: 'Tattoo Artist',
  city: 'Almería',
  country: 'España',
  location: 'Almería, España',
  instagram: 'leiva_tattooink',
  // PROVISIONAL: sustituir por el número definitivo (formato internacional).
  whatsapp: '+34671458720',
  styles: ['Puntillismo', 'Geometría', 'Black & Grey'],
} as const

export const instagramUrl = `https://www.instagram.com/${tattooArtist.instagram}/`
