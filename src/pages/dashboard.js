import { auth, db } from "../../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import Message from "../../components/message";
import {BsTrash2Fill} from 'react-icons/bs';
import {AiFillEdit} from 'react-icons/ai'
import Link from "next/link";


export default function Dashboard() {

    const route = useRouter();
    const [user, loading] = useAuthState(auth);
    const [posts, setPosts] = useState([]);

    // see if user is logged
    const getData = async () => {
        if(loading) return;
        if(!user) return route.push("/auth/login");

        const collectionRef = collection(db, 'posts');
        const q = query(collectionRef, where('user', '==', user.uid), orderBy("timeStamp", "desc") );
        const unsubscribe = onSnapshot(q, (snapshot => {
            setPosts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
        }));
        return unsubscribe;
    };

    // delete post
    const deletePost = async (id) => {
        const docRef = doc(db, 'posts', id);
        await deleteDoc(docRef);
    }

    // get users data
    useEffect(() => {
        getData();
    }, [user, loading]);

    return(
        <div className="mainDashboard">
            <h1>Your posts</h1>
            <div>
                {posts.map(post => {
                    return (
                    <Message {...post} key={post.id}>
                        <div>
                            <Link href={{pathname: "/post", query:post }}>
                            <button className="edit"><AiFillEdit/> Edit</button>
                            </Link>
                            <button className="delete" onClick={() => deletePost(post.id)}><BsTrash2Fill /> Delete</button>
                        </div>
                    </Message>
                    )
                })}
            </div>
            <button className="signout" onClick={() => auth.signOut()}>Sign out</button>
        </div>
    )
}