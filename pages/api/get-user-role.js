// pages/api/get-user-role.js
import { auth } from '../../lib/firebase-admin';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { uid } = req.body;

    if (!uid) {
        return res.status(400).json({ message: 'Missing user ID' });
    }

    try {
        // Use the Admin SDK to fetch the user's custom claims
        const userRecord = await auth.getUser(uid);
        const role = userRecord.customClaims?.role || 'user';

        res.status(200).json({ role });
    } catch (error) {
        console.error('Error fetching user role:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}