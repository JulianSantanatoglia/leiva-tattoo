import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { painZones } from '../data/content'
import { Lines, Reveal, SectionLabel } from './ui'

const EASE = [0.16, 1, 0.3, 1] as const
const pad = (n: number) => String(n).padStart(2, '0')

export function PainScale() {
  const [selected, setSelected] = useState(0)
  const zone = painZones[selected]
  const [min, max] = zone.range

  return (
    <section id="pain" aria-labelledby="pain-title" className="relative border-t border-line bg-ink/85 py-28 md:py-40">
      <div className="shell grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <SectionLabel index="05">Pain scale</SectionLabel>
          <h2 id="pain-title" className="display mt-8 text-[17vw] md:text-[10vw] xl:text-[10rem]">
            <Lines lines={['¿Cuánto', 'duele?']} from="left" />
          </h2>
        </div>
        <p className="max-w-sm text-[0.95rem] leading-relaxed text-smoke md:col-span-4 md:col-start-9 md:pb-4">
          La pregunta que todo el mundo hace. Elige una zona y te cuento qué suele esperarse y cómo prepararte.
        </p>
      </div>

      <div className="shell mt-16 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-10">
        <Reveal className="md:col-span-4">
          <div role="group" aria-label="Zonas del cuerpo" className="grid grid-cols-2 border-t border-line md:grid-cols-1">
            {painZones.map((z, i) => {
              const on = i === selected
              return (
                <button
                  key={z.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSelected(i)}
                  className={`group flex items-center justify-between border-b border-line py-4 text-left transition-colors duration-500 odd:pr-4 even:border-l even:pl-4 md:odd:pr-0 md:even:border-l-0 md:even:pl-0 ${
                    on ? 'text-bone' : 'text-smoke hover:text-bone'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={`size-1.5 rotate-45 transition-colors duration-500 ${on ? 'bg-bone' : 'bg-iron'}`}
                    />
                    <span className="text-lg md:text-xl">{z.name}</span>
                  </span>
                  <span className="label tabular-nums">
                    {pad(z.range[0])}–{pad(z.range[1])}
                  </span>
                </button>
              )
            })}
          </div>
        </Reveal>

        <div className="md:col-span-7 md:col-start-6" aria-live="polite">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="label text-smoke">{zone.name} · nivel orientativo</p>
              {/* Ambos números ocupan la misma celda: el saliente sube y el entrante aparece, siempre recortados. */}
              <div className="mt-2 grid overflow-hidden">
                <AnimatePresence initial={false}>
                  <motion.p
                    key={zone.id}
                    className="display text-[27vw] tabular-nums [grid-area:1/1] md:text-[11vw] xl:text-[11rem]"
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '-100%' }}
                    transition={{ duration: 0.75, ease: EASE }}
                  >
                    {pad(min)}
                    <span className="text-iron">—</span>
                    {pad(max)}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
            <p className="label pb-3 text-smoke">/ 10</p>
          </div>

          {/* Escala 01 ─── 10 */}
          <div className="mt-8" aria-hidden="true">
            <div className="grid grid-cols-10 gap-1.5">
              {Array.from({ length: 10 }, (_, i) => {
                const level = i + 1
                const inRange = level >= min && level <= max
                const below = level < min
                return (
                  <div key={level} className="relative h-14 bg-ash md:h-20">
                    <motion.div
                      className="absolute inset-0 origin-bottom bg-bone"
                      initial={false}
                      animate={{ scaleY: inRange ? 1 : below ? 0.28 : 0, opacity: inRange ? 1 : 0.35 }}
                      transition={{ duration: 0.7, ease: EASE, delay: i * 0.03 }}
                    />
                  </div>
                )
              })}
            </div>
            <div className="label mt-3 flex justify-between text-smoke">
              <span>01 · Llevadero</span>
              <span>10 · Intenso</span>
            </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={zone.id}
              className="mt-12 grid gap-8 sm:grid-cols-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <div className="border-t border-line pt-5">
                <p className="label text-smoke">La zona</p>
                <p className="mt-3 leading-relaxed text-bone/90">{zone.note}</p>
              </div>
              <div className="border-t border-line pt-5">
                <p className="label text-smoke">Para prepararte</p>
                <p className="mt-3 leading-relaxed text-bone/90">{zone.tip}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <p className="serif mt-14 max-w-xl text-xl leading-snug text-smoke md:text-2xl">
            Referencia subjetiva, no información médica. La experiencia del dolor varía según la persona, la zona y la
            duración de la sesión.
          </p>
        </div>
      </div>
    </section>
  )
}
