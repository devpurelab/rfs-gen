// RFS formula ported from https://github.com/twbs/rfs
// The value in config is the MAX (at breakpoint and above).

const REM_VALUE      = 16
const BASE_VALUE_PX  = 20
const FACTOR         = 10
const UNIT_PRECISION = 5

function toFixed(number, precision) {
  const multiplier = 10 ** (precision + 1)
  const wholeNumber = Math.floor(number * multiplier)
  return Math.round(wholeNumber / 10) * 10 / multiplier
}

function toRem(px) {
  return toFixed(px / REM_VALUE, UNIT_PRECISION) + "rem"
}

export function toPx(val) {
  val = String(val).trim()
  if (val.endsWith("rem")) return parseFloat(val) * REM_VALUE
  if (val.endsWith("px"))  return parseFloat(val)
  return parseFloat(val) * REM_VALUE
}

export function rfsValue(valuePx, breakpointPx) {
  if (BASE_VALUE_PX >= Math.abs(valuePx) || FACTOR <= 1) {
    return toRem(valuePx)
  }
  const baseValue = BASE_VALUE_PX + (Math.abs(valuePx) - BASE_VALUE_PX) / FACTOR
  const diff      = Math.abs(valuePx) - baseValue
  const baseRem   = toFixed(baseValue / REM_VALUE, UNIT_PRECISION)
  const vw        = toFixed(diff * 100 / breakpointPx, UNIT_PRECISION)
  return "calc(" + baseRem + "rem + " + vw + "vw)"
}

export function generateLines(scale, globalMin, globalMax) {
  return Object.entries(scale).flatMap(([key, val]) => {
    let valuePx, breakpointPx, lineHeight
    if (typeof val === "object" && val !== null) {
      valuePx      = toPx(val.value)
      breakpointPx = parseInt(val.max ?? globalMax)
      lineHeight   = val.lineHeight ?? null
    } else {
      valuePx      = toPx(val)
      breakpointPx = globalMax
      lineHeight   = null
    }
    const css     = rfsValue(valuePx, breakpointPx)
    const comment = (BASE_VALUE_PX >= Math.abs(valuePx) || FACTOR <= 1) ? " /* below threshold */" : ""
    const lines   = ["  --text-" + key + ": " + css + ";" + comment]
    if (lineHeight !== null) {
      lines.push("  --text-" + key + "--line-height: " + lineHeight + ";")
    }
    return lines
  })
}

export function buildBlock(lines) {
  return [
    "  /* RFS:START - Auto-generated. Do not edit manually. */",
    ...lines,
    "  /* RFS:END */",
  ].join("\n")
}