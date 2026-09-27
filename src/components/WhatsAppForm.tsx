import { AnimatePresence, motion } from 'motion/react'
import { useId, useState, type FormEvent } from 'react'
import { tattooArtist } from '../config/artist'
import { consultOptions } from '../data/content'
import { buildConsultationMessage, openWhatsApp, type Consultation } from '../utils/whatsapp'
import { InkButton, Lines, Reveal, SectionLabel } from './ui'

const MAX_IDEA = 600

function OptionGroup({
  index,
  legend,
  options,
  value,
  onChange,
  invalid,
  errorId,
}: {
  index: string
  legend: string
  options: readonly string[]
  value?: string
  onChange: (v: string) => void
  invalid?: boolean
  errorId?: string
}) {
  const name = useId()
  return (
    <fieldset className="border-t border-line pt-6" aria-describedby={invalid ? errorId : undefined}>
      <legend className="label float-left mb-5 w-full text-smoke">
        <span className="text-iron">{index}</span> — {legend}
      </legend>
      <div className="clear-left flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={o}
              checked={value === o}
              onChange={() => onChange(o)}
              className="peer sr-only"
            />
            <span className="block border border-line px-4 py-3 text-[0.9rem] text-bone/85 transition-colors duration-300 peer-checked:border-bone peer-checked:bg-bone peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-bone hover:border-smoke">
              {o}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function WhatsAppForm({ initial }: { initial?: Consultation }) {
  const [data, setData] = useState<Consultation>(initial ?? {})
  const [error, setError] = useState(false)
  const errorId = useId()
  const ideaId = useId()
  const refId = useId()

  const set = <K extends keyof Consultation>(key: K, value: Consultation[K]) => {
    setData((d) => ({ ...d, [key]: value }))
    if (key === 'style') setError(false)
  }

  const message = buildConsultationMessage(data)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!data.style) {
      setError(true)
      return
    }
    openWhatsApp(message)
  }

  return (
    <section id="consulta" aria-labelledby="consulta-title" className="relative border-t border-line bg-ink/85 py-28 md:py-40">
      <div className="shell">
        <SectionLabel index="07">Consulta</SectionLabel>
        <h2 id="consulta-title" className="display mt-8 text-[17vw] md:text-[10vw] xl:text-[10rem]">
          <Lines
            lines={[
              'Send',
              <span key="b" className="block pl-[14vw] md:pl-[18vw]">
                <span className="serif mr-[0.2em] text-[0.62em] text-smoke">your</span>idea.
              </span>,
            ]}
          />
        </h2>
        <p className="mt-8 max-w-md text-[0.95rem] leading-relaxed text-smoke">
          Rellena lo que sepas y te llegará a WhatsApp un mensaje ya escrito. Solo tienes que enviarlo. Respondo
          personalmente con disponibilidad y presupuesto.
        </p>
      </div>

      <form onSubmit={submit} noValidate className="shell mt-16 grid gap-14 md:mt-24 md:grid-cols-12 md:gap-10">
        <div className="space-y-10 md:col-span-7">
          <OptionGroup
            index="A"
            legend="Tipo de tatuaje *"
            options={consultOptions.style}
            value={data.style}
            onChange={(v) => set('style', v)}
            invalid={error}
            errorId={errorId}
          />
          <AnimatePresence>
            {error && (
              <motion.p
                id={errorId}
                role="alert"
                className="label -mt-6 text-bone"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                ↑ Elige al menos el tipo de tatuaje
              </motion.p>
            )}
          </AnimatePresence>
          <OptionGroup index="B" legend="Zona" options={consultOptions.zone} value={data.zone} onChange={(v) => set('zone', v)} />
          <OptionGroup
            index="C"
            legend="Tamaño aproximado"
            options={consultOptions.size}
            value={data.size}
            onChange={(v) => set('size', v)}
          />
          <OptionGroup
            index="D"
            legend="¿Ya tienes diseño?"
            options={consultOptions.design}
            value={data.design}
            onChange={(v) => set('design', v)}
          />

          <div className="border-t border-line pt-6">
            <label htmlFor={ideaId} className="label flex justify-between text-smoke">
              <span>
                <span className="text-iron">E</span> — Tu idea
              </span>
              <span className="tabular-nums text-iron">
                {(data.idea ?? '').length}/{MAX_IDEA}
              </span>
            </label>
            <textarea
              id={ideaId}
              rows={4}
              maxLength={MAX_IDEA}
              value={data.idea ?? ''}
              onChange={(e) => set('idea', e.target.value)}
              placeholder="Cuéntame brevemente tu idea..."
              className="mt-4 w-full resize-y border-b border-line bg-transparent pb-3 text-lg leading-relaxed text-bone placeholder:text-iron focus:border-bone focus:outline-none"
            />
          </div>

          <div className="border-t border-line pt-6">
            <label htmlFor={refId} className="group flex cursor-pointer items-center gap-4">
              <input
                id={refId}
                type="checkbox"
                checked={Boolean(data.hasReferences)}
                onChange={(e) => set('hasReferences', e.target.checked)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="grid size-5 shrink-0 place-items-center border border-smoke transition-colors peer-checked:border-bone peer-checked:bg-bone peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-bone"
              >
                <span className={`size-2 bg-ink ${data.hasReferences ? 'block' : 'hidden'}`} />
              </span>
              <span className="text-bone/85">
                Tengo imágenes de referencia <span className="text-smoke">(te las envío por WhatsApp)</span>
              </span>
            </label>
          </div>
        </div>

        <Reveal className="md:col-span-4 md:col-start-9">
          <div className="md:sticky md:top-24">
            <p className="label text-smoke">Vista previa del mensaje</p>
            <pre className="mt-4 max-h-[50svh] overflow-auto border border-line bg-coal p-5 font-mono text-[0.78rem] leading-relaxed whitespace-pre-wrap text-bone/85">
              {message}
            </pre>
            <InkButton type="submit" variant="solid" className="mt-6 w-full">
              Enviar consulta
            </InkButton>
            <p className="label mt-4 text-iron">
              Se abrirá WhatsApp · {tattooArtist.whatsapp.replace(/(\+\d{2})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4')}
            </p>
          </div>
        </Reveal>
      </form>
    </section>
  )
}
