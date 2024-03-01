import React, {useEffect, useState} from 'react';
import Draggable from 'react-draggable';
import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";
import {IconButton, Rating} from "@mui/material";
import {Close, ThumbDown, ThumbUp} from "@mui/icons-material";
import {addDoc, collection} from "firebase/firestore";
import {db} from "../config/firebase";


const DraggableModal = ({responseText, onClose}) => {
    // Initial state object
    const initialObject = {
        difficulty: "",
        experience: 4,
        isGoodTask: "",
        task: responseText
    };

    const [starRating, setStarRating] = useState(0);
    // State and setter function
    const [exercise, setExercise] = useState(initialObject);

    // Custom setter function for updating specific properties
    const updateProperty = (property, value) => {
        // Using the callback form of setState to ensure you have the latest state
        setExercise(prevState => {
            return {
                ...prevState,
                [property]: value
            };
        });
    };

    const handleStarRatingChange = async (newValue) => {
        setStarRating(newValue);
        console.log(newValue);

        updateProperty('difficulty', newValue);
    };

    const handleThumbClick = (isThumbsUp) => {
        // Log the result when thumbs up or thumbs down is clicked
        console.log(`Clicked ${isThumbsUp ? 'Thumbs Up' : 'Thumbs Down'}`);
        updateProperty('isGoodTask', isThumbsUp);

    };

    // Function to validate if all fields are set
    const areAllFieldsSet = () => {
        return Object.values(exercise).every(value => value !== "" && value !== undefined);
    };

    // Function to update Firestore collection
    const updateFirestoreCollection = async () => {
        if (areAllFieldsSet()) {
            try {
                const docRef = await addDoc(collection(db, "excercises"), {
                    ...exercise
                });
                console.log('Document added with ID:', docRef.id);
            } catch (error) {
                console.error('Error adding document:', error);
            }
        } else {
            console.warn('Not all fields are set. Skipping Firestore update.');
        }
    };

    useEffect(() => {
        // Check if it's not the initial render
        if (exercise !== initialObject) {
            updateFirestoreCollection(); // Call the async function here
        }
        console.log(exercise); // This will reflect the updated state
    }, [exercise]); // useEffect will run whenever 'exercise' changes


    return (
        <Draggable>
            <div style={{position: 'absolute', zIndex: 1}}>
                {/* Draggable component content */}
                <div style={{backgroundColor: 'white', padding: '16px', border: '1px solid #ccc'}}>
                    <div style={{display: 'flex'}}>
                        <Typography variant="h5">Programmierkonzept Placeholder</Typography>
                        <IconButton style={{marginLeft: 'auto'}} onClick={onClose}>
                            <Close></Close>
                        </IconButton>
                    </div>
                    <div style={{marginBottom: '10px', minWidth: '400px', maxWidth: '600px', fontSize: '16px'}}>
                        {responseText}
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
                                <IconButton color="primary" onClick={() => handleThumbClick(true)}>
                                    <ThumbUp fontSize="small"/>
                                </IconButton>
                                <IconButton color="secondary" onClick={() => handleThumbClick(false)}>
                                    <ThumbDown fontSize="small"/>
                                </IconButton></div>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <div>Schwierigkeitsgrad:</div>
                                <div><Rating name="star-rating" value={starRating} max={3}
                                             onChange={(event, newValue) => handleStarRatingChange(newValue)}/></div>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                                <Button variant="contained" color="success" onClick={onClose}>
                                    Lösung
                                </Button>
                                <Button variant="contained" color="primary" onClick={onClose}>
                                    Neue Aufgabe
                                </Button></div>
                        </div>
                    </div>
                </div>
            </div>
        </Draggable>
    )
        ;
};

export default DraggableModal;
