import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import PasswordRecover from './components/PasswordRecover'
import CreateEvent from './components/CreateEvent'
import MyEvents from './components/MyEvents';
import Users from './components/Users';
import {useNavigate,
  Routes,
  Route,
} from 'react-router-dom'
import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { AuthProvider } from './context/authContext';
import { React, useState } from "react";
import dayjs from "dayjs";

function App() {
  const [user, setUser] = useState({
    name: "",
    adress: "",
    category: "",
    email: "",
    password: "",
    image: "",
  });
  const [event, setEvent] = useState();
  const [userPics, setUserPics] = useState([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [userEvents, setUserEvents] = useState();
  const [editEvent, setEditEvent] = useState(false);

  let currentDate = dayjs(new Date().toJSON().slice(0, 10).replace(/-/g, "/"));
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [adress, setAdress] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(currentDate);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const onChangeImage = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setImage(undefined);
      return;
    }
    setImage(e.target.files[0]);
  };

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
          <Route exact path="/" element={<Home setUserPics={setUserPics} userPics={userPics} setOpen={setOpen} open={open} setEvent={setEvent} event={event}/>}/>

          <Route exact path="/users" element={<Users title={title} setTitle={setTitle} userPics={userPics} setUserPics={setUserPics}/>}/>
          
          <Route exact path="/login" element={<Login setUser={setUser} user={user} handleClick={handleClick} setError={setError} error={error} handleGoogleSignIn={handleGoogleSignIn}/>}/>

          <Route exact path="/register" element={<Register setUser={setUser} user={user} setError={setError} error={error}/>}/>

          <Route exact path="/password_recover" element={<PasswordRecover setError={setError} error={error}/>}/>

          <Route exact path="/create_event" element={<CreateEvent date={date} setDate={setDate} checked={checked} setChecked={setChecked} price={price} setPrice={setPrice} description={description} setDescription={setDescription} setAdress={setAdress} adress={adress} setTitle={setTitle} title={title} setImage={setImage} image={image} category={category} setCategory={setCategory} currentDate={currentDate} onChangeImage={onChangeImage} editEvent={editEvent} setError={setError} error={error} setEvent={setEvent} setEditEvent={setEditEvent} event={event} handleClick={handleClick} setIsLoading={setIsLoading} isLoading={isLoading}/>}/>

          <Route exact path="/my_events" element={<MyEvents currentDate={currentDate} onChangeImage={onChangeImage} date={date} setDate={setDate} checked={checked} setChecked={setChecked} price={price} setPrice={setPrice} description={description} setDescription={setDescription} setAdress={setAdress} adress={adress} setTitle={setTitle} title={title} setImage={setImage} image={image} category={category} setCategory={setCategory} editEvent={editEvent} setEditEvent={setEditEvent} userEvents={userEvents} setUserEvents={setUserEvents} setEvent={setEvent} event={event} setError={setError} error={error} setIsLoading={setIsLoading} isLoading={isLoading} setOpen={setOpen} open={open} handleClick={handleClick} setSearch={setSearch} search={search}/>}/>

        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
