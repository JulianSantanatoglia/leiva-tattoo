export type StyleKey = 'dotwork' | 'geometry' | 'blackgrey'

export type TattooStyle = {
  key: StyleKey
  index: string
  title: string
  local: string
  text: string
  detail: string
  /** Foto real que ilustra el estilo. */
  image: { src: string; width: number; height: number }
}

export const tattooStyles: TattooStyle[] = [
  {
    key: 'dotwork',
    index: '01',
    title: 'Dotwork',
    local: 'Puntillismo',
    text: 'Sombras construidas punto a punto. Texturas suaves y profundas que envejecen bien en la piel.',
    detail: 'Miles de puntos. Ninguno al azar.',
    image: { src: '/images/tattoo-07.webp', width: 1320, height: 1496 },
  },
  {
    key: 'geometry',
    index: '02',
    title: 'Geometry',
    local: 'Geometría',
    text: 'Simetría, proporción y línea limpia. Cada diseño se mide para seguir la forma del cuerpo.',
    detail: 'Compás, regla y pulso.',
    image: { src: '/images/tattoo-03.webp', width: 1031, height: 1600 },
  },
  {
    key: 'blackgrey',
    index: '03',
    title: 'Black & Grey',
    local: 'Negro y grises',
    text: 'Tinta negra diluida en capas. Volumen, luz y contraste sin necesidad de un solo color.',
    detail: 'Todo lo que cabe entre el negro y la piel.',
    image: { src: '/images/tattoo-01.webp', width: 1256, height: 1370 },
  },
]

export const styleName: Record<StyleKey, string> = {
  dotwork: 'Dotwork',
  geometry: 'Geometry',
  blackgrey: 'Black & Grey',
}
