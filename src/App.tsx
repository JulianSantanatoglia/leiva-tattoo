import { MotionConfig } from 'motion/react'
import { useState } from 'react'
import { Backdrop } from './components/Backdrop'
import { Contact, InstagramSection } from './components/Closing'
import { Gallery } from './components/Gallery'
import { Hero } from './components/Hero'
import { Manifesto, StylesBand } from './components/Manifesto'
import { Navbar } from './components/Navbar'
import { PainScale } from './components/PainScale'
import { Process } from './components/Process'
import { StyleSection } from './components/StyleSection'
import { TattooFinder } from './components/TattooFinder'
import { WhatsAppForm } from './components/WhatsAppForm'
import type { FinderSelection } from './data/content'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { scrollToId } from './utils/scroll'

export default function App() {
  useSmoothScroll()
  // El Tattoo Finder puede precargar el formulario de consulta.
  const [prefill, setPrefill] = useState<{ version: number; data: FinderSelection }>({ version: 0, data: {} })

  const refine = (data: FinderSelection) => {
    setPrefill((p) => ({ version: p.version + 1, data }))
    requestAnimationFrame(() => scrollToId('consulta'))
  }

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="label fixed top-3 left-3 z-[80] -translate-y-20 bg-bone px-4 py-3 text-ink focus:translate-y-0"
      >
        Saltar al contenido
      </a>
      <Backdrop />
      <div className="grain" aria-hidden="true" />
      <Navbar />
      <main id="main" className="relative z-10">
        <Hero />
        <StylesBand />
        <Manifesto />
        <StyleSection />
        <Gallery />
        <Process />
        <PainScale />
        <TattooFinder onRefine={refine} />
        <WhatsAppForm key={prefill.version} initial={prefill.data} />
        <InstagramSection />
        <Contact />
      </main>
    </MotionConfig>
  )
}
