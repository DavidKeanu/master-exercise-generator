import React, {useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {CircularProgress, Grid, IconButton, Rating} from "@mui/material";
import generateAssignmentService from "../services/GenerateAssignment";
import {AddTask} from "@mui/icons-material";

const cardData = [
    {
        title: 'Datentypen & Ausdrücke',
        description: 'Schwierigkeitsgrad:',
        image: 'https://i.imgur.com/Mm3Cpc3.png',
    },
    {
        title: 'Prorammcode analysieren',
        description: 'Schwierigkeitsgrad:',
        image: 'https://via.placeholder.com/150',
    },
    {
        title: 'Welche Aussagen treffen auf den folgenden Code zu',
        description: 'Schwierigkeitsgrad:',
        image: 'https://via.placeholder.com/150',
    },
    // Add more card data as needed
];

const CardListDialog = () => {
    const [open, setOpen] = useState(false);
    const [ratings, setRatings] = useState(Array(cardData.length).fill(0));
    const [loading, setLoading] = useState(false); // Loading state

    const handleRatingChange = (index, newValue) => {
        // Create a new array with the updated rating for the specific card
        const newRatings = [...ratings];
        newRatings[index] = newValue;
        setRatings(newRatings);
        console.log(newRatings);
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
            setLoading(true);

            // Call the sendAssignmentRequest method
            const response = await generateAssignmentService.sendAssignmentRequest();

            // Set the response content and open the response modal
            console.log(response);
        } catch (error) {
            console.error('Error generating task:', error);
            // Handle error as needed
        } finally {
            // Set loading back to false once the request is complete
            setLoading(false);
        }
    };

    return (
        <div>
            <Button variant="contained" color="success" onClick={handleOpen}>
                Aufgabe generieren
            </Button>

            <Dialog onClose={handleClose} open={open} maxWidth="md" fullWidth>
                <DialogTitle>Was möchtest du lernen?</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {cardData.map((card, index) => (
                            <Grid item key={index} xs={12} sm={6} md={4}>
                                <Card style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    height: '100%', // Set a fixed height for each card
                                }}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={card.image}
                                        alt={card.title}
                                    />
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
                                        />
                                    </CardContent>
                                    <div style={{
                                        marginTop: 'auto',
                                        paddingTop: '8px',
                                        marginBottom: '8px',
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleGenerateTask(index)}
                                        >{loading ? <CircularProgress size={24}/> : 'Aufgabe generieren'}
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
