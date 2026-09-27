import { AnimatePresence, motion, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { tattooStyles, type TattooStyle } from '../data/tattooStyles'
import { ArtImage } from './ArtImage'
import { Lines, SectionLabel } from './ui'

const EASE = [0.16, 1, 0.3, 1] as const

function StyleVisual({ active }: { active: number }) {
  const style = tattooStyles[active]
  return (
    <figure className="relative w-full max-w-[calc((100svh-12rem)*0.8)]">
      <div className="relative aspect-[4/5] w-full overflow-hidden border border-line">
        <AnimatePresence initial={false}>
          <motion.div
            key={style.key}
            className="absolute inset-0"
            initial={{ clipPath: 'inset(100% 0 0 0)', scale: 1.08 }}
            animate={{ clipPath: 'inset(0% 0 0 0)', scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6, delay: 0.5 } }}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <ArtImage
              src={style.image.src}
              style={style.key}
              seed={101 + active * 7}
              width={style.image.width}
              height={style.image.height}
              alt={`Tatuaje de ${style.local} de Salva Leiva`}
              className="h-full w-full"
            />
          </motion.div>
        </AnimatePresence>

        {/* Líneas de construcción que se trazan al cambiar de estilo */}
        <svg key={`g-${style.key}`} viewBox="0 0 100 125" className="pointer-events-none absolute inset-0 h-full w-full text-bone/30 mix-blend-difference" aria-hidden="true" data-ink="">
          <motion.circle cx="50" cy="62.5" r="41" fill="none" stroke="currentColor" strokeWidth="1"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: EASE }} />
          <motion.line x1="50" y1="0" x2="50" y2="125" stroke="currentColor" strokeWidth="1"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.2 }} />
          <motion.line x1="0" y1="62.5" x2="100" y2="62.5" stroke="currentColor" strokeWidth="1"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.3 }} />
        </svg>
      </div>
      <figcaption className="label mt-4 flex justify-between text-smoke">
        <span>
          {style.index} / 0{tattooStyles.length}
        </span>
        <span>{style.local}</span>
      </figcaption>
    </figure>
  )
}

function StyleBlock({
  style,
  index,
  active,
  onActive,
}: {
  style: TattooStyle
  index: number
  active: boolean
  onActive: (index: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })

  useEffect(() => {
    if (inView) onActive(index)
  }, [inView, index, onActive])

  return (
    <article
      ref={ref}
      className={`flex min-h-[80svh] flex-col justify-center py-16 transition-opacity duration-700 md:min-h-svh ${
        active ? 'opacity-100' : 'md:opacity-25'
      }`}
    >
      <ArtImage
        style={style.key}
        src={style.image.src}
        seed={101 + index * 7}
        width={style.image.width}
        height={style.image.height}
        alt={`Tatuaje de ${style.local} de Salva Leiva`}
        className="mb-10 border border-line md:hidden"
      />
      <p className="label text-smoke">{style.index}</p>
      <h3 className="display mt-3 text-[19vw] md:text-[6.4vw] xl:text-[7.5rem]">
        <Lines lines={[style.title]} from="right" />
      </h3>
      <p className="serif mt-3 text-2xl text-smoke md:text-3xl">{style.local}</p>
      <p className="mt-8 max-w-md text-[1.02rem] leading-relaxed text-bone/85">{style.text}</p>
      <p className="label mt-8 flex items-center gap-4 text-smoke">
        <span aria-hidden="true" className="h-px w-10 bg-iron" />
        {style.detail}
      </p>
    </article>
  )
}

export function StyleSection() {
  const [active, setActive] = useState(0)

  return (
    <section id="style" aria-labelledby="style-title" className="relative bg-ink/80 pt-28 md:pt-40">
      <div className="shell">
        <SectionLabel index="02">The style</SectionLabel>
        <h2 id="style-title" className="display mt-8 text-[17vw] md:text-[10vw] xl:text-[10rem]">
          <Lines
            lines={[
              'One ink.',
              <span key="b" className="serif block pl-[12vw] text-[0.62em] text-smoke md:pl-[22vw]">
                three languages
              </span>,
            ]}
          />
        </h2>
      </div>

      <div className="shell md:grid md:grid-cols-12 md:gap-10">
        <div className="hidden md:col-span-6 md:block">
          <div className="sticky top-0 flex h-svh items-center py-20">
            <StyleVisual active={active} />
          </div>
        </div>
        <div className="md:col-span-5 md:col-start-8">
          {tattooStyles.map((s, i) => (
            <StyleBlock key={s.key} style={s} active={active === i} index={i} onActive={setActive} />
          ))}
        </div>
      </div>
    </section>
  )
}
