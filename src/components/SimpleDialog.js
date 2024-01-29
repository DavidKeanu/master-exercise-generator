import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

const konzepte = ['Datentypen und Ausdrücke', 'Freien Programmcode schreiben',
    'Welche Aussagen treffen auf den folgenden Code zu'
];

function SimpleDialog(props) {
    const {onClose, selectedValue, open} = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Programmierkonzept</DialogTitle>
            <List sx={{pt: 0}}>
                {konzepte.map((konzept) => (
                    <ListItem disableGutters key={konzept}>
                        <ListItemButton onClick={() => handleListItemClick(konzept)}>
                            <ListItemText primary={konzept}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
};

export default function SimpleDialogDemo() {
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(konzepte[1]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'row',
    };


    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
    };

    return (
        <div>
            <div style={containerStyle}>
            <Button variant="outlined" onClick={handleClickOpen}>
                Programmierkonzept <br/> auswählen
            </Button>
            Programmierkonzept: <br/>
             {selectedValue}</div>
            <SimpleDialog
                selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
            />
        </div>
    );
}