import { useId, useMemo, useState, type ReactElement } from 'react'
import type { StyleKey } from '../data/tattooStyles'
import { seeded } from '../utils/random'

const TAU = Math.PI * 2
const INK = '#dedad2'
const PAPER = '#141412'
const r1 = (n: number) => Math.round(n * 10) / 10

type ArtProps = {
  style: StyleKey
  seed: number
  width: number
  height: number
}

/* ---------- Ilustraciones placeholder (se sustituyen por fotos reales) ---------- */

function dotwork({ seed, width, height }: ArtProps): ReactElement[] {
  const rand = seeded(seed)
  const W = 1000
  const H = (W * height) / width
  const cx = W / 2
  const base = Math.min(W, H) * 0.34
  const tall = H > W * 1.3
  const spheres = tall
    ? [
        { y: H * 0.27, r: base * 0.55 },
        { y: H * 0.52, r: base * 0.85 },
        { y: H * 0.77, r: base * 0.5 },
      ]
    : [{ y: H / 2, r: base }]

  const [lx, ly, lz] = [-0.55, -0.6, 0.58]
  const out: ReactElement[] = []

  spheres.forEach((s, si) => {
    const count = Math.round(3400 * (s.r / base) ** 2)
    for (let i = 0; i < count; i++) {
      const ang = rand() * TAU
      const rr = s.r * Math.sqrt(rand())
      const x = cx + rr * Math.cos(ang)
      const y = s.y + rr * Math.sin(ang)
      const nx = (x - cx) / s.r
      const ny = (y - s.y) / s.r
      const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny))
      const lum = Math.max(0, nx * lx + ny * ly + nz * lz)
      if (rand() > (1 - lum) ** 1.6 * 0.95 + 0.03) continue
      out.push(<circle key={`s${si}-${i}`} cx={r1(x)} cy={r1(y)} r={r1(1.1 + rand() * 1.5)} />)
    }
    const ringCount = Math.round(60 * (s.r / base))
    for (let i = 0; i < ringCount; i++) {
      const a = (i / ringCount) * TAU
      const rr = s.r * 1.22
      out.push(
        <circle key={`r${si}-${i}`} cx={r1(cx + rr * Math.cos(a))} cy={r1(s.y + rr * Math.sin(a))} r={i % 3 ? 1.6 : 3.2} />,
      )
    }
  })

  if (seed % 3 === 1 && !tall) {
    // Rayos punteados (sol)
    const s = spheres[0]
    for (let k = 0; k < 24; k++) {
      const a = (k / 24) * TAU
      for (let j = 0; j < 9; j++) {
        const rr = s.r * (1.34 + j * 0.06)
        out.push(
          <circle key={`ray${k}-${j}`} cx={r1(cx + rr * Math.cos(a))} cy={r1(s.y + rr * Math.sin(a))} r={r1(2.6 - j * 0.22)} />,
        )
      }
    }
  }
  return out
}

function geometry({ seed, width, height }: ArtProps): ReactElement[] {
  const W = 1000
  const H = (W * height) / width
  const cx = W / 2
  const cy = H / 2
  const R = Math.min(W, H) * 0.36
  const sides = [6, 8, 12][seed % 3]
  const out: ReactElement[] = []

  const poly = (r: number, n: number, rot: number) =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * TAU + rot - Math.PI / 2
      return `${r1(cx + r * Math.cos(a))},${r1(cy + r * Math.sin(a))}`
    }).join(' ')

  out.push(<circle key="c0" cx={cx} cy={cy} r={r1(R * 1.08)} />)
  out.push(<circle key="c1" cx={cx} cy={cy} r={r1(R * 1.02)} strokeDasharray="1 7" />)
  for (let k = 0; k < 7; k++) {
    out.push(<polygon key={`p${k}`} points={poly(R * (1 - k * 0.12), sides, (k * Math.PI) / sides / 2)} />)
  }
  if (seed % 2 === 0) {
    // Flor de la vida
    const fr = R / 3
    out.push(<circle key="f0" cx={cx} cy={cy} r={r1(fr)} />)
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * TAU
      out.push(<circle key={`f${k + 1}`} cx={r1(cx + fr * Math.cos(a))} cy={r1(cy + fr * Math.sin(a))} r={r1(fr)} />)
    }
  }
  for (let k = 0; k < sides * 2; k++) {
    const a = (k / (sides * 2)) * TAU
    out.push(
      <line key={`l${k}`} x1={cx} y1={cy} x2={r1(cx + R * 1.08 * Math.cos(a))} y2={r1(cy + R * 1.08 * Math.sin(a))} strokeOpacity={0.35} />,
    )
  }
  if (H > W * 1.2) {
    out.push(<line key="ax" x1={cx} y1={H * 0.06} x2={cx} y2={H * 0.94} />)
    ;[-1, 1].forEach((d) => {
      const y = cy + d * (R * 1.08 + (H / 2 - R * 1.08) * 0.55)
      out.push(<polygon key={`tri${d}`} points={`${cx},${r1(y - d * 34)} ${cx - 28},${r1(y + d * 18)} ${cx + 28},${r1(y + d * 18)}`} />)
      out.push(<circle key={`dt${d}`} cx={cx} cy={r1(y + d * 60)} r={4} fill={INK} />)
    })
  }
  if (W > H * 1.2) {
    out.push(<line key="ah" x1={W * 0.06} y1={cy} x2={W * 0.94} y2={cy} />)
    ;[-1, 1].forEach((d) => {
      const x = cx + d * R * 1.6
      out.push(<circle key={`sc${d}`} cx={r1(x)} cy={cy} r={r1(R * 0.36)} />)
      const t = R * 0.3
      out.push(
        <polygon
          key={`sp${d}`}
          points={`${r1(x)},${r1(cy - t)} ${r1(x + t * 0.87)},${r1(cy + t / 2)} ${r1(x - t * 0.87)},${r1(cy + t / 2)}`}
        />,
      )
      out.push(<circle key={`sd${d}`} cx={r1(x)} cy={cy} r={5} fill={INK} />)
    })
  }
  return out
}

