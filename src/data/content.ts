export type ProcessStep = {
  index: string
  title: string
  text: string
  note: string
}

export const processSteps: ProcessStep[] = [
  {
    index: '01',
    title: 'Idea',
    text: 'Me cuentas qué quieres, dónde y por qué. Referencias, tamaño, zona. Sin compromiso.',
    note: 'Conversación',
  },
  {
    index: '02',
    title: 'Design',
    text: 'Dibujo una pieza solo para ti. La ajustamos juntos hasta que encaje con tu cuerpo y con tu idea.',
    note: 'Boceto a medida',
  },
  {
    index: '03',
    title: 'Session',
    text: 'Material estéril, estudio tranquilo y el tiempo que haga falta. Tú te relajas, yo me concentro.',
    note: 'Aguja y pulso',
  },
  {
    index: '04',
    title: 'Result',
    text: 'Te llevas la pieza y una guía de cuidados. El seguimiento no termina cuando sales por la puerta.',
    note: 'Cuidado y seguimiento',
  },
]

export type PainZone = {
  id: string
  name: string
  range: [number, number]
  note: string
  tip: string
}

/** Referencia orientativa y subjetiva. No es información médica. */
export const painZones: PainZone[] = [
  {
    id: 'brazo',
    name: 'Brazo',
    range: [3, 4],
    note: 'Músculo y piel firme. Una de las zonas más llevaderas para una primera pieza.',
    tip: 'Duerme bien la noche anterior y come algo antes de venir.',
  },
  {
    id: 'antebrazo',
    name: 'Antebrazo',
    range: [3, 5],
    note: 'La cara exterior es suave. La interior y la muñeca se notan algo más.',
    tip: 'Hidrata la piel durante la semana previa: se trabaja mejor.',
  },
  {
    id: 'hombro',
    name: 'Hombro',
    range: [3, 5],
    note: 'Zona agradecida. Se vuelve más intensa cerca de la clavícula.',
    tip: 'Ven con ropa amplia que deje el hombro libre sin rozar.',
  },
  {
    id: 'pecho',
    name: 'Pecho',
    range: [5, 7],
    note: 'El esternón y la zona cercana a la axila suelen notarse bastante.',
    tip: 'Mejor sesiones algo más cortas y pausas cuando las necesites.',
  },
  {
    id: 'costillas',
    name: 'Costillas',
    range: [7, 9],
    note: 'Piel fina sobre hueso y la respiración mueve la zona. Exigente, pero se lleva.',
    tip: 'Respira lento y constante. Ten agua y algo dulce a mano.',
  },
  {
    id: 'espalda',
    name: 'Espalda',
    range: [4, 6],
    note: 'Omóplatos llevaderos. La columna y la zona lumbar, más intensas.',
    tip: 'Para piezas grandes, repartir el trabajo en varias sesiones.',
  },
  {
    id: 'muslo',
    name: 'Muslo',
    range: [3, 5],
    note: 'Superficie amplia y acolchada. Ideal para piezas de gran formato.',
    tip: 'Ropa cómoda que permita dejar la zona accesible.',
  },
  {
    id: 'pierna',
    name: 'Pierna',
    range: [4, 7],
    note: 'El gemelo es cómodo. La espinilla, pegada al hueso, se nota más.',
    tip: 'Evita el alcohol las 24 horas previas a la sesión.',
  },
]

export const consultOptions = {
  style: ['Puntillismo', 'Geometría', 'Black & Grey', 'Diseño personalizado', 'Otro'],
  zone: ['Brazo', 'Antebrazo', 'Hombro', 'Espalda', 'Pecho', 'Pierna', 'Costillas', 'Otra'],
  size: ['Pequeño', 'Mediano', 'Grande'],
  design: ['Sí', 'No', 'Tengo una idea'],
} as const

/** Pasos del Tattoo Finder: etiqueta en pantalla → valor que se envía en el mensaje. */
export const finderSteps = [
  {
    key: 'style',
    question: '¿Qué estás buscando?',
    options: [
      { label: 'Black & Grey', value: 'Black & Grey' },
      { label: 'Geometric', value: 'Geometría' },
      { label: 'Dotwork', value: 'Puntillismo' },
      { label: 'Custom design', value: 'Diseño personalizado' },
    ],
  },
  {
    key: 'zone',
    question: '¿Dónde?',
    options: [
      { label: 'Arm', value: 'Brazo' },
      { label: 'Leg', value: 'Pierna' },
      { label: 'Back', value: 'Espalda' },
      { label: 'Chest', value: 'Pecho' },
      { label: 'Shoulder', value: 'Hombro' },
      { label: 'Other', value: 'Otra' },
    ],
  },
  {
    key: 'size',
    question: '¿Qué tamaño?',
    options: [
      { label: 'Small', value: 'Pequeño' },
      { label: 'Medium', value: 'Mediano' },
      { label: 'Large', value: 'Grande' },
    ],
  },
] as const

export type FinderKey = (typeof finderSteps)[number]['key']
export type FinderSelection = Partial<Record<FinderKey, string>>
