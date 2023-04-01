import { auth, db } from "../../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import {useEffect, useState} from 'react';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import {toast} from 'react-toastify';

export default function Post(){
    // form state
    const [post, setPost] = useState({description:""});
    const [user, loading] = useAuthState(auth);
    const route = useRouter();
    const routeData = route.query;

    const submitPost = async (e) => {
        e.preventDefault();

        // run checks for description
        if(!post.description){
            toast.error('description field empty ! :)', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
            });
            
            return;
        };
        if(post.description.length > 300){
            toast.error('Description is too long... :(', {
                position: toast.POSITION.BOTTOM_CENTER,
                autoClose: 900,
            });

            return;
        };
        
        if(post?.hasOwnProperty("id")){
            const docRef = doc(db, 'posts', post.id);
            const updatedPost = {...post, timestamp: serverTimestamp()}
            await updateDoc(docRef, updatedPost);
        
            return route.push('/');
            }
        else {
        // make a new post
        const collectionRef = collection(db, 'posts');

        await addDoc(collectionRef, {...post,
    timeStamp:serverTimestamp(),
    user: user.uid,
    avatar: user.photoURL,
    username: user.displayName, 

});
setPost({ description: ""});
toast.success(`${user.displayName} posted something`, {position: toast.POSITION.TOP_CENTER, autoClose: 1500})
return route.push('/');
};
        }

    // check user
    const checkUser = async () => {
        if(loading) return;
        if(!user) route.push("/auth/login");
        if(routeData.id){
            setPost({description: routeData.description, id: routeData.id})
        }
    };

    useEffect(() => {
        checkUser();
    }, [user, loading]);

    return(
        <div className="post">
            <form onSubmit={submitPost}>
                {/* this h2 condition if edit or new post */}
                <h2>{post.hasOwnProperty("id") ? "Edit your post" : "Create a new post"}</h2>
                <div>
                    <h3>Description</h3>
                    <textarea value={post.description}
                    onChange={(e) => setPost({...post, description: e.target.value})}></textarea>
                    <p
                    style={{color : `${post.description.length > 300 ? "red" : "black"}`}}
                >{post.description.length}/300</p>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}