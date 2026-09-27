import { AnimatePresence, motion, useInView, useScroll } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { processSteps, type ProcessStep } from '../data/content'
import { Mandala } from './Mandala'
import { Lines, SectionLabel } from './ui'

const EASE = [0.16, 1, 0.3, 1] as const

function Step({
  step,
  index,
  active,
  onActive,
}: {
  step: ProcessStep
  index: number
  active: boolean
  onActive: (i: number) => void
}) {
  const ref = useRef<HTMLLIElement>(null)
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })

  useEffect(() => {
    if (inView) onActive(index)
  }, [inView, index, onActive])

  return (
    <li ref={ref} className="relative flex min-h-[62svh] flex-col justify-center py-14 pl-10 md:min-h-[80svh] md:pl-16">
      <span
        aria-hidden="true"
        className={`absolute top-1/2 left-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border transition-colors duration-700 ${
          active ? 'border-bone bg-bone' : 'border-iron bg-ink'
        }`}
      />
      <Mandala stage={index} className="mb-8 aspect-square w-[58vw] max-w-xs text-bone/70 md:hidden" />
      <p className="label text-smoke">
        Paso {step.index} — {step.note}
      </p>
      <h3
        className={`display mt-4 text-[17vw] transition-opacity duration-700 md:text-[6vw] xl:text-[6.5rem] ${
          active ? 'opacity-100' : 'md:opacity-25'
        }`}
      >
        {step.title}
      </h3>
      <p className="mt-6 max-w-md text-[1.02rem] leading-relaxed text-bone/85">{step.text}</p>
    </li>
  )
}

export function Process() {
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 0.5', 'end 0.5'] })
  const step = processSteps[active]

  return (
    <section id="process" aria-labelledby="process-title" className="relative bg-ink pt-28 md:pt-40">
      <div className="shell">
        <SectionLabel index="04">The process</SectionLabel>
        <h2 id="process-title" className="display mt-8 text-[17vw] md:text-[10vw] xl:text-[10rem]">
          <Lines
            lines={[
              'From idea',
              <span key="b" className="block text-right">
                <span className="serif mr-[0.2em] text-[0.62em] text-smoke">to</span>skin.
              </span>,
            ]}
          />
        </h2>
      </div>

      <div className="shell md:grid md:grid-cols-12 md:gap-10">
        <div className="hidden md:col-span-6 md:block">
          <div className="sticky top-0 flex h-svh flex-col justify-center py-20">
            <div className="relative">
              <Mandala stage={active} className="aspect-square w-full max-w-[min(100%,62svh)] text-bone/80" />
              <div className="absolute -bottom-4 left-0 overflow-hidden" aria-hidden="true">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={step.index}
                    className="display block text-[9vw] text-transparent [-webkit-text-stroke:1px_var(--color-bone)] xl:text-[9rem]"
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '-100%' }}
                    transition={{ duration: 0.8, ease: EASE }}
                  >
                    {step.index}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
            <p className="label mt-10 text-smoke" aria-live="polite">
              {step.index} / 0{processSteps.length} · {step.note}
            </p>
          </div>
        </div>

        <div className="relative md:col-span-5 md:col-start-8">
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-line" />
          <motion.span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-px origin-top bg-bone"
            style={{ scaleY: scrollYProgress }}
          />
          <ol ref={listRef}>
            {processSteps.map((s, i) => (
              <Step key={s.index} step={s} index={i} active={active === i} onActive={setActive} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
