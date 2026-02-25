# Portfolio Website

## Overview
A high-end portfolio/landing page for a Fullstack & Blockchain Engineer. Features 3D graphics, animations, and a modern UI.

## Tech Stack
- **Framework:** React 19 (TypeScript)
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 3.4 + shadcn/ui (Radix UI)
- **Animations:** GSAP, Lenis (smooth scrolling)
- **3D:** Three.js with @react-three/fiber and @react-three/drei
- **Icons:** Lucide React

## Project Structure
- `src/` - Source code (React components, pages, styles)
- `src/main.tsx` - React entry point
- `src/App.tsx` - Root component
- `dist/` - Production build output
- `server.js` - Static file server (for local production preview, port 5000)

## Development
- Workflow: `npm run dev` on port 5000
- Build: `npm run build` outputs to `dist/`

## Deployment
- **Type:** Static site deployment
- **Build command:** `npm run build`
- **Public directory:** `dist/`
- No server needed in production; Replit serves static files directly.
