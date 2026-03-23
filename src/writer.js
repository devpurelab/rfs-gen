import { readFileSync, writeFileSync, existsSync } from 'fs'

const MARKER_START = '/* RFS:START - Auto-generated. Do not edit manually. */'
const MARKER_END   = '/* RFS:END */'

export function writeToFile(filePath, block) {
  // File non esiste → lo crea con @theme e markers
  if (!existsSync(filePath)) {
    const content = `@import "tailwindcss";\n\n@theme {\n${block}\n}\n`
    writeFileSync(filePath, content, 'utf8')
    return 'created'
  }

  let content = readFileSync(filePath, 'utf8')

  // Caso 1: markers già presenti → sostituisce il blocco
  if (content.includes(MARKER_START)) {
    // Include any leading whitespace before the marker
    const before = content.slice(0, content.indexOf(MARKER_START)).replace(/\n\s*$/, '\n')
    const after  = content.slice(content.indexOf(MARKER_END) + MARKER_END.length)
    content = before + block + after
    writeFileSync(filePath, content, 'utf8')
    return 'updated'
  }

  // Caso 2: @theme presente ma senza markers → inietta all'inizio del blocco @theme
  const themeMatch = content.match(/@theme\s*\{/)
  if (themeMatch) {
    const insertAt = content.indexOf(themeMatch[0]) + themeMatch[0].length
    content = content.slice(0, insertAt) + '\n' + block + '\n' + content.slice(insertAt)
    writeFileSync(filePath, content, 'utf8')
    return 'injected'
  }

  // Caso 3: nessun @theme → lo appende in fondo
  content = content.trimEnd() + `\n\n@theme {\n${block}\n}\n`
  writeFileSync(filePath, content, 'utf8')
  return 'appended'
}
