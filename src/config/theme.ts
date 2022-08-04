import { createTheme } from '@mui/material/styles';
import { blue, pink, blueGrey } from '@mui/material/colors';

export default createTheme({
  palette: {
    primary: {
      main: blue[700],
    },
    secondary: {
      main: pink[500],
    },
    background: {
      default: blueGrey[50],
      appBar: blueGrey[200],
    },
  },
});
