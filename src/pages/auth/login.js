import {FcGoogle} from "react-icons/fc";
import {signInWithPopup, GoogleAuthProvider} from 'firebase/auth';
import { auth } from "../../../utils/firebase";
import { useRouter } from "next/router";
import {useAuthState} from 'react-firebase-hooks/auth';
import { useEffect } from "react";

export default function Login(){

    const route = useRouter();
    const [user, loading] = useAuthState(auth);

    //sign in with google
    const googleProvider = new GoogleAuthProvider();
    const GoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider)
            route.push("/");
        }
        catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if(user){ route.push("/");}
        else { console.log("Login");}
    }, [user]);


    return (
        <div className="login">
            <h2>join today</h2>
            <div>
                <h3>Sign in with one of the providers</h3>
                <button onClick={GoogleLogin} className="google">Sign in with google <FcGoogle /></button>
            </div>
        </div>
    )
}