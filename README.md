# Salva Leiva — Tattoo Artist

Demo web para Salva Leiva, tatuador en Almería (puntillismo, geometría y black & grey).

Stack: Vite · React · TypeScript · Tailwind CSS v4 · Motion (animaciones) · Lenis (smooth scroll).
Fuentes auto-alojadas con Fontsource (Archivo, Instrument Serif, JetBrains Mono).

## Scripts

```bash
npm run dev      # desarrollo
npm run build    # comprobación de tipos + build de producción
npm run preview  # servir el build
npm run lint
```

## Dónde cambiar cada cosa

| Qué | Archivo |
| --- | --- |
| Nombre, Instagram, **WhatsApp (provisional)**, ubicación | `src/config/artist.ts` |
| Piezas de la galería (fotos, proporciones, posición) | `src/data/gallery.ts` |
| Textos de estilos | `src/data/tattooStyles.ts` |
| Pasos del proceso, escala de dolor, opciones de consulta y del Tattoo Finder | `src/data/content.ts` |
| Mensaje de WhatsApp generado | `src/utils/whatsapp.ts` |
| Colores y tipografías (tokens) | `src/index.css` (`@theme`) |

## Fotos

Las fotos están en `public/images/` en WebP optimizado (máx. 1600 px):

- `salva.webp`: retrato de Salva en el estudio (bloque "El artista").
- `tattoo-01.webp` … `tattoo-07.webp`: portfolio (galería, sección de estilos e Instagram).

Los originales están en `fotos-originales/`, fuera de `public/` para que no se publiquen.
A las capturas de Instagram (1 y 7) se les recortaron los iconos de la interfaz.

Para añadir o cambiar una pieza, edita `src/data/gallery.ts` (`src`, `width` y `height` con las
dimensiones reales). Si una pieza no tiene `src`, se muestra una ilustración marcada como PLACEHOLDER.

## Estructura

```
src/
  config/artist.ts         datos del tatuador
  data/                    contenido (galería, estilos, proceso, dolor, consulta)
  utils/                   whatsapp, scroll (Lenis), PRNG para las ilustraciones
  hooks/useSmoothScroll.ts
  components/
    Backdrop.tsx           atmósfera fija + mandala que gira con el scroll
    Mandala.tsx            mandala SVG paramétrica (también se "construye" en el proceso)
    ArtImage.tsx           foto del portfolio o placeholder generado
    Navbar · Hero · Manifesto (+ banda de estilos) · StyleSection · Gallery (+ lightbox)
    Process · PainScale · TattooFinder · WhatsAppForm · Closing (Instagram, contacto, footer)
    ui.tsx                 botones, etiquetas de sección y revelados de texto
```

Accesibilidad: HTML semántico con un único H1, foco visible, navegación por teclado
(lightbox con flechas/Escape), enlace "saltar al contenido" y respeto a `prefers-reduced-motion`
(sin smooth scroll, sin parallax ni rotaciones).
# leiva-tattoo
