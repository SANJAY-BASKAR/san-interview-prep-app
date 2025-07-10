import {cert, getApps} from 'firebase-admin/app'
import {initializeApp} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";
import {getFirestore} from "firebase-admin/firestore";

const initFirebaseAdmin = () => {
    const apps = getApps();

    // ensures only one firebase sdk is taken place
    if (!apps.length)
    {
        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // this helps to get rid of the string unecessary content at the start and the end
            })
        })
    }
    return {
        auth: getAuth(),
        db: getFirestore()

    }
}

export const { auth , db } = initFirebaseAdmin();