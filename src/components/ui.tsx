import { motion } from 'motion/react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

const EASE = [0.16, 1, 0.3, 1] as const

type Variant = 'line' | 'solid'

function Inner({ children }: { children: ReactNode }) {
  return (
    <>
      <span aria-hidden="true" className="bracket bracket-l">
        [
      </span>
      <span>{children}</span>
      <span aria-hidden="true" className="bracket bracket-r">
        ]
      </span>
    </>
  )
}

export function InkLink({
  variant = 'line',
  className = '',
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant }) {
  return (
    <a className={`ink-btn ${variant === 'solid' ? 'ink-btn--solid' : ''} ${className}`} {...rest}>
      <Inner>{children}</Inner>
    </a>
  )
}

export function InkButton({
  variant = 'line',
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button type={type} className={`ink-btn ${variant === 'solid' ? 'ink-btn--solid' : ''} ${className}`} {...rest}>
      <Inner>{children}</Inner>
    </button>
  )
}

/** Marcador editorial de sección: "(03) — Work" con una línea que se dibuja. */
export function SectionLabel({ index, children, className = '' }: { index: string; children: ReactNode; className?: string }) {
  return (
    <div className={`label flex items-center gap-4 text-smoke ${className}`}>
      <span>({index})</span>
      <motion.span
        aria-hidden="true"
        className="h-px w-12 origin-left bg-iron"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 1.2, ease: EASE }}
      />
      <span>{children}</span>
    </div>
  )
}

/** Aparición suave al entrar en pantalla. */
export function Reveal({
  children,
  className = '',
  delay = 0,
  y = 28,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Líneas de titular que suben desde una máscara, una tras otra. */
export function Lines({
  lines,
  className = '',
  lineClassName = '',
  delay = 0,
  from = 'bottom',
  animateOnMount = false,
}: {
  lines: ReactNode[]
  className?: string
  lineClassName?: string
  delay?: number
  from?: 'bottom' | 'left' | 'right'
  animateOnMount?: boolean
}) {
  const hidden = from === 'bottom' ? { y: '105%' } : { x: from === 'left' ? '-40%' : '40%', opacity: 0 }
  const shown = from === 'bottom' ? { y: '0%' } : { x: '0%', opacity: 1 }
  const trigger = animateOnMount
    ? { animate: shown }
    : { whileInView: shown, viewport: { once: true, margin: '-10% 0px' } }

  return (
    <span className={`block ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className={`block overflow-hidden pb-[0.06em] ${lineClassName}`}>
          <motion.span
            className="block will-change-transform"
            initial={hidden}
            {...trigger}
            transition={{ duration: 1.25, ease: EASE, delay: delay + i * 0.12 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
