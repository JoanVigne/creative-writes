import Message from "../../components/message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../../utils/firebase";
import { toast } from "react-toastify";
import { arrayUnion, doc, getDoc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Details(){
    const router = useRouter();
    const routeData = router.query;
    const [message, setMessage] = useState('');
    const [allMessage, setAllMessages] = useState([]);
    const [user, loading] = useAuthState(auth);

    // submit a comment
    const submitMessage = async() => {
        // check if log
        if(!auth.currentUser) return router.push('/auth/login');
        
        if(!message){
            toast.error("Don't leave an empty message..", {
                position: toast.POSITION.TOP_CENTER,
                autoClose:1500,
            });
            return;
        };
        // /////////////////////////////////////////////////////
        if(message.length > 200){
            toast.error('Comment is too long... :(', {
                position: toast.POSITION.BOTTOM_CENTER,
                autoClose: 900,
            });

            return;
        };
        const docRef = doc(db, 'posts', routeData.id);
        
        await updateDoc(docRef, {
            comments: arrayUnion({
                message,
                avatar: auth.currentUser.photoURL,
                userName: auth.currentUser.displayName,
                time: Timestamp.now(),
            }),
        });

        setMessage("");
    };
    
    // get comments
    const getComments = async () => {
        const docRef = doc(db, 'posts', routeData.id);
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
     setAllMessages(snapshot.data().comments);
    });
    return unsubscribe;
}
    useEffect(() => {
        if(!router.isReady) return;
        getComments();
    }, [router.isReady])

    return(

        <div className="mainComment">
            <Message {...routeData}>
                <div className="commentSection">
                   
                    <div>
                 {allMessage?.map((message) => (
                            <div className="comment" key={message.time}>
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <img src={message.avatar} alt="" />
                                    <h3>{message.userName}</h3>
                                </div>
                                <p>{message.message}</p>
                            </div>
                        ))}
                </div>
                <div className="postAComment">
                <img src={user.photoURL} alt="avatar" />
                <div className="inputComment">
                        <textarea 
                        className="commentInput"
                        onChange={(e) => setMessage(e.target.value)}
                        type="text"
                        value={message} 
                        placeholder="comment here"/>
                        <button
                        onClick={submitMessage}
                        className="submitComment">Submit</button>
                        </div>
                        <small
                    style={{color : `${message.length > 200 ? "red" : "black"}`}}
                >{message.length}/200</small>
                    </div>
                </div>
               
            </Message>
        </div>
        
    )
}