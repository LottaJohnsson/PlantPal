import {Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import React from "react";


interface PopUp {
    open: boolean,
    handleClose: () => void,
    message: string,
    header: string,
}


function PopUp(props: PopUp) {
    return (
        <div>
            <Dialog
                open={props.open}
                onClose={props.handleClose} // Close the dialog when clicking outside or pressing escape
                aria-labelledby="logout-dialog-title"
                aria-describedby="logout-dialog-description"
            >
                <DialogTitle id="logout-dialog-title">{props.header}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="logout-dialog-description">
                        {props.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Box sx={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                        <Button onClick={props.handleClose} color="primary">
                            OK
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default {PopUp};
