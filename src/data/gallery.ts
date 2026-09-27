import type { StyleKey } from './tattooStyles'

export type GalleryItem = {
  id: string
  /** Ruta a la foto real, p. ej. '/images/tattoo-01.webp'. Sin ella se muestra un placeholder. */
  src?: string
  alt: string
  title: string
  style: StyleKey
  zone?: string
  /** Dimensiones reales de la foto: definen la proporción, nunca se deforma. */
  width: number
  height: number
  seed: number
  /** Posición en la composición editorial (móvil: 6 columnas / desktop: 12). */
  layout: string
}

export const gallery: GalleryItem[] = [
  {
    id: '01',
    src: '/images/tattoo-04.webp',
    alt: 'Tatuaje geométrico en el hombro: estrella radial sombreada en puntillismo y hexágonos con flores',
    title: 'Estrella y colmena',
    style: 'geometry',
    zone: 'Hombro',
    width: 1152,
    height: 1522,
    seed: 11,
    layout: 'col-span-6 md:col-span-6 md:col-start-1',
  },
  {
    id: '02',
    src: '/images/tattoo-02.webp',
    alt: 'Mandala en puntillismo sobre la rodilla con un hexágono geométrico debajo',
    title: 'Mandala',
    style: 'dotwork',
    zone: 'Rodilla',
    width: 859,
    height: 1600,
    seed: 22,
    layout: 'col-span-4 col-start-3 md:col-span-4 md:col-start-9 md:mt-40',
  },
  {
    id: '03',
    src: '/images/tattoo-01.webp',
    alt: 'Flor de loto en black and grey junto a un patrón de hexágonos en la cabeza y el cuello',
    title: 'Loto y colmena',
    style: 'blackgrey',
    zone: 'Cabeza y cuello',
    width: 1256,
    height: 1370,
    seed: 33,
    layout: 'col-span-5 md:col-span-5 md:col-start-2 md:-mt-10',
  },
  {
    id: '04',
    src: '/images/tattoo-05.webp',
    alt: 'Personaje ilustrado "Escobart" con sombreado en puntillismo',
    title: 'Escobart',
    style: 'blackgrey',
    zone: 'Pierna',
    width: 1017,
    height: 1181,
    seed: 44,
    layout: 'col-span-4 col-start-3 md:col-span-4 md:col-start-8 md:mt-28',
  },
  {
    id: '05',
    src: '/images/tattoo-03.webp',
    alt: 'Pierna completa con mandala, flor de la vida y patrón de hexágonos con una flor',
    title: 'Flor de la vida',
    style: 'geometry',
    zone: 'Pierna',
    width: 1031,
    height: 1600,
    seed: 55,
    layout: 'col-span-3 md:col-span-4 md:col-start-1 md:mt-16',
  },
  {
    id: '06',
    src: '/images/tattoo-06.webp',
    alt: 'Mandala radial en puntillismo sobre el hombro con hexágonos',
    title: 'Radial',
    style: 'dotwork',
    zone: 'Hombro',
    width: 1296,
    height: 1503,
    seed: 66,
    layout: 'col-span-3 mt-20 md:col-span-4 md:col-start-5 md:mt-48',
  },
  {
    id: '07',
    src: '/images/tattoo-07.webp',
    alt: 'Mandala floral en puntillismo con pétalos sombreados',
    title: 'Flor de puntos',
    style: 'dotwork',
    width: 1320,
    height: 1496,
    seed: 77,
    layout: 'col-span-5 col-start-2 md:col-span-3 md:col-start-10 md:mt-8',
  },
]
