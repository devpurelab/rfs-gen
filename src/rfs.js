const BASE = 16
const RFS_THRESHOLD_PX = 20

export function toPx(val) {
  val = String(val).trim()
  if (val.endsWith('rem')) return parseFloat(val) * BASE
  if (val.endsWith('px'))  return parseFloat(val)
  return parseFloat(val) * BASE
}

function fmt(n) {
  return parseFloat(n.toFixed(4)).toString()
}

export function toRem(px) {
  return `${fmt(px / BASE)}rem`
}

export function rfsClamp(valuePx, minWidth, maxWidth) {
  if (valuePx < RFS_THRESHOLD_PX) return toRem(valuePx)
  const maxValue = valuePx * 1.2
  const slope = (maxValue - valuePx) / (maxWidth - minWidth)
  const intercept = valuePx - slope * minWidth
  return `clamp(${toRem(valuePx)}, ${fmt(intercept / BASE)}rem + ${fmt(slope * 100)}vw, ${toRem(maxValue)})`
}

export function generateLines(scale, globalMin, globalMax) {
  return Object.entries(scale).map(([key, val]) => {
    let valuePx, minWidth, maxWidth

    if (typeof val === 'object' && val !== null) {
      valuePx  = toPx(val.value)
      minWidth = parseInt(val.min  ?? globalMin)
      maxWidth = parseInt(val.max  ?? globalMax)
    } else {
      valuePx  = toPx(val)
      minWidth = globalMin
      maxWidth = globalMax
    }

    const css     = rfsClamp(valuePx, minWidth, maxWidth)
    const comment = valuePx < RFS_THRESHOLD_PX ? ' /* below threshold */' : ''
    return `  --text-${key}: ${css};${comment}`
  })
}

export function buildBlock(lines) {
  return [
    '  /* RFS:START - Auto-generated. Do not edit manually. */',
    ...lines,
    '  /* RFS:END */',
  ].join('\n')
}
