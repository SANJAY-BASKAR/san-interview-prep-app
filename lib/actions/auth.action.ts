// since sometimes it may get to client side
// we strictly restrict it using :
'use server';

// start authentication
import {auth, db} from "@/Firebase/admin";
import {cookies} from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7 * 1000;


export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if (userRecord.exists){
            return {
                success: false,
                message: 'User already exists!. Please sign in instead',
            }
        }
        await db.collection('users').doc(uid).set({
            name, email
        })

        return {
            success: true,
            message: 'User successfully created!',
        }
        // for error handling is down
    } catch (e : any){
        console.error('Error creating a user. Try Again Later',e);
        if(e.code === 'auth/email-already-exists') {
            return {
                success: false,
                message: 'Email already exists'
            }
        }

        return {
            success: false,
            message: 'Failed to create a account. Try Again Later',
        }
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);

        if(!userRecord){
            return {
                success: false,
                message: 'User does not exist. Create account instead!',
            }

        }
        
        await setSessionCookies(idToken);
    }catch (e: any){
        console.log(e);

        return {
            success: false,
            message: 'Failed to log in to account',
        }
    }
}

export async function setSessionCookies(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn : ONE_WEEK, // 60 - 60 - 24 - 7 means a week and 1000 is for milliseconds
    })

    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure:process.env.NODE_ENV === 'production',
        path: '/',
        sameSite : 'lax',
    })
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db
            .collection('users')
            .doc(decodedClaims.uid)
            .get();

        if (!userRecord.exists) {
            return null;
        }

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;

    }catch (e: any){
        console.error(e);
        return null;
    }
}

export async function isAuthenticated(){
    const user = await getCurrentUser();
    return !!user; // helps to conver string to boolean value
}