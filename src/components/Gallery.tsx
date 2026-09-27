import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { gallery, type GalleryItem } from '../data/gallery'
import { styleName } from '../data/tattooStyles'
import { getLenis } from '../utils/scroll'
import { ArtImage } from './ArtImage'
import { Lines, SectionLabel } from './ui'

const EASE = [0.16, 1, 0.3, 1] as const

function Piece({ item, index, onOpen }: { item: GalleryItem; index: number; onOpen: (i: number) => void }) {
  const ref = useRef<HTMLLIElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // Parallax muy leve y distinto por pieza: la composición "respira" al hacer scroll.
  const drift = [36, -24, 52, -30, 20, 44, -40, 28, -18][index % 9]
  const y = useTransform(scrollYProgress, [0, 1], [drift, -drift])

  return (
    <motion.li ref={ref} className={`relative ${item.layout}`} style={reduce ? undefined : { y }}>
      <motion.button
        type="button"
        onClick={() => onOpen(index)}
        className="group block w-full text-left"
        aria-label={`Ver pieza ${item.id}: ${item.title}, ${styleName[item.style]}${item.zone ? `, ${item.zone}` : ''}`}
        initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)' }}
        whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
        viewport={{ once: true, margin: '-8% 0px' }}
        transition={{ duration: 1.3, ease: EASE }}
      >
        <div className="overflow-hidden">
          <ArtImage
            src={item.src}
            alt={item.alt}
            style={item.style}
            seed={item.seed}
            width={item.width}
            height={item.height}
            imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
          />
        </div>
        <div className="label mt-3 flex items-baseline justify-between gap-3 text-smoke">
          <span className="text-bone">{item.id}</span>
          <span className="relative flex-1 overflow-hidden">
            <span className="block truncate transition-transform duration-700 ease-[var(--ease-ink)] md:translate-y-full md:group-hover:translate-y-0 md:group-focus-visible:translate-y-0">
              {item.title}
              {item.zone && ` — ${item.zone}`}
            </span>
          </span>
          <span className="hidden sm:inline">{styleName[item.style]}</span>
        </div>
      </motion.button>
    </motion.li>
  )
}

function Lightbox({ index, onClose, onStep }: { index: number; onClose: () => void; onStep: (d: number) => void }) {
  const item = gallery[index]
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    getLenis()?.stop()
    document.documentElement.style.overflow = 'hidden'
    return () => {
      getLenis()?.start()
      document.documentElement.style.overflow = ''
      previous?.focus()
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
      if (e.key === 'Tab') {
        // Mantiene el foco dentro del diálogo
        const nodes = document.querySelectorAll<HTMLElement>('[data-lightbox] button')
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onStep])

  return (
    <motion.div
      data-lightbox=""
      role="dialog"
      aria-modal="true"
      aria-label={`Pieza ${item.id}: ${item.title}`}
      className="fixed inset-0 z-[70] flex flex-col bg-ink"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className="shell label flex h-16 shrink-0 items-center justify-between text-smoke">
        <span>
          <span className="text-bone">{item.id}</span> / {String(gallery.length).padStart(2, '0')}
        </span>
        <button ref={closeRef} type="button" onClick={onClose} className="ink-link p-2 text-bone">
          Cerrar
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-5 md:px-24" onClick={onClose}>
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            className="flex h-full max-h-full w-full items-center justify-center"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-h-full"
              style={{ width: `min(100%, calc((100svh - 11rem) * ${item.width / item.height}))` }}
            >
              <ArtImage
                src={item.src}
                alt={item.alt}
                style={item.style}
                seed={item.seed}
                width={item.width}
                height={item.height}
                eager
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="shell label flex h-24 shrink-0 items-center justify-between gap-4 text-smoke">
        <button type="button" onClick={() => onStep(-1)} className="ink-btn min-h-11 px-4" aria-label="Pieza anterior">
          Prev
        </button>
        <p className="text-center">
          <span className="text-bone">{item.title}</span>
          <br />
          {styleName[item.style]}
          {item.zone && ` · ${item.zone}`}
        </p>
        <button type="button" onClick={() => onStep(1)} className="ink-btn min-h-11 px-4" aria-label="Pieza siguiente">
          Next
        </button>
      </div>
    </motion.div>
  )
}

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null)
  const close = useCallback(() => setOpen(null), [])
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + gallery.length) % gallery.length)),
    [],
  )

  return (
    <section id="work" aria-labelledby="work-title" className="relative bg-ink/80 py-28 md:py-40">
      <div className="shell grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <SectionLabel index="03">Selected work</SectionLabel>
          <h2 id="work-title" className="display mt-8 text-[20vw] md:text-[12vw] xl:text-[12rem]">
            <Lines lines={['The', 'work']} from="left" />
          </h2>
        </div>
        <p className="max-w-sm text-[0.95rem] leading-relaxed text-smoke md:col-span-4 md:col-start-9 md:pb-4">
          Una selección de piezas recientes. Cada una empezó como una conversación y un boceto en papel.
          <span className="mt-3 block text-bone">Toca cualquier pieza para verla completa.</span>
        </p>
      </div>

      <ul className="shell mt-20 grid grid-cols-6 items-start gap-x-4 gap-y-14 md:mt-28 md:grid-cols-12 md:gap-x-8 md:gap-y-24">
        {gallery.map((item, i) => (
          <Piece key={item.id} item={item} index={i} onOpen={setOpen} />
        ))}
      </ul>

      <AnimatePresence>{open !== null && <Lightbox index={open} onClose={close} onStep={step} />}</AnimatePresence>
    </section>
  )
}
