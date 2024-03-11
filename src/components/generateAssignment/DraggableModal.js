import React, {useEffect, useState} from 'react';
import Draggable from 'react-draggable';
import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";
import {CircularProgress, FormControl, IconButton, InputLabel, MenuItem, Select} from "@mui/material";
import {Close, ThumbDown, ThumbUp} from "@mui/icons-material";
import dbService from "../../services/DbService";
import generateAssignmentService from "../../services/GenerateAssignment";
import INITIAL_CODE from "../../constants/CodeEditorConstants";


const DraggableModal = ({aufgabe, code, onClose, solution}) => {

    // State and setter function
    //const [task, setTask] = useState("");
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

    const updateTaskProperty = async (fieldUpdates) => {
        // Fetch the updatedTask directly from the local state
        console.log("aufgabeInput:")
        console.log(aufgabeInput);
        const updatedTask = {
            ...aufgabeInput,
            ...fieldUpdates
        };
        // Now, perform the asynchronous update with dbService
        const response = await dbService.updateTask(updatedTask);
        // Update the local state and log the updated task after the state has been set
        // Update the local state
        setAufgabeInput({...updatedTask, id: response.id});

    };

    useEffect(() => {
        // Log the updated task when aufgabeInput changes
        // Skip the effect on the initial render
        console.log("UpdateTask Frontend");
        console.log(aufgabeInput);
    }, [aufgabeInput]); // Add aufgabeInput as a dependency to watch for changes

    const handleChange = async (event) => {
        setBegruendung(event.target.value);
        if (begruendung === '') {
            setNewTaskDisabled(true);
            setSolutionDisabled(true);
        }
        await updateTaskProperty({isGoodTask: false, begruendung: event.target.value});
        setIsButtonDisabled(false);
        setSolutionDisabled(true);
        setNewTaskDisabled(false);
    };

    const handleThumbUpClick = async () => {
        if (!isThumbsUpClicked) {
            setThumbsUpClicked(true);
            setThumbsDownClicked(false); // Disable the Thumb Down button
            setSolutionDisabled(false);
            setIsButtonDisabled(false);
            setBegruendung('');
            setNewTaskDisabled(false);
            await updateTaskProperty({isGoodTask: true, begruendung: begruendung});
        } else {
            setThumbsUpClicked(false);
            setIsButtonDisabled(true);
            setSolutionDisabled(true);
            setNewTaskDisabled(true);
        }
    };
    const handleThumbDownClick = async () => {
        if (!isThumbsDownClicked) {
            setThumbsDownClicked(true);
            if (begruendung === "") {
                setIsButtonDisabled(true);
            }
            //await updateTaskProperty({isGoodTask: false,  begruendung: begruendung});
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

    const newTask = async () => {
        try {
            setLoading(true);

            const data = {
                aufgabentyp: aufgabeInput.aufgabentyp,
                schwierigkeitsgrad: aufgabeInput.schwierigkeitsgrad,
                experience: aufgabeInput.experience,
                begruendung: aufgabeInput.begruendung,
                isGoodTask: aufgabeInput.isGoodTask,
                task: aufgabeInput.task
            };

            // Call the sendAssignmentRequest method
            const response = await generateAssignmentService.sendAssignmentRequest(data);

            const responseFromBackend = {
                aufgabentyp: response.aufgabentyp,
                schwierigkeitsgrad: response.schwierigkeitsgrad,
                experience: response.experience,
                task: response.task
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

    const checkSolution = async () => {
        const solutionObject = {
            aufgabe: aufgabeInput.task,
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

    const mapIdToAufgabe = (id) => {
        switch (id) {
            case 0:
                return 'Datentypen & Ausdrücke';
            case 1:
                return 'Arrays';
            case 2:
                return 'Schleifen';
            // Add more cases as needed
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
                            <div>{JSON.parse(aufgabeInput.task).task}</div>
                            <div style={{color: 'red'}}>Erwartetes Ergebnis:</div>
                            <div> {JSON.parse(aufgabeInput.task).erwartetesErgebnis}</div>
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
                                            onClick={() => newTask()}>
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

export default DraggableModal;
