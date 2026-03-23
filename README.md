# rfs-gen

Generates a fluid type scale for Tailwind v4 using RFS-style `clamp()` values. Reads a config file and writes directly into your CSS, or copies to clipboard.

## What it does

Takes your font size scale, applies the RFS formula (values scale up to 20% between your min/max breakpoints), and injects the result as CSS custom properties inside a `@theme` block:

```css
@theme {
  /* RFS:START - Auto-generated. Do not edit manually. */
  --text-xl:  clamp(1.25rem, 1.1667rem + 0.4167vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.4rem + 0.5vw, 1.8rem);
  /* RFS:END */
}
```

Values below `20px` are not scaled (fixed rem output).

---

## Installation

**From a local path:**

```bash
npm install -D devpurelab/rfs-gen
```

Or in `package.json`:

```json
"devDependencies": {
  "rfs-gen": "devpurelab/rfs-gen"
}
```

---

## Usage

Add to your scripts:

```json
"scripts": {
  "rfs": "node ./node_modules/rfs-gen/src/cli.js",
  "dev": "npm run rfs && vite"
}
```

Then run:

```bash
npm run rfs
```

---

## Configuration

Create `rfs.config.js` in your project root:

```js
export default {
  // Global breakpoint range in px
  min: 320,
  max: 1280,

  // Path to your CSS file (relative to project root)
  // Omit to copy output to clipboard instead
  output: 'src/index.css',

  scale: {
    // Simple: uses global min/max
    'xs':   '0.75rem',
    'sm':   '0.875rem',
    'base': '1rem',
    'lg':   '1.125rem',
    'xl':   '1.25rem',
    '2xl':  '1.5rem',
    '3xl':  '1.875rem',
    '4xl':  '2.25rem',
    '5xl':  '3rem',
    '6xl':  '3.75rem',
    '7xl':  '4.5rem',

    // Per-step: override breakpoints for a single key
    'hero': { value: '5rem', min: 480, max: 1440 },
  },
}
```

### Options

| Key | Type | Default | Description |
|---|---|---|---|
| `min` | `number` | `320` | Min viewport width in px |
| `max` | `number` | `1280` | Max viewport width in px |
| `output` | `string` | — | Path to CSS file. Omit for clipboard |
| `scale` | `object` | — | Font size scale (see below) |

### Scale values

Each key in `scale` maps to `--text-{key}` in the output. Values can be:

- A string: `'1.5rem'` or `'24px'` — uses global `min`/`max`
- An object: `{ value: '1.5rem', min: 480, max: 1440 }` — per-step breakpoints

---

## CSS file behaviour

When `output` is set, rfs-gen handles four cases automatically:

| Condition | Behaviour |
|---|---|
| File doesn't exist | Creates it with `@import "tailwindcss"` and `@theme` block |
| File exists, no `@theme` | Appends `@theme` block at end of file |
| File has `@theme`, no markers | Injects markers inside existing `@theme` |
| File has markers | Replaces only the content between markers |

The markers (`/* RFS:START */` / `/* RFS:END */`) are preserved across runs — everything outside them is untouched.
