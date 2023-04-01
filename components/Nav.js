import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";

export default function Nav(){
    const[user, loading] = useAuthState(auth);

    const [displayMenu, setDisplayMenu] = useState("hidden");


    return(
        <nav>
            <Link href="/">
            <button>Creative Minds</button>
            </Link>
            <div>
                {!user && (
                <Link href={'/auth/login'}>
                   Join Now
                </Link>
                )}
                {user && (
                    <div className="loggedIn">
                    
                        <div className="loginlogout">

                        
                     <img onClick={() => {displayMenu == "hidden"? setDisplayMenu("visible"): setDisplayMenu("hidden") }} src={user.photoURL} alt="photo user" />
                   
                    <div style={{ visibility: displayMenu}} className="displayMenu">

                       

                        <button onClick={() => setDisplayMenu("hidden") }>
                            <Link href="/dashboard">My profile</Link>
                            </button>
                            <button onClick={() => setDisplayMenu("hidden") }>
                            <Link href="/post">Post something</Link></button>
                        <button className="signout" onClick={() => auth.signOut()}>Sign out</button>
                        </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}