function blackgrey({ seed, width, height }: ArtProps, filterId: string): ReactElement[] {
  const rand = seeded(seed)
  const W = 1000
  const H = (W * height) / width
  const out: ReactElement[] = []
  const greys = ['#2a2926', '#3c3a36', '#57544e', '#7d7970', '#a8a399']

  for (let i = 0; i < 9; i++) {
    const x0 = W * (0.15 + rand() * 0.2)
    const y0 = H * (0.2 + rand() * 0.6)
    const x1 = W * (0.35 + rand() * 0.3)
    const y1 = H * (0.1 + rand() * 0.8)
    const x2 = W * (0.65 + rand() * 0.2)
    const y2 = H * (0.2 + rand() * 0.6)
    out.push(
      <path
        key={`b${i}`}
        d={`M${r1(x0)} ${r1(y0)} Q${r1(x1)} ${r1(y1)} ${r1(x2)} ${r1(y2)}`}
        stroke={greys[i % greys.length]}
        strokeWidth={r1(50 + rand() * 110)}
        strokeLinecap="round"
        fill="none"
        filter={`url(#${filterId}-soft)`}
      />,
    )
  }
  for (let i = 0; i < 5; i++) {
    const x0 = W * (0.2 + rand() * 0.2)
    const y0 = H * (0.25 + rand() * 0.5)
    const x2 = W * (0.6 + rand() * 0.2)
    const y2 = H * (0.25 + rand() * 0.5)
    out.push(
      <path
        key={`h${i}`}
        d={`M${r1(x0)} ${r1(y0)} Q${r1(W / 2)} ${r1(H * rand())} ${r1(x2)} ${r1(y2)}`}
        stroke={i % 2 ? '#0d0d0c' : '#cfcac0'}
        strokeWidth={r1(6 + rand() * 18)}
        strokeLinecap="round"
        fill="none"
        filter={`url(#${filterId}-mid)`}
      />,
    )
  }
  return out
}

/* ---------- Componente ---------- */

type ArtImageProps = {
  src?: string
  alt: string
  style: StyleKey
  seed: number
  width: number
  height: number
  className?: string
  imgClassName?: string
  eager?: boolean
  showTag?: boolean
}

/** Foto del portfolio con proporción real. Si no hay foto, dibuja un placeholder identificable. */
export function ArtImage({
  src,
  alt,
  style,
  seed,
  width,
  height,
  className = '',
  imgClassName = '',
  eager = false,
  showTag = true,
}: ArtImageProps) {
  const [failed, setFailed] = useState(false)
  const rawId = useId()
  const filterId = `f${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`
  const showPhoto = Boolean(src) && !failed

  const art = useMemo(() => {
    if (showPhoto) return null
    const props = { style, seed, width, height }
    if (style === 'dotwork') return dotwork(props)
    if (style === 'geometry') return geometry(props)
    return blackgrey(props, filterId)
  }, [showPhoto, style, seed, width, height, filterId])

  const H = (1000 * height) / width

  return (
    <div className={`relative overflow-hidden bg-coal ${className}`} style={{ aspectRatio: `${width} / ${height}` }}>
      {showPhoto ? (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      ) : (
        <>
          <svg
            viewBox={`0 0 1000 ${r1(H)}`}
            preserveAspectRatio="xMidYMid slice"
            role="img"
            aria-label={alt}
            data-ink=""
            className={`h-full w-full ${imgClassName}`}
          >
            <defs>
              <filter id={`${filterId}-soft`} filterUnits="userSpaceOnUse" x="0" y="0" width="1000" height={r1(H)}>
                <feGaussianBlur stdDeviation="34" />
              </filter>
              <filter id={`${filterId}-mid`} filterUnits="userSpaceOnUse" x="0" y="0" width="1000" height={r1(H)}>
                <feGaussianBlur stdDeviation="7" />
              </filter>
            </defs>
            <rect width="1000" height={r1(H)} fill={PAPER} />
            <g
              fill={style === 'geometry' ? 'none' : INK}
              stroke={style === 'geometry' ? INK : 'none'}
              strokeWidth={1}
            >
              {art}
            </g>
          </svg>
          {showTag && (
            <span aria-hidden="true" className="label pointer-events-none absolute bottom-2 left-2 text-[9px] text-smoke/70">
              Placeholder
            </span>
          )}
        </>
      )}
    </div>
  )
}
