import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Mandala } from './Mandala'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Atmósfera fija de toda la web: reglas de columna tipo cuaderno de bocetos
 * y la mandala de identidad, que acompaña el recorrido girando con el scroll.
 */
export function Backdrop() {
  const reduce = useReducedMotion()
  const { scrollY, scrollYProgress } = useScroll()

  const heroProgress = (v: number) => Math.min(v / window.innerHeight, 1)
  const outer = useTransform(scrollYProgress, [0, 1], [0, 110])
  const middle = useTransform(scrollYProgress, [0, 1], [0, -150])
  const inner = useTransform(scrollYProgress, [0, 1], [0, 220])
  const scale = useTransform(scrollY, (v) => 1 + heroProgress(v) * 0.4)
  const opacity = useTransform(scrollY, (v) => 0.34 - heroProgress(v) * 0.26)
  const x = useTransform(scrollY, (v) => `${heroProgress(v) * 24}%`)

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="shell h-full">
        <div className="grid h-full grid-cols-4 border-x border-bone/[0.045] md:grid-cols-6">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className={`border-bone/[0.045] ${i > 0 ? 'border-l' : ''} ${i > 3 ? 'hidden md:block' : ''}`} />
          ))}
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9, rotate: -24 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 2.8, ease: EASE, delay: 0.2 }}
        >
          <motion.div style={reduce ? { opacity: 0.2 } : { x, scale, opacity }}>
            <Mandala
              className="aspect-square w-[138vw] text-bone md:w-auto md:h-[122vh]"
              rotateOuter={reduce ? undefined : outer}
              rotateMiddle={reduce ? undefined : middle}
              rotateInner={reduce ? undefined : inner}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
