import React, {useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {CircularProgress, Grid, IconButton, Rating, Tooltip} from "@mui/material";
import generateAssignmentService from "../services/GenerateAssignment";
import {Help} from "@mui/icons-material";

const cardData = [
    {
        title: 'Datentypen & Ausdrücke',
        description: 'Schwierigkeitsgrad:',
    },
    {
        title: 'Prorammcode analysieren',
        description: 'Schwierigkeitsgrad:',
    },
    {
        title: 'Welche Aussagen treffen auf den folgenden Code zu',
        description: 'Schwierigkeitsgrad:',
    },
    // Add more card data as needed

];
// Define an array of fixed colors
const cardColors = ['#FF5733', '#33FF57', '#5733FF', '#FF3366', '#66FF33'];

const CardListDialog = ({sendDataToParent}) => {
    const [open, setOpen] = useState(false);
    const [ratings, setRatings] = useState(Array(cardData.length).fill(0));
    const [loadingStates, setLoadingStates] = useState(Array(cardData.length).fill(false));

    const sendAssignmentTextToParent = (response) => {
        // Call the function passed from the parent component with the data
        sendDataToParent(response);
    };


    const handleRatingChange = (index, newValue) => {
        // Create a new array with the updated rating for the specific card
        const newRatings = [...ratings];
        newRatings[index] = newValue;
        setRatings(newRatings);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleGenerateTask = async (index) => {
        try {
            // Set loading to true while waiting for the response
            const updatedLoadingStates = [...loadingStates];
            updatedLoadingStates[index] = true;
            setLoadingStates(updatedLoadingStates);

            // Perform your asynchronous task (e.g., fetch data, etc.)
            // Once the task is done, set the loading state back to false
            // For example purposes, using setTimeout to simulate an asynchronous task
            setTimeout(() => {
                updatedLoadingStates[index] = false;
                setLoadingStates(updatedLoadingStates);
            }, 2000);

            const data = {
                aufgabentyp: index,
                schwierigkeitsgrad: ratings[index]
            };
            // Call the sendAssignmentRequest method
            const response = await generateAssignmentService.sendAssignmentRequest(data);
            // Set the response content and open the response modal
            setOpen(false);
            sendAssignmentTextToParent(response);

        } catch (error) {
            console.error('Error generating task:', error);
            // Handle error as needed
        } finally {
            // Set loading back to false once the request is complete
            setLoadingStates(Array(cardData.length).fill(false));
        }
    };
    const tooltipContent = (
        <Typography variant="body2" color="textSecondary">
            <div>1 Stern = Leicht</div>
            <div>2 Sterne = Mittel</div>
            <div>3 Sterne = Schwer</div>
        </Typography>
    );

    return (
        <div>
            <Button variant="contained" color="success" onClick={handleOpen}>
                Aufgabe generieren
            </Button>

            <Dialog onClose={handleClose} open={open} maxWidth="md" fullWidth>
                <DialogTitle>Was möchtest du lernen?
                    <Tooltip title={tooltipContent} arrow style={{ marginLeft: 'auto' }}>
                        <IconButton>
                            <Help />
                        </IconButton>
                    </Tooltip>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {cardData.map((card, index) => (
                            <Grid item key={index} xs={12} sm={6} md={4}>
                                <Card style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    height: '100%', // Set a fixed height for each card
                                    backgroundColor: cardColors[index % cardColors.length], // Use a fixed color
                                }}>
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {card.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {card.description}
                                        </Typography>
                                        <Rating
                                            name={`rating-${index}`}
                                            value={ratings[index]}
                                            onChange={(event, newValue) =>
                                                handleRatingChange(index, newValue)
                                            }
                                            max={3}  // Set the maximum number of stars to 3
                                        />

                                    </CardContent>
                                    <div style={{
                                        marginTop: 'auto',
                                        paddingTop: '8px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        backgroundColor: 'white', // Set button background color to white

                                    }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleGenerateTask(index)}
                                        >{loadingStates[index] ? <CircularProgress size={24}/> : 'Aufgabe generieren'}
                                        </Button>
                                    </div>

                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Schließen
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CardListDialog;
