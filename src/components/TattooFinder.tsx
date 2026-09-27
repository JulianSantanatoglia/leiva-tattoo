import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { finderSteps, type FinderSelection } from '../data/content'
import { buildConsultationMessage, whatsappUrl } from '../utils/whatsapp'
import { InkButton, InkLink, Lines, SectionLabel } from './ui'

const EASE = [0.16, 1, 0.3, 1] as const

export function TattooFinder({ onRefine }: { onRefine: (selection: FinderSelection) => void }) {
  const [selection, setSelection] = useState<FinderSelection>({})
  const stepIndex = finderSteps.findIndex((s) => !selection[s.key])
  const done = stepIndex === -1
  const current = done ? null : finderSteps[stepIndex]
  const answered = done ? finderSteps.length : stepIndex

  const choose = (value: string) => {
    if (!current) return
    setSelection((s) => ({ ...s, [current.key]: value }))
  }

  const back = () => {
    const last = finderSteps[answered - 1]
    if (!last) return
    setSelection((s) => {
      const next = { ...s }
      delete next[last.key]
      return next
    })
  }

  const message = buildConsultationMessage(selection)

  return (
    <section id="finder" aria-labelledby="finder-title" className="relative border-t border-line bg-ink py-28 md:py-40">
      <div className="shell grid gap-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <SectionLabel index="06">Find your tattoo</SectionLabel>
          <h2 id="finder-title" className="display mt-8 text-[15vw] md:text-[6.5vw] xl:text-[6.5rem]">
            <Lines lines={['Tres', 'preguntas.']} />
          </h2>
          <p className="mt-6 max-w-xs text-[0.95rem] leading-relaxed text-smoke">
            Si aún no lo tienes claro, empieza por aquí. En menos de un minuto tendrás tu idea lista para hablarla.
          </p>

          {/* Progreso */}
          <div className="mt-10 flex gap-1.5" aria-hidden="true">
            {finderSteps.map((s, i) => (
              <span key={s.key} className="relative h-px flex-1 bg-line">
                <motion.span
                  className="absolute inset-0 origin-left bg-bone"
                  initial={false}
                  animate={{ scaleX: i < answered ? 1 : 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                />
              </span>
            ))}
          </div>
          <p className="label mt-4 text-smoke" aria-live="polite">
            {done ? 'Completado' : `Pregunta 0${stepIndex + 1} / 0${finderSteps.length}`}
          </p>
        </div>

        <div className="min-h-[28rem] md:col-span-7 md:col-start-6">
          <AnimatePresence mode="wait" initial={false}>
            {current ? (
              <motion.fieldset
                key={current.key}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <legend className="serif text-4xl text-bone md:text-5xl">{current.question}</legend>
                <ul className="mt-8 border-t border-line">
                  {current.options.map((o, i) => (
                    <li key={o.value}>
                      <button
                        type="button"
                        onClick={() => choose(o.value)}
                        className="group flex w-full items-baseline gap-5 border-b border-line py-4 text-left md:py-5"
                      >
                        <span className="label w-6 text-iron transition-colors group-hover:text-bone">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="display text-[10vw] text-smoke transition-[color,transform] duration-500 ease-[var(--ease-out-soft)] group-hover:translate-x-3 group-hover:text-bone group-focus-visible:text-bone md:text-[3.6vw] xl:text-[3.75rem]">
                          {o.label}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                {answered > 0 && (
                  <button type="button" onClick={back} className="label ink-link mt-8 text-smoke">
                    ← Volver
                  </button>
                )}
              </motion.fieldset>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <p className="display text-[14vw] md:text-[6vw] xl:text-[6rem]">
                  Your idea
                  <br />
                  is ready.
                </p>
                <p className="serif mt-4 text-3xl text-smoke md:text-4xl">Let&rsquo;s talk about it.</p>

                <dl className="mt-10 grid grid-cols-3 border-y border-line">
                  {finderSteps.map((s) => (
                    <div key={s.key} className="border-line py-5 not-first:border-l not-first:pl-4">
                      <dt className="label text-smoke">{{ style: 'Estilo', zone: 'Zona', size: 'Tamaño' }[s.key]}</dt>
                      <dd className="mt-2 text-lg text-bone">{selection[s.key]}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-10 flex flex-wrap gap-3">
                  <InkLink href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" variant="solid">
                    Consult on WhatsApp
                  </InkLink>
                  <InkButton onClick={() => onRefine(selection)}>Añadir detalles</InkButton>
                </div>
                <button type="button" onClick={() => setSelection({})} className="label ink-link mt-8 text-smoke">
                  Empezar de nuevo
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
