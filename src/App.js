import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import PasswordRecover from './components/PasswordRecover'
import CreateEvent from './components/CreateEvent'
import {useNavigate,
  Routes,
  Route,
} from 'react-router-dom'
import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { AuthProvider } from './context/authContext';
import { React, useState } from "react";

function App() {
  const [user, setUser] = useState({
    name: "",
    adress: "",
    category: "",
    email: "",
    password: "",
    image: "",
  });
  const [event, setEvent] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const loginWithGoogle = () => {
    const googleProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleProvider);
  };

  const handleGoogleSignIn = async () => {
    await loginWithGoogle();
    navigate("/");
  };

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route exact path="/" element={<Home setUsers={setUsers} users={users} setOpen={setOpen} open={open} setEvent={setEvent} event={event}/>}/>
          <Route exact path="/login" element={<Login setUser={setUser} user={user} handleClick={handleClick} setError={setError} error={error} handleGoogleSignIn={handleGoogleSignIn}/>}/>
          <Route exact path="/register" element={<Register setUser={setUser} user={user} setError={setError} error={error}/>}/>
          <Route exact path="/password_recover" element={<PasswordRecover setError={setError} error={error}/>}/>
          <Route exact path="/create_event" element={<CreateEvent setError={setError} error={error} setEvent={setEvent}/>}/>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
