import Head from 'next/head';
import Message from '../../components/message';
import { useEffect, useState } from 'react';
import { db } from '../../utils/firebase';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';



export default function Home() {
  // create a state with all the posts
  const [allPosts, setAllPosts] = useState([]);
  const [display, setDisplay] = useState("");
  
  const getPosts = async () => {
    const collectionRef = collection(db, "posts"); 
    const q = query(collectionRef, orderBy('timeStamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id})));
    });
    return unsubscribe;
  };

  useEffect(() => {
    getPosts();
 
  }, []);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='mainHome'>
        <h1>What's up today?</h1>
        <Link className="postButton" href="/post">Post something</Link>
        <div>
        {allPosts.map(post => {
          return (
          <Message {...post} key={post.id}>          

          {post.comments? 
          <div >
          <h4>{post.comments?.length > 0 ? post.comments?.length : 0 } comments
            <button className="hideShow" 
            onClick={() => {display == ""? setDisplay("none"): setDisplay("")}}>
               {display == ""? "hide comments": "show comments"}
               </button></h4>

            {post.comments.map(comment => {
              return (
                <div style={{ display: `${display}`}}>
                <h5 className='comments' key={comment.id}><img src={comment.avatar} alt="avatar" />     
           <small>{comment.message}</small>
                </h5>
                </div>
                
              )
            })}
            </div>

            : ""
          }
            <Link href={{ pathname: `/${post.id}`, query:{...post}}}>
            <button className='commentButton'>click here to comment</button>
            </Link>

          </Message>
        )
      })}
      </div>
      </div>
    </>
  )
}
