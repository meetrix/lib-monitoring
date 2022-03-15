// Refer to : https://material-ui.com/customization/default-theme/
import { createTheme, Theme as MaterialUITheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#f15b4a',
      light: '#fff3f2',
      dark: '#F00000'
    },
    secondary: {
      main: '#0091ae',
      light: '#cbd6e2',
      dark: '#242D45'
    },
    background: {
      default: '#FFFFFF',
      paper: '#ffffff'
    },
    warning: {
      main: '#EF6B6B',
      contrastText: '#fff'
    },
    info: {
      main: '#fff',
      contrastText: '#707070'
    }
  },
  typography: {
    button: {
      textTransform: 'none'
    }
  }
})

export type Theme = MaterialUITheme
export default theme
