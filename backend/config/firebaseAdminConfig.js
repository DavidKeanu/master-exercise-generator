const admin = require('firebase-admin');
require('dotenv').config();

try {
    admin.initializeApp({
        credential: admin.credential.cert({
            type: "service_account",
            project_id: "master-aufgabengenerator",
            private_key_id: process.env.FIREBASE_PROJECT_KEY_ID,
            private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace escaped newlines
            client_email: "firebase-adminsdk-bfux0@master-aufgabengenerator.iam.gserviceaccount.com",
            client_id: process.env.FIREBASE_CLIENT_ID,
            auth_uri: "https://accounts.google.com/o/oauth2/auth",
            token_uri: "https://oauth2.googleapis.com/token",
            auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
            client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
        }),
        databaseURL: 'https://master-aufgabengenerator.firebaseio.com',
    });

    const db = admin.firestore();
    module.exports = db;
} catch (error) {
    console.error('Error during Firebase Admin initialization:', error);
    throw error;
}
