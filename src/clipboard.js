import { execSync } from 'child_process'

export function toClipboard(text) {
  const p = process.platform
  try {
    if (p === 'darwin') {
      execSync('pbcopy', { input: text })
    } else if (p === 'win32') {
      execSync('clip', { input: text })
    } else {
      try {
        execSync('xclip -selection clipboard', { input: text })
      } catch {
        execSync('xsel --clipboard --input', { input: text })
      }
    }
    return true
  } catch {
    return false
  }
}
