// Define the route to add a new document
const admin = require('firebase-admin');
const express = require('express');
const router = express.Router();
/**
 * Handles the addition or update of a task document in the Firestore database.
 *
 * This route handler processes a POST request to either add a new document to the 'aufgaben' collection
 * or update an existing document based on the presence of an ID in the request body.
 *
 * @function
 * @name POST /addOrUpdateTask
 * @param {Object} req - The Express.js request object.
 * @param {Object} res - The Express.js response object.
 * @returns {void}
 * @throws {Error} Throws an error if there is an issue during the document creation or update process.
 * @author David Nutzinger
*/
router.post('/addOrUpdateTask', async (req, res) => {
    try {
        const requestData = req.body;
        const { id, ...dataToUpdate } = requestData;

        if (!id) {
            // If there is no ID in the request body, add a new document
            const db = admin.firestore();
            const newExerciseRef = await db.collection('aufgaben').add(dataToUpdate);
            const newExerciseId = newExerciseRef.id;

            res.status(201).json({ success: true, message: 'Document added successfully', id: newExerciseId });
        } else {
            // If there is an ID, try to update an existing document
            console.info("addOrUpdateTask - Updating existing document");
            const db = admin.firestore();
            const exerciseRef = db.collection('aufgaben').doc(id);
            const existingExercise = await exerciseRef.get();

            if (existingExercise.exists) {
                await exerciseRef.update(dataToUpdate);
                res.status(200).json({ success: true, message: 'Document updated successfully', id: exerciseRef.id });
            } else {
                res.status(404).json({ success: false, error: 'Exercise not found' });
            }
        }
    } catch (error) {
        console.error('Error updating/creating document:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});



module.exports = router;
