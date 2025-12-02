// lib/firebase-admin.js
const admin = require("firebase-admin");

// Check if the app has already been initialized
if (!admin.apps.length) {
    // You must get the content from an environment variable for security
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = {
    db,
    auth,
    admin // Export the full admin object for other services
};