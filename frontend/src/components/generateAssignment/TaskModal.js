import React, {useEffect, useState} from 'react';
import Draggable from 'react-draggable';
import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";
import {CircularProgress, FormControl, IconButton, InputLabel, MenuItem, Select} from "@mui/material";
import {Close, ThumbDown, ThumbUp} from "@mui/icons-material";
import dbService from "../../services/DbService";
import generateAssignmentService from "../../services/GenerateAssignment";
import INITIAL_CODE from "../../constants/CodeEditorConstants";


const TaskModal = ({aufgabe, code, onClose, solution}) => {

    const [loading, setLoading] = useState(false);
    const [loadingSolution, setLoadingSolution] = useState(false);
    const [begruendung, setBegruendung] = useState('');
    const [isThumbsDownClicked, setThumbsDownClicked] = useState();
    const [isThumbsUpClicked, setThumbsUpClicked] = useState();
    const [solutionDisabled, setSolutionDisabled] = useState(true);
    const [newTaskDisabled, setNewTaskDisabled] = useState(true);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [aufgabeInput, setAufgabeInput] = useState(aufgabe);
    const options = ['zu leicht', 'zu schwer', 'Aufgabe wiederholt sich.'];
    /**
     * Updates a task property with the provided field updates, both locally and in the database.
     * @param {Object} fieldUpdates - The field updates to be applied to the task property.
     * @returns {Promise<void>} - A Promise that resolves once the update process is complete.
     * @throws {Error} - Throws an error if there is an issue during the update process.
     * @author David Nutzinger
     */
    const updateTaskProperty = async (fieldUpdates) => {
        const updatedTask = {
            ...aufgabeInput,
            ...fieldUpdates
        };
        // perform the asynchronous update with dbService
        const response = await dbService.updateTask(updatedTask);
        // Update the local state
        setAufgabeInput({...updatedTask, id: response.id});
    };

    useEffect(() => {}, [aufgabeInput]);

    /**
     * Handles the change in the 'begruendung' value, updating state and triggering related actions.
     *
     * @param {event} - The change event triggered by the input element.
     * @returns {Promise<void>} - A Promise that resolves once the change handling process is complete.
     * @author David Nutzinger
     */
    const handleChange = async (event) => {
        setBegruendung(event.target.value);
        if (begruendung === '') {
            setNewTaskDisabled(true);
            setSolutionDisabled(true);
        }
        await updateTaskProperty({istGuteAufgabe: false, begruendung: event.target.value});
        setIsButtonDisabled(false);
        setSolutionDisabled(true);
        setNewTaskDisabled(false);
    };
    /**
     * Handles the click event on the Thumb Up button, updating related states and triggering actions.
     * @returns {Promise<void>} - A Promise that resolves once the click handling process is complete.
     * @author David Nutzinger
     */
    const handleThumbUpClick = async () => {
        if (!isThumbsUpClicked) {
            setThumbsUpClicked(true);
            setThumbsDownClicked(false); // Disable the Thumb Down button
            setSolutionDisabled(false);
            setIsButtonDisabled(false);
            setBegruendung('');
            setNewTaskDisabled(false);
            await updateTaskProperty({istGuteAufgabe: true, begruendung: ''});
        } else {
            setThumbsUpClicked(false);
            setIsButtonDisabled(true);
            setSolutionDisabled(true);
            setNewTaskDisabled(true);
        }
    };
    /**
     * Handles the click event on the Thumb Down button, updating related states and triggering actions.
     * @returns {Promise<void>} - A Promise that resolves once the click handling process is complete.
     * @author David Nutzinger
     */
    const handleThumbDownClick = async () => {
        if (!isThumbsDownClicked) {
            setThumbsDownClicked(true);
            if (begruendung === "") {
                setIsButtonDisabled(true);
            }
            if (isThumbsUpClicked) {
                setSolutionDisabled(true);
                setNewTaskDisabled(true);
                setThumbsUpClicked(false);
            }
        } else {
            setThumbsDownClicked(false);
            setBegruendung('');
            setIsButtonDisabled(true);
            setSolutionDisabled(true);
            setNewTaskDisabled(true);
        }
    };
    /**
     * Generates a new task by sending a request to the backend and updating the local state accordingly.
     * @returns {Promise<void>} - A Promise that resolves once the new task generation process is complete.
     * @author David Nutzinger
     */
    const generateNewTask = async () => {
        try {
            setLoading(true);

            const data = {
                aufgabentyp: aufgabeInput.aufgabentyp,
                schwierigkeitsgrad: aufgabeInput.schwierigkeitsgrad,
                erfahrung: aufgabeInput.erfahrung,
                begruendung: aufgabeInput.begruendung,
                istGuteAufgabe: aufgabeInput.istGuteAufgabe,
                aufgabe: aufgabeInput.aufgabe
            };
            console.log(data);
            // Call the sendAssignmentRequest method
            const response = await generateAssignmentService.sendAssignmentRequest(data);

            const responseFromBackend = {
                aufgabentyp: response.aufgabentyp,
                schwierigkeitsgrad: response.schwierigkeitsgrad,
                erfahrung: response.erfahrung,
                aufgabe: response.aufgabe
            };

            setThumbsUpClicked(false);
            setThumbsDownClicked(false);
            setAufgabeInput(responseFromBackend);
            setNewTaskDisabled(true);
            setIsButtonDisabled(true);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };
    /**
     * Checks the solution for the current task by sending a request to the backend.
     *
     * @returns {Promise<void>} - A Promise that resolves once the solution checking process is complete.
     * @param {string} code - The code to be checked for the solution.
     * @param {Function} solution - The callback function to handle the solution result.
     * @throws {Error} - Throws an error if there is an issue during the solution checking process.
     * @author David Nutzinger
     */
    const checkSolution = async () => {
        const solutionObject = {
            aufgabe: aufgabeInput.aufgabe,
            code: code,
        }
        if (code === INITIAL_CODE) {
            solution({success: false, message: "Bitte gebe Code ein."})
        } else {
            setLoadingSolution(true);
            const solutionFromGpt = await generateAssignmentService.checkSolution(solutionObject);
            setLoadingSolution(false);
            solution(JSON.parse(solutionFromGpt));
        }
    };
    /**
     * Maps an ID to a corresponding task category (Aufgabe) name.
     * @param {number} id - The numerical identifier of the task category.
     * @returns {string} - The corresponding task category (Aufgabe) name.
     * @author David Nutzinger
     */
    const mapIdToAufgabe = (id) => {
        switch (id) {
            case 0:
                return 'Datentypen & Ausdrücke';
            case 1:
                return 'Arrays';
            case 2:
                return 'Schleifen';
            default:
                return 'Unknown';
        }
    }

    return (
        <div>
            <Draggable>
                <div style={{position: 'absolute', zIndex: 1}}>
                    {/* Draggable component content */}
                    <div style={{backgroundColor: 'white', padding: '16px', border: '1px solid #ccc'}}>
                        <div style={{display: 'flex'}}>
                            <Typography variant="h5">{mapIdToAufgabe(aufgabeInput.aufgabentyp)}</Typography>
                            <IconButton style={{marginLeft: 'auto'}} onClick={onClose} disabled={isButtonDisabled}>
                                <Close></Close>
                            </IconButton>
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "start",
                            gap: "10px",
                            marginBottom: '10px',
                            minWidth: '400px',
                            maxWidth: '600px',
                            fontSize: '16px'
                        }}>
                            <div>{JSON.parse(aufgabeInput.aufgabe).aufgabe}</div>
                            <div style={{color: 'red'}}>Erwartetes Ergebnis:</div>
                            <div> {JSON.parse(aufgabeInput.aufgabe).erwartetesErgebnis}</div>
                        </div>
                        <div>
                            {/* ThumbUp and ThumbDown IconButtons */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: '50px'
                            }}>
                                <div>
                                    <div style={{margin: '0 10px'}}>
                                        Gute Aufgabe?
                                    </div>
                                    <IconButton color={isThumbsUpClicked ? 'success' : 'default'}
                                                onClick={() => handleThumbUpClick(true)}>
                                        <ThumbUp fontSize="small"/>
                                    </IconButton>
                                    <IconButton color={isThumbsDownClicked ? 'warning' : 'default'}
                                                onClick={() => handleThumbDownClick(true)}>
                                        <ThumbDown fontSize="small"/>
                                    </IconButton></div>
                                {isThumbsDownClicked && (
                                    <div>
                                        <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
                                            <InputLabel id="demo-simple-select-standard-label">Begründung</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-standard-label"
                                                id="demo-simple-select-standard"
                                                value={aufgabeInput.begruendung}
                                                onChange={handleChange}
                                                label="Age"
                                            >
                                                {options.map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>)
                                }
                                <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                                    <Button variant="contained" color="success" disabled={solutionDisabled}
                                            style={{width: 146}}
                                            onClick={() => checkSolution()}>
                                        {loadingSolution ? <CircularProgress size={24} color="inherit" /> : 'Lösung'}
                                    </Button>
                                    <Button variant="contained" color="primary" disabled={newTaskDisabled}
                                            style={{width: 146}}
                                            onClick={() => generateNewTask()}>
                                        {loading ? <CircularProgress size={24} color="inherit"/> : 'Neue Aufgabe'}
                                    </Button></div>
                            </div>
                        </div>
                    </div>
                </div>
            </Draggable>
        </div>
    )
};

export default TaskModal;
