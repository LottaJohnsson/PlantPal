import {createTheme} from '@mui/material/styles';


const customTheme = createTheme({
    palette: {
        primary: {
            main: '#B8E186',
            dark: '#4DAC26',
            //light: '#F7F7F7',
        },
        secondary: {
            main: '#B41878',
            light: '#F1B6DA',
            dark: '#B41878',
        },
        info: {
            main: '#F7F7F7',
        }

    },
});


export default customTheme;
