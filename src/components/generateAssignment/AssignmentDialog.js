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

const AssignmentDialog = ({sendDataToParent, generateTaskDisbaled}) => {

    const cardData = [
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
    ];
    const [open, setOpen] = useState(false);
    const [ratings, setRatings] = useState(Array(cardData.length).fill(0));
    const [loadingStates, setLoadingStates] = useState(Array(cardData.length).fill(false));
    const [activeStep, setActiveStep] = useState(0);
    const [experience, setExperience] = useState('');

    /**
     * Handles the change in experience value and updates the 'experience' state.
     * @param {number} value - The new experience value.
     * @returns {void}
     * @author David Nutzinger
     */
    const handleExperienceChange = (value) => {
        setExperience(value);
    };
    /**
     * Sends the assignment text with extra information to the parent component.
     * This function is responsible for invoking the function passed from the parent
     * component.
     * @param {any} responseWithExtraInfos - The data containing the assignment text and additional information.
     * @returns {void} - This function does not return a value.
     * @author David Nutzinger
     */
    const sendAssignmentTextToParent = (responseWithExtraInfos) => {
        // Call the function passed from the parent component with the data
        sendDataToParent(responseWithExtraInfos);
    };

    /**
     * Handles the change in rating for a specific card and updates the 'ratings' state.
     * This function is responsible for updating the 'ratings' state by replacing the rating
     * at the specified index with a new value.
     * @param {number} index - The index of the card whose rating is being updated.
     * @param {number} newValue - The new rating value for the specified card.
     * @returns {void} - This function does not return a value.
     * @author David Nutzinger
     */
    const handleRatingChange = (index, newValue) => {
        // Create a new array with the updated rating for the specific card
        const newRatings = [...ratings];
        newRatings[index] = newValue;
        setRatings(newRatings);
    };
    /**
     * Opens a modal or dialog by setting the 'open' state to true.
     * @returns {void} - This function does not return a value.
     * @author David Nutzinger
     */
    const handleOpen = () => {
        setOpen(true);
    };
    /**
     * Closes a modal or dialog, resets the 'experience' state, and sets the 'activeStep' to 0.
     * @returns {void} - This function does not return a value.
     * @author David Nutzinger
     */
    const handleClose = () => {
        setOpen(false);
        setExperience("");
        setActiveStep(0);
    };
    /**
     * Handles the change in the active step, updating it if the 'experience' is not empty.
     * @param {number} step - The new active step value.
     * @returns {void} - This function does not return a value.
     * @author David Nutzinger
     */
    const handleStepChange = (step) => {
        if (experience !== "") {
            setActiveStep(step);
        }
    };
    /**
     * Maps the numerical representation of experience to corresponding descriptive titles.
     * @param {number} experience - The numerical representation of experience.
     * @returns {string} - The corresponding descriptive title for the given experience.
     * @author David Nutzinger
     */
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
            default:
                return 'Unknown Title';
        }
    };
    /**
     * Handles the generation of a task based on the specified parameters and communicates with the backend.
     * @param {number} index - The index representing the type of task to generate.
     * @returns {Promise<void>} - A Promise that resolves once the task generation process is complete.
     * @throws {Error} - Throws an error if there is an issue during the task generation process.
     * @author David Nutzinger
     */
    const handleGenerateTask = async (index) => {
        try {
            const updatedLoadingStates = [...loadingStates];
            updatedLoadingStates[index] = true;
            setLoadingStates(updatedLoadingStates);

            setTimeout(() => {
                updatedLoadingStates[index] = false;
                setLoadingStates(updatedLoadingStates);
            }, 2000);

            const data = {
                aufgabentyp: index,
                schwierigkeitsgrad: ratings[index],
                erfahrung: experience
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
                erfahrung: response.erfahrung,
                aufgabe: response.aufgabe
            }
            sendAssignmentTextToParent(responseFromBackend);

        } catch (error) {
            console.error('Error generating task:', error);
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
        <div style={{marginRight: '16px'}}>
            <Button variant="contained" color="success" onClick={handleOpen} disabled={generateTaskDisbaled}>
                Aufgabe generieren
            </Button>
            <Dialog onClose={handleClose} open={open} maxWidth="md" fullWidth>
                <DialogTitle style={{textAlign: 'center'}}>Aufgabe generieren {mapExperience(experience)}
                    <Tooltip title={tooltipContent} arrow style={{marginLeft: 'auto'}}>
                        <IconButton>
                            <Help/>
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
                    {activeStep === 0 &&
                        <ExperienceSelector onExperienceChange={handleExperienceChange} experience={experience}/>}
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
                                            >{loadingStates[index] ?
                                                <CircularProgress size={24}/> : 'Aufgabe generieren'}
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

export default AssignmentDialog;
