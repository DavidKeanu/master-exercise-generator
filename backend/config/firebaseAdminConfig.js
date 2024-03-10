const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://master-aufgabengenerator.firebaseio.com',
    });

    const db = admin.firestore();
    module.exports = db;
} catch (error) {
    console.error('Error during Firebase Admin initialization:', error);
    throw error;
}
