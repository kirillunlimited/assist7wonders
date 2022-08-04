import { Theme, ThemeOptions, Palette, PaletteOptions, TypeBackground } from '@mui/material/styles';

interface ExtraPalette {}

interface ExtraTheme {}

interface ExtraBackground {
  appBar: string;
}

declare module '@mui/material/styles/createPalette' {
  export interface Palette extends ExtraPalette {}
  export interface PaletteOptions extends ExtraPalette {}
  export interface TypeBackground extends ExtraBackground {}
}

declare module '@mui/material/styles' {
  interface Theme extends ExtraTheme {}
  interface ThemeOptions extends ExtraTheme {}
}
