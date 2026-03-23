#!/usr/bin/env node

import { createRequire } from 'module'
import { resolve, dirname } from 'path'
import { existsSync } from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'

import { generateLines, buildBlock } from './rfs.js'
import { writeToFile } from './writer.js'
import { toClipboard } from './clipboard.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Load config ───────────────────────────────────────────────────────────────

const configPath = resolve(process.cwd(), 'rfs.config.js')

if (!existsSync(configPath)) {
  console.error('✗ rfs.config.js not found in', process.cwd())
  process.exit(1)
}

const { default: config } = await import(pathToFileURL(configPath).href)

// ── Validate ──────────────────────────────────────────────────────────────────

const {
  min    = 320,
  max    = 1280,
  scale  = {},
  output = null,
} = config

if (!Object.keys(scale).length) {
  console.error('✗ scale is empty in rfs.config.js')
  process.exit(1)
}

// ── Generate ──────────────────────────────────────────────────────────────────

const lines = generateLines(scale, min, max)
const block = buildBlock(lines)

// ── Output ────────────────────────────────────────────────────────────────────

if (output) {
  const result = writeToFile(resolve(process.cwd(), output), block)
  const labels = {
    created:  '✓ File created with @theme block',
    updated:  '✓ RFS block updated',
    injected: '✓ RFS block injected into existing @theme',
    appended: '✓ @theme block appended to file',
  }
  console.log(`${labels[result]}: ${output}`)
} else {
  const ok = toClipboard(`@theme {\n${block}\n}`)
  if (ok) {
    console.log('✓ Copied to clipboard')
  } else {
    console.log('@theme {')
    console.log(block)
    console.log('}')
    console.warn('⚠ Clipboard unavailable — output printed above')
  }
}
