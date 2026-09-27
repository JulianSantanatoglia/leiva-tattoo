import Lenis from 'lenis'
import { useEffect } from 'react'
import { setLenis } from '../utils/scroll'

/** Scroll suave con Lenis (desactivado si el usuario prefiere menos movimiento). */
export function useSmoothScroll(): void {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: false })
    setLenis(lenis)
    return () => {
      setLenis(null)
      lenis.destroy()
    }
  }, [])
}
