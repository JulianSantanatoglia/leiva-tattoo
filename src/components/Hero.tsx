import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef, type MouseEvent } from 'react'
import { tattooArtist } from '../config/artist'
import { scrollToId } from '../utils/scroll'
import { InkLink, Lines } from './ui'

const EASE = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const toConsult = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scrollToId('finder')
  }

  const fadeIn = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.2, ease: EASE, delay },
  })

  return (
    <section id="top" ref={ref} className="relative flex min-h-svh flex-col justify-between pt-24 pb-6 md:pb-8">
      <motion.div {...fadeIn(0.9)} className="shell label flex justify-between text-smoke">
        <p>
          {tattooArtist.role}
          <br />
          Almería / Spain
        </p>
        <p className="text-right">
          Dotwork
          <br />
          Geometry
          <br />
          Black &amp; Grey
        </p>
      </motion.div>

      <motion.div style={reduce ? undefined : { y: nameY, opacity: fade }} className="shell">
        <h1 className="display text-[33vw] leading-[0.8] md:text-[21vw] xl:text-[19.5rem]">
          <Lines
            animateOnMount
            delay={0.25}
            lines={[
              <span key="a">{tattooArtist.firstName}</span>,
              <span key="b" className="block text-right">
                <span className="serif mr-[0.08em] align-top text-[0.16em] leading-none text-smoke normal-case">
                  tattoo artist
                </span>
                {tattooArtist.lastName}
              </span>,
            ]}
          />
          <span className="sr-only">, tatuador en Almería</span>
        </h1>
      </motion.div>

      <motion.div
        {...fadeIn(1.2)}
        className="shell grid grid-cols-1 items-end gap-8 md:grid-cols-12"
      >
        <p className="max-w-sm text-[0.95rem] leading-relaxed text-smoke md:col-span-5">
          Tatuajes a medida en puntillismo, geometría y black &amp; grey.{' '}
          <span className="text-bone">Cada pieza se dibuja para una sola piel.</span>
        </p>
        <div className="flex items-end justify-between gap-6 md:col-span-7 md:justify-end md:gap-16">
          <InkLink href="#finder" onClick={toConsult} variant="solid">
            Start your idea
          </InkLink>
          <div className="label flex flex-col items-center gap-3 text-smoke" aria-hidden="true">
            <span>Scroll</span>
            <span className="relative h-12 w-px overflow-hidden bg-line">
              <span className="scroll-cue absolute inset-0 bg-bone" />
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
