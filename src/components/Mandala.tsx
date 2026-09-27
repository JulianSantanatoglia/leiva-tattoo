import { motion, type MotionValue } from 'motion/react'
import type { ReactElement } from 'react'

type Ring = 'outer' | 'middle' | 'inner'
type Kind = 'guide' | 'line' | 'dots' | 'petal'

const TAU = Math.PI * 2
const r2 = (n: number) => Math.round(n * 100) / 100
const pt = (r: number, a: number) => [r2(r * Math.cos(a - Math.PI / 2)), r2(r * Math.sin(a - Math.PI / 2))]

function dotRing(key: string, r: number, count: number, size: number, offset = 0, alt?: number) {
  return Array.from({ length: count }, (_, i) => {
    const [x, y] = pt(r, (i / count) * TAU + offset)
    const s = alt && i % 2 ? alt : size
    return <circle key={`${key}${i}`} cx={x} cy={y} r={s} />
  })
}

function petals(key: string, from: number, to: number, count: number, width: number, offset = 0) {
  const mid = (from + to) / 2
  const d = `M0 ${-from} Q${width} ${-mid} 0 ${-to} Q${-width} ${-mid} 0 ${-from}Z`
  return Array.from({ length: count }, (_, i) => (
    <path key={`${key}${i}`} d={d} transform={`rotate(${r2((i / count) * 360 + offset)})`} />
  ))
}

function polygon(r: number, sides: number, step = 1, offset = 0) {
  const pts: string[] = []
  for (let i = 0; i < sides; i++) pts.push(pt(r, ((i * step) / sides) * TAU + offset).join(','))
  return pts.join(' ')
}

function radials(key: string, from: number, to: number, count: number, offset = 0) {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * TAU + offset
    const [x1, y1] = pt(from, a)
    const [x2, y2] = pt(to, a)
    return <line key={`${key}${i}`} x1={x1} y1={y1} x2={x2} y2={y2} />
  })
}

const layers: Record<Ring, Partial<Record<Kind, ReactElement[]>>> = {
  outer: {
    guide: [
      <circle key="g1" r={488} strokeDasharray="2 8" />,
      <line key="g2" x1={-500} y1={0} x2={500} y2={0} strokeDasharray="2 8" />,
      <line key="g3" x1={0} y1={-500} x2={0} y2={500} strokeDasharray="2 8" />,
      <line key="g4" x1={-354} y1={-354} x2={354} y2={354} strokeDasharray="2 8" />,
      <line key="g5" x1={-354} y1={354} x2={354} y2={-354} strokeDasharray="2 8" />,
    ],
    line: [
      <circle key="c1" r={478} />,
      <circle key="c2" r={466} />,
      <circle key="c3" r={336} />,
      ...radials('rd', 340, 400, 96),
    ],
    dots: [...dotRing('d1', 452, 144, 2.1), ...dotRing('d2', 410, 48, 3.2, TAU / 96)],
    petal: [...petals('p1', 342, 446, 24, 34), ...petals('p2', 360, 420, 24, 14)],
  },
  middle: {
    guide: [<circle key="g1" r={318} strokeDasharray="2 8" />, <circle key="g2" r={246} strokeDasharray="2 8" />],
    line: [
      <circle key="c1" r={318} />,
      <circle key="c2" r={306} />,
      <polygon key="s1" points={polygon(300, 12, 5)} />,
      <polygon key="s2" points={polygon(300, 12, 1, TAU / 24)} />,
    ],
    dots: [...dotRing('d1', 286, 120, 1.6), ...dotRing('d2', 196, 64, 2.4, 0, 1.2)],
    petal: [...petals('p1', 176, 296, 16, 42, 11.25), ...petals('p2', 196, 272, 16, 20, 11.25)],
  },
  inner: {
    guide: [<circle key="g1" r={170} strokeDasharray="2 8" />, <circle key="g2" r={96} strokeDasharray="2 8" />],
    line: [
      <circle key="c1" r={170} />,
      <polygon key="t1" points={polygon(166, 3)} />,
      <polygon key="t2" points={polygon(166, 3, 1, Math.PI)} />,
      <circle key="c2" r={84} />,
      <circle key="c3" r={20} />,
    ],
    dots: [...dotRing('d1', 128, 48, 1.8), ...dotRing('d2', 150, 24, 2.8, TAU / 48), <circle key="dc" r={5} />],
    petal: [...petals('p1', 26, 80, 8, 22), ...petals('p2', 26, 64, 8, 12, 22.5)],
  },
}

function kindVisible(kind: Kind, stage: number | undefined) {
  if (stage === undefined) return kind !== 'guide'
  if (kind === 'guide') return stage < 3
  if (kind === 'line') return stage >= 1
  if (kind === 'dots') return stage >= 2
  return stage >= 3
}

const kinds: Kind[] = ['guide', 'line', 'dots', 'petal']

type MandalaProps = {
  className?: string
  /** 0 idea (guías) → 1 diseño (líneas) → 2 sesión (puntos) → 3 resultado (completa). */
  stage?: number
  rotateOuter?: MotionValue<number>
  rotateMiddle?: MotionValue<number>
  rotateInner?: MotionValue<number>
}

export function Mandala({ className, stage, rotateOuter, rotateMiddle, rotateInner }: MandalaProps) {
  const rotations: Record<Ring, MotionValue<number> | undefined> = {
    outer: rotateOuter,
    middle: rotateMiddle,
    inner: rotateInner,
  }

  return (
    <svg viewBox="-500 -500 1000 1000" className={className} aria-hidden="true" focusable="false" data-ink="">
      {(Object.keys(layers) as Ring[]).map((ring) => (
        <motion.g key={ring} style={{ rotate: rotations[ring] }}>
          {kinds.map((kind) => {
            const els = layers[ring][kind]
            if (!els) return null
            const isFill = kind === 'dots'
            return (
              <g
                key={kind}
                fill={isFill ? 'currentColor' : 'none'}
                stroke={isFill ? 'none' : 'currentColor'}
                strokeWidth={1}
                opacity={kindVisible(kind, stage) ? (kind === 'guide' ? 0.55 : 1) : 0}
                style={{ transition: 'opacity 900ms cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                {els}
              </g>
            )
          })}
        </motion.g>
      ))}
    </svg>
  )
}
