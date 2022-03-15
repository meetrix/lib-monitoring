// copies from @mui
export interface PaletteColorOptions {
  light?: string
  main: string
  dark?: string
  contrastText?: string
}

export interface PaletteOptions {
  primary?: PaletteColorOptions
  secondary?: PaletteColorOptions
  error?: PaletteColorOptions
  warning?: PaletteColorOptions
  info?: PaletteColorOptions
  success?: PaletteColorOptions
  background: {
    default: string
  }
}

export interface ThemeOptions {
  palette?: PaletteOptions
}

export interface Theme {
  palette: PaletteOptions
}
