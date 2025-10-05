import tokens from '../tokens/tokens.json'

export function applyTheme(){
  const root = document.documentElement
  root.style.setProperty('--color-brand', tokens.color.brand.value)
  root.style.setProperty('--color-surface', tokens.color.surface.value)
  root.style.setProperty('--color-ink', tokens.color.ink.value)
  root.style.setProperty('--color-muted', tokens.color.muted.value)
}

applyTheme()
