import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';

function LogoutPopup() {
    // State to control the visibility of the dialog
    const [open, setOpen] = useState(false);

    // Function to handle the user logging out (this could be triggered by some action in your app)
    const handleLogout = () => {
        // Perform your logout logic here
        // Then, open the dialog
        setOpen(true);
    };

    // Function to close the dialog
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleLogout}>
                Logout
            </Button>

            <Dialog
                open={open}
                onClose={handleClose} // Close the dialog when clicking outside or pressing escape
                aria-labelledby="logout-dialog-title"
                aria-describedby="logout-dialog-description"
            >
                <DialogTitle id="logout-dialog-title">Logged Out</DialogTitle>
                <DialogContent>
                    <DialogContentText id="logout-dialog-description">
                        You have successfully logged out.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default LogoutPopup;
