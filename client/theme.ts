import {createTheme} from '@mui/material/styles';
import {dark} from "@mui/material/styles/createPalette";


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
        },
        warning: {
            main: '#DD5656',
            light: '#FFB9B9',
            dark: '#DD5656'
        }

    },

    components: {
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    '&.Mui-focused': {
                        color: '#B41878', // Change the label color when focused
                    },
                },
            },
        },

        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '& input': {
                        color: '#B41878', // Change the input text color
                        //backgroundColor: '#F7F7F7'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#B41878',    // Change border color on hover
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#B41878',    // Change border color when focused
                        // Set custom border width
                    },
                },
                notchedOutline: {
                    //backgroundColor: '#F7F7F7',
                    borderColor: '#4DAC26',
                    borderRadius: '20px',

                },
            },
        },
    },


    typography: {
        fontFamily: 'poppins',
    },
});


export default customTheme;
