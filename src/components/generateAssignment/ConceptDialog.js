import React, {useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {CircularProgress, Grid, IconButton, Rating, Step, StepButton, Stepper, Tooltip} from "@mui/material";
import generateAssignmentService from "../../services/GenerateAssignment";
import {Help} from "@mui/icons-material";
import ExperienceSelector from "./ExperienceSelector";

export const cardData = [
    {
        id: 0,
        title: 'Datentypen & Ausdrücke',
        description: 'Schwierigkeitsgrad:'
    },
    {
        id: 1,
        title: 'Arrays',
        description: 'Schwierigkeitsgrad:'
    },
    {
        id: 2,
        title: 'Schleifen',
        description: 'Schwierigkeitsgrad:'
    },
    // Add more card data as needed

];

const ConceptDialog = ({sendDataToParent, generateTaskDisbaled}) => {
    const [open, setOpen] = useState(false);
    const [ratings, setRatings] = useState(Array(cardData.length).fill(0));
    const [loadingStates, setLoadingStates] = useState(Array(cardData.length).fill(false));
    const [activeStep, setActiveStep] = useState(0);
    const [experience, setExperience] = useState('');

    const handleExperienceChange = (value) => {
        setExperience(value);
    };
    const sendAssignmentTextToParent = (responseWithExtraInfos) => {
        // Call the function passed from the parent component with the data
        sendDataToParent(responseWithExtraInfos);
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
        setExperience("");
        setActiveStep(0);

    };

    const handleStepChange = (step) => {
        if(experience !== "") {
            setActiveStep(step);
        };
    };

    const mapExperience = (experience) => {
        switch (experience) {
            case 0:
                return 'Keine Erfahrung';
            case 1:
                return 'Anfänger';
            case 2:
                return 'Grundkenntnisse';
            case 3:
                return 'Fortgeschrittene Kenntnisse';
            case 4:
                return 'Experte';
            // Add more cases as needed
            default:
                return 'Unknown Title';
        }
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
                schwierigkeitsgrad: ratings[index],
                experience: experience
            };
            // Call the sendAssignmentRequest method
            const response = await generateAssignmentService.sendAssignmentRequest(data);
            console.log("Response from Backend");
            console.log(response);
            // Set the response content and open the response modal
            setOpen(false);
            const responseFromBackend = {
                aufgabentyp: response.aufgabentyp,
                schwierigkeitsgrad: response.schwierigkeitsgrad,
                experience: response.experience,
                task: response.task
            }
            sendAssignmentTextToParent(responseFromBackend);

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
        <div style={{ marginRight: '16px' }}>
            <Button variant="contained" color="success" onClick={handleOpen} disabled={generateTaskDisbaled}>
                Aufgabe generieren
            </Button>
            <Dialog onClose={handleClose} open={open} maxWidth="md" fullWidth>
                <DialogTitle style={{ textAlign: 'center' }}>Aufgabe generieren {mapExperience(experience)}
                    <Tooltip title={tooltipContent} arrow style={{ marginLeft: 'auto' }}>
                        <IconButton>
                            <Help />
                        </IconButton>
                    </Tooltip>
                </DialogTitle>
                <DialogContent>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        <Step>
                            <StepButton onClick={() => handleStepChange(0)}>
                                Erfahrung auswählen
                            </StepButton>
                        </Step>
                        <Step>
                            <StepButton onClick={() => handleStepChange(1)}>
                                Programmierkonzept auswählen
                            </StepButton>
                        </Step>
                    </Stepper>
                    {activeStep === 0 && <ExperienceSelector onExperienceChange={handleExperienceChange} experience={experience} />}
                    {activeStep === 1 && (
                    <Grid container spacing={2} style={{marginTop: "20px"}}>
                        {cardData.map((card, index) => (
                            <Grid item key={index} xs={12} sm={6} md={4}>
                                <Card style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    height: '100%'
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
                                        backgroundColor: 'white',
                                        marginBottom: '12px'
                                        // Set button background color to white
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
                    </Grid>)}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Schließen
                    </Button>
                    {activeStep === 0 && (
                    <Button onClick={() => handleStepChange(1)} disabled={experience === ''} color="primary">
                        Weiter
                    </Button>)}
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ConceptDialog;
