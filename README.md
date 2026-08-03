# Pádel Water

Sitio oficial de producto — hidratación para jugadores de pádel.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- GSAP + ScrollTrigger
- Motion
- Lenis

## Desarrollo

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — desarrollo
- `npm run build` — producción
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript

## Contenido editable

- `data/site-content.ts` — copy y navegación
- `data/product.ts` — datos del producto
- `data/faq.ts` — preguntas frecuentes
- `data/availability.ts` — modo de disponibilidad
- `lib/config.ts` — WhatsApp, URL, redes

## Assets

Coloca archivos finales en:

- `public/brand/logo/`
- `public/brand/product/`
- `public/brand/lifestyle/`
- `public/brand/textures/`

Actualiza las rutas en `data/product.ts` (`media.*`). No uses capturas de referencia en la UI.
