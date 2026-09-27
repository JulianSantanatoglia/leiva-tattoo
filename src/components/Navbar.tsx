import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { instagramUrl, tattooArtist } from '../config/artist'
import { getLenis, scrollToId } from '../utils/scroll'
import { whatsappUrl } from '../utils/whatsapp'

const EASE = [0.16, 1, 0.3, 1] as const

const links = [
  { id: 'work', label: 'Work' },
  { id: 'style', label: 'Style' },
  { id: 'process', label: 'Process' },
  { id: 'contact', label: 'Contact' },
]

export function Navbar() {
  const { scrollY, scrollYProgress } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 48))

  useEffect(() => {
    const lenis = getLenis()
    if (!open) {
      lenis?.start()
      return
    }
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    firstLinkRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setOpen(false)
    getLenis()?.start()
    requestAnimationFrame(() => scrollToId(id))
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`border-b transition-colors duration-500 ${
          scrolled || open ? 'border-line bg-ink' : 'border-transparent bg-transparent'
        }`}
      >
        <nav aria-label="Principal" className="shell flex h-16 items-center justify-between">
          <a href="#top" onClick={go('top')} className="group flex items-baseline gap-3">
            <span className="display text-[1.35rem] leading-none tracking-normal">{tattooArtist.name}</span>
            <span className="label hidden text-smoke sm:inline">Tattoo</span>
          </a>

          <ul className="label hidden items-center gap-10 md:flex">
            {links.map((l, i) => (
              <li key={l.id}>
                <a href={`#${l.id}`} onClick={go(l.id)} className="ink-link text-bone">
                  <span className="mr-2 text-iron">0{i + 1}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            ref={toggleRef}
            type="button"
            className="label -mr-2 p-2 text-bone md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? 'Cerrar' : 'Menú'}
          </button>
        </nav>

        <motion.div
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-px w-full origin-left bg-bone"
          style={{ scaleX: scrollYProgress }}
        />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-0 top-16 bottom-0 flex flex-col justify-between bg-ink px-5 pt-10 pb-8 md:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <ul className="space-y-2">
              {links.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.15 + i * 0.06 }}
                >
                  <a
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={`#${l.id}`}
                    onClick={go(l.id)}
                    className="flex items-baseline gap-4 py-1"
                  >
                    <span className="label text-iron">0{i + 1}</span>
                    <span className="display text-[17vw]">{l.label}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="label flex justify-between border-t border-line pt-6 text-smoke">
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-bone">
                @{tattooArtist.instagram}
              </a>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="text-bone">
                WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
