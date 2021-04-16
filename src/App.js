import React, { useState, useRef } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/fontawesome.min.css";
import "./App.css";

firebase.initializeApp({
  apiKey: "AIzaSyCANt_Th2lRYnAkgngXkjvl4zN3ValmvH0",
  authDomain: "chattingapp-e6186.firebaseapp.com",
  databaseURL:
    "https://chattingapp-e6186-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chattingapp-e6186",
  storageBucket: "chattingapp-e6186.appspot.com",
  messagingSenderId: "743370907162",
  appId: "1:743370907162:web:d7259fa8303b5f7f8ebba3",
  measurementId: "G-XFZG9JLTTS",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

export default function App() {
  const [user] = useAuthState(auth);

  return (
    <div>
      <header></header>
      <div className="header">
        <SignOut />
      </div>
      <section>{user ? <ChatRoom></ChatRoom> : <SignIn></SignIn>}</section>
    </div>
  );
}

function SignIn() {
  const signInwidthGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return (
    <div className="login container">
      <label>Alex's chat app</label>
      <button className="btn btn-danger btn-block" onClick={signInwidthGoogle}>
        <i class="fab fa-google"></i> Sign in with <b>Google</b>
      </button>
    </div>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button
        className="btn btn-primary button-signout"
        onClick={() => auth.signOut()}
      >
        Sign Out
      </button>
    )
  );
}

function ChatRoom() {
  const scrolldown = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt", "desc").limit(11);
  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });
    setFormValue("");
    scrolldown.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main className="background-chat">
        {messages &&
          messages
            .map((msg) => <ChatMessage key={msg.id} message={msg} />)
            .reverse()}
        <div ref={scrolldown}></div>
      </main>

      <form className="input-group form mb-3" onSubmit={sendMessage}>
        <input
          className="form-control"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        ></input>
        <div className="input-group-append">
          <button className="btn btn-outline-secondary" type="submit">
            Submit
          </button>
        </div>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  return (
    <div className={`message-${messageClass}`}>
      <img src={photoURL} className="image" alt="imagegoogle"></img>
      <p className={`text-${messageClass}`}>{text}</p>
    </div>
  );
}
