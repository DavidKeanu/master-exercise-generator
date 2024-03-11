import {Alert, AlertTitle, Slide, Snackbar} from "@mui/material";

const SolutionAlert = ({isOpen, handleCloseAlert, solution}) => {

    return (
        <Snackbar
            open={isOpen}
            anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            TransitionComponent={Slide}
            TransitionProps={{direction: 'up'}}
        >
            {solution?.success ? (
                <Alert severity="success" sx={{ width: '75%', margin: 'auto' }} onClose={handleCloseAlert}>
                    <AlertTitle>Erfolgreich</AlertTitle>
                    {solution?.message}
                </Alert>
            ) : (
                <Alert severity="error" sx={{ width: '75%', margin: 'auto' }} onClose={handleCloseAlert}>
                    <AlertTitle>Fehler</AlertTitle>
                    {solution?.message}
                </Alert>
            )}
        </Snackbar>
    );
}

export default SolutionAlert;