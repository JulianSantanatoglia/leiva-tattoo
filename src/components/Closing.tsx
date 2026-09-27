import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef, type MouseEvent } from 'react'
import { instagramUrl, tattooArtist } from '../config/artist'
import { gallery } from '../data/gallery'
import { scrollToId } from '../utils/scroll'
import { whatsappUrl } from '../utils/whatsapp'
import { ArtImage } from './ArtImage'
import { Mandala } from './Mandala'
import { InkLink, Lines, Reveal, SectionLabel } from './ui'

const featured = [gallery[0], gallery[1], gallery[5], gallery[4]]

export function InstagramSection() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['6%', '-10%'])

  return (
    <section ref={ref} aria-labelledby="ig-title" className="relative overflow-hidden border-t border-line bg-ink py-28 md:py-36">
      <div className="shell flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel index="08">Instagram</SectionLabel>
          <h2 id="ig-title" className="display mt-8 text-[15vw] md:text-[8vw] xl:text-[8rem]">
            <Lines lines={['Follow', 'the work']} />
          </h2>
        </div>
        <Reveal className="md:pb-3">
          <p className="max-w-xs text-[0.95rem] leading-relaxed text-smoke">
            Trabajos recientes, bocetos y huecos libres en la agenda. Todo pasa primero por Instagram.
          </p>
          <InkLink href={instagramUrl} target="_blank" rel="noopener noreferrer" className="mt-6">
            @{tattooArtist.instagram}
          </InkLink>
        </Reveal>
      </div>

      <motion.ul
        style={reduce ? undefined : { x }}
        className="mt-16 flex gap-4 pl-5 md:mt-24 md:gap-6 md:pl-10"
        aria-label="Algunas piezas del portfolio"
      >
        {featured.map((item) => (
          <li key={item.id} className="w-[62vw] shrink-0 sm:w-[40vw] md:w-[26vw]">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden"
              aria-label={`${item.title}: ver más en Instagram`}
            >
              <ArtImage
                src={item.src}
                alt={item.alt}
                style={item.style}
                seed={item.seed}
                width={4}
                height={5}
                showTag={false}
                imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
              />
            </a>
          </li>
        ))}
      </motion.ul>
    </section>
  )
}

export function Contact() {
  const toTop = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scrollToId('top')
  }

  return (
    <>
      <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden border-t border-line bg-ink py-28 md:py-44">
        <Mandala
          className="pointer-events-none absolute top-1/2 right-[-35%] aspect-square w-[110vw] -translate-y-1/2 text-bone/[0.07] md:right-[-18%] md:w-[70vw]"
        />
        <div className="shell relative">
          <SectionLabel index="09">Contact</SectionLabel>
          <p className="serif mt-10 text-4xl text-smoke md:text-6xl">Have an idea?</p>
          <h2 id="contact-title" className="display mt-4 text-[18vw] md:text-[12.5vw] xl:text-[13rem]">
            <Lines lines={["Let's turn", 'it into ink.']} from="left" />
          </h2>

          <div className="mt-16 grid gap-10 border-t border-line pt-10 md:mt-24 md:grid-cols-12">
            <dl className="grid gap-6 sm:grid-cols-3 md:col-span-7">
              <div>
                <dt className="label text-smoke">Estudio</dt>
                <dd className="mt-2 text-lg">{tattooArtist.location}</dd>
              </div>
              <div>
                <dt className="label text-smoke">Instagram</dt>
                <dd className="mt-2 text-lg">
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="ink-link">
                    @{tattooArtist.instagram}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label text-smoke">Citas</dt>
                <dd className="mt-2 text-lg">Solo con cita previa</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
              <InkLink href={whatsappUrl()} target="_blank" rel="noopener noreferrer" variant="solid">
                Book a session
              </InkLink>
              <InkLink href={instagramUrl} target="_blank" rel="noopener noreferrer">
                Instagram
              </InkLink>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-line bg-ink py-12">
        <div className="shell label grid gap-10 text-smoke md:grid-cols-4">
          <p className="leading-relaxed">
            <span className="text-bone">{tattooArtist.name}</span>
            <br />
            {tattooArtist.role}
            <br />
            Almería / Spain
          </p>
          <p className="leading-relaxed">
            Dotwork
            <br />
            Geometry
            <br />
            Black &amp; Grey
          </p>
          <ul className="space-y-1">
            <li>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="ink-link text-bone">
                Instagram
              </a>
            </li>
            <li>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="ink-link text-bone">
                WhatsApp
              </a>
            </li>
          </ul>
          <div className="flex items-start justify-between md:flex-col md:items-end md:justify-between">
            <a href="#top" onClick={toTop} className="ink-link text-bone">
              Volver arriba ↑
            </a>
            <p className="md:mt-6">© {new Date().getFullYear()} {tattooArtist.name}</p>
          </div>
        </div>
      </footer>
    </>
  )
}
