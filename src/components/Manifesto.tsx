import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef, type MouseEvent } from 'react'
import { tattooStyles } from '../data/tattooStyles'
import { scrollToId } from '../utils/scroll'
import { InkLink, Lines, Reveal, SectionLabel } from './ui'

// Las palabras entre *asteriscos* se componen en serif itálica.
const MANIFESTO =
  'Cada punto se coloca *a mano.* Cada línea se mide antes de tocar la piel. Sin catálogos ni atajos: cada pieza se dibuja para *una persona,* una zona y una historia concretas.'

type Token = { text: string; italic: boolean }

const TOKENS: Token[] = (() => {
  let italic = false
  return MANIFESTO.split(' ').map((raw) => {
    if (raw.startsWith('*')) italic = true
    const token = { text: raw.replace(/\*/g, ''), italic }
    if (raw.endsWith('*')) italic = false
    return token
  })
})()

function Word({ token, progress, range }: { token: Token; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1])
  return (
    <motion.span style={{ opacity }} className={token.italic ? 'serif' : undefined}>
      {token.text}{' '}
    </motion.span>
  )
}

/** Escena 02: el nombre se desvanece, aparecen los estilos y la declaración. */
export function StylesBand() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const left = useTransform(scrollYProgress, [0, 1], ['4%', '-30%'])
  const right = useTransform(scrollYProgress, [0, 1], ['-30%', '4%'])
  const row = tattooStyles.map((s) => s.title)

  return (
    <div ref={ref} className="relative overflow-hidden border-y border-line bg-ink py-6 md:py-10">
      <p className="sr-only">Especialidades: puntillismo, geometría y black &amp; grey.</p>
      <div aria-hidden="true" className="display text-[15vw] leading-[0.9] md:text-[9vw]">
        <motion.div style={reduce ? undefined : { x: left }} className="flex gap-[0.35em] whitespace-nowrap">
          {[...row, ...row].map((t, i) => (
            <span key={i} className="flex items-center gap-[0.35em]">
              {t}
              <span className="inline-block size-[0.14em] rotate-45 border border-smoke" />
            </span>
          ))}
        </motion.div>
        <motion.div
          style={reduce ? undefined : { x: right }}
          className="flex gap-[0.35em] whitespace-nowrap text-transparent [-webkit-text-stroke:1px_var(--color-iron)]"
        >
          {[...row, ...row].reverse().map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] })

  return (
    <section aria-labelledby="manifesto-title" className="relative bg-ink/70 py-28 md:py-44">
      <div className="shell grid gap-12 md:grid-cols-12">
        <div className="md:col-span-3">
          <SectionLabel index="01">Manifiesto</SectionLabel>
          <h2 id="manifesto-title" className="sr-only">
            Manifiesto
          </h2>
        </div>

        <p
          ref={ref}
          className="text-[8.4vw] leading-[1.08] font-[450] tracking-[-0.02em] [font-stretch:88%] md:col-span-9 md:text-[4.3vw] xl:text-[3.9rem]"
        >
          {reduce
            ? MANIFESTO.replace(/\*/g, '')
            : TOKENS.map((t, i) => (
                <Word key={i} token={t} progress={scrollYProgress} range={[i / TOKENS.length, (i + 1) / TOKENS.length]} />
              ))}
        </p>

      </div>

      <Artist />
    </section>
  )
}

/** Presentación de Salva: foto en el estudio + texto breve. */
function Artist() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%'])

  const toWork = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scrollToId('work')
  }

  return (
    <div className="shell mt-24 grid gap-12 md:mt-40 md:grid-cols-12 md:items-end md:gap-10">
      <figure ref={ref} className="md:col-span-5 md:col-start-2">
        <motion.div
          className="relative aspect-[4/5] overflow-hidden bg-coal"
          initial={reduce ? false : { clipPath: 'inset(100% 0 0 0)' }}
          whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.img
            src="/images/salva.webp"
            alt="Salva Leiva tatuando a un cliente en su estudio de Almería"
            width={1204}
            height={1600}
            loading="lazy"
            decoding="async"
            style={reduce ? undefined : { y, scale: 1.14 }}
            className="h-full w-full object-cover grayscale contrast-[1.08]"
          />
        </motion.div>
        <figcaption className="label mt-3 flex justify-between text-smoke">
          <span className="text-bone">Salva Leiva</span>
          <span>En el estudio · Almería</span>
        </figcaption>
      </figure>

      <div className="md:col-span-5 md:col-start-8 md:pb-12">
        <p className="label text-smoke">El artista</p>
        <h3 className="display mt-4 text-[20vw] md:text-[7vw] xl:text-[7rem]">
          <Lines lines={['Salva', 'Leiva']} from="right" />
        </h3>
        <p className="serif mt-4 text-2xl text-smoke md:text-3xl">Tatuador en Almería</p>
        <Reveal>
          <p className="mt-8 max-w-md text-[1.02rem] leading-relaxed text-bone/85">
            Salva trabaja la tinta negra en tres lenguajes: puntillismo, geometría y black &amp; grey. Mandalas,
            patrones y sombras construidas con paciencia, pensadas para acompañar la forma del cuerpo.
          </p>
          <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-smoke">
            Trabaja con cita previa y en sesiones sin prisas, porque una pieza bien hecha necesita su tiempo.
          </p>
          <InkLink href="#work" onClick={toWork} className="mt-10">
            See the work
          </InkLink>
        </Reveal>
      </div>
    </div>
  )
}
