# JSON-LD Schema Generator

A React-based tool for generating JSON-LD schema markup to support AEO-GEO (Answer Engine Optimization / Generative Engine Optimization) strategies. Generate structured data for search engines and AI assistants across multiple schema types.

## Features

- Generate JSON-LD schema for 6 schema types:
  - **Local Business** — essential for local SEO and map listings
  - **FAQ** — get featured in AI-generated answers and voice assistant responses
  - **Product** — e-commerce & service product rich results
  - **Service** — company knowledge graph presence
  - **Organization** — business entity authority in AI systems
  - **Person** — establish expertise and authority (E-A-T)
- Live JSON preview as you fill out the form
- One-click copy to clipboard
- Schema-specific best practices and implementation guidance
- Built with React, TypeScript, Vite, Tailwind CSS, react-bootstrap, and react-jsonschema-form

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

### Build

Type-check and build for production:

```bash
npm run build
```

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Lint

Run ESLint:

```bash
npm run lint
```

## Usage

1. Select a schema type from the tabs (Local Business, FAQ, Product, Service, Organization, Person).
2. Fill in the schema details in the form on the left.
3. View the live JSON-LD preview on the right.
4. Click **Copy Schema** to copy the generated JSON-LD to your clipboard.
5. Add the JSON-LD to your website inside a `<script type="application/ld+json">` tag in the `<head>` section (or on the relevant page).

## Schema Types

| Schema | Best For |
|--------|----------|
| Local Business | Local SEO, map listings, storefronts |
| FAQ | AI search results, voice assistant responses |
| Product | E-commerce, product listings, shopping engines |
| Service | Service pages, business listings |
| Organization | Company pages, about sections, business validation |
| Person | Company leaders, content authors, expert contributors |

## Tech Stack

- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [react-bootstrap](https://react-bootstrap.netlify.app/)
- [react-jsonschema-form](https://rjsf-team.github.io/react-jsonschema-form/)

## License

MIT