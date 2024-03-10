const admin = require("firebase-admin");
const addTaskToFirestoreDb = async (documentData) => {
    try {
        console.log()
        const db = admin.firestore();
        const collectionRef = db.collection("exercises");
        console.log(documentData);
        // Add the document to the Firestore collection
        const docRef = await collectionRef.add(documentData);

        // Return the unique ID assigned by Firestore
        return { success: true, documentId: docRef.id };
    } catch (error) {
        console.error('Error adding document to Firestore:', error);
        return { success: false, error: 'Internal Server Error' };
    }
};

module.exports = {
    addTaskToFirestoreDb,
};