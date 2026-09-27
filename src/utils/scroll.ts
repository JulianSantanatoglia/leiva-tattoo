import type Lenis from 'lenis'

let lenis: Lenis | null = null

export function setLenis(instance: Lenis | null): void {
  lenis = instance
}

export function getLenis(): Lenis | null {
  return lenis
}

export function scrollToId(id: string): void {
  const target = document.getElementById(id)
  if (!target) return
  if (lenis) lenis.scrollTo(target, { offset: 0 })
  else target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
