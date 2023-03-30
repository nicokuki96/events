import { React, useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail } from "firebase/auth";
import {auth} from '../firebase'
import { db } from "../firebase";
import { storage } from "../firebase";
import uuid from "react-uuid";

export const authContext = createContext()

export const useAuth = () => {
    const context = useContext(authContext)
    if(!context) throw new Error('There is no provider')
    return context
}

export const saveUser = (email, password, name, adress, image, category, imageName) => {
    const imageFilePath = `users/${auth.currentUser.uid}_${imageName}`;
    const file = storage.ref().child(imageFilePath);
    file.put(image);
    return db.collection("users").doc(auth.currentUser.uid).set({
        email,
        password,
        name,
        adress,
        category,
        creationDate: new Date().toLocaleString() + "",
        displayName: auth.currentUser.displayName,
        image:imageName
    });
}

export const AuthProvider = ({children}) => {
    const [userLog, setUserLog] = useState(null)
    const [nameUser, setNameUser] = useState("");
    // si no tiene llaves, el return es automatico
    const signUp = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }
    const resetPassword = async (email) => {
        await sendPasswordResetEmail(auth, email)
    }

    // esto no funciona
    const getUserData = async () => {
        if (auth.currentUser) {
            const userRef = db.collection("users").doc(auth.currentUser.uid);
            return userRef.get().then((userDoc) => {
                // Verifica si el documento del usuario existe
                if (userDoc.exists) {
                    // Obtiene el nombre del usuario
                    const {adress, category, image, name} = userDoc.data()
                    return {adress, category, image, name }
                }
            })
        }
    }

    const addEvent = (title, adress, category, eventDate, description, amount, free, image) => {
        const date = eventDate.format("DD/MM/YYYY")
        const hour = eventDate.format("h:mm a")
        const userRef = db.collection("users").doc(auth.currentUser.uid);
        return userRef.get().then((userDoc) => {
            // Verifica si el documento del usuario existe
            if (userDoc.exists) {
            // Obtiene el nombre del usuario
            const name = userDoc.data().name;
            const id = uuid()
            const eventId = name + "_" + id;
            const imageFilePath = `events/${eventId}_${image.name}`;
            const fileRef = storage.ref().child(imageFilePath);
            // Carga el archivo en Firebase Storage
            return fileRef.put(image).then((snapshot) => {
                // Obtiene la URL de descarga del archivo cargado
                return snapshot.ref.getDownloadURL().then(async (url) => {
                    setNameUser(name)
                    const newEvent = {
                        id: id,
                        userName: name,
                        category,
                        title,
                        date,
                        hour,
                        adress,
                        description,
                        amount,
                        free,
                        image:url
                    };
                    await db.collection("events").doc(eventId).set(newEvent);
                    return newEvent;
                });
            });  
            }
            else {
                console.log("No se encontró el documento del usuario actual.");
            }
        })
        .catch((error) => {
            console.log("Error al obtener el documento del usuario actual:", error.message);
        }); 
    }


    const login = (email, password) => signInWithEmailAndPassword(auth, email, password)
    const logOut = () => signOut(auth)

    // estado que guarda si hay un usuario logueado o no
    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUserLog(currentUser)
        })
    },[])
    
    const getEvents = async () => {
        const collectionRef = db.collection("events");
        const data = await collectionRef.get()
        return data
    }

    const getUsers = async () => {
        const collectionRef = db.collection("users");
        const data = await collectionRef.get()
        return data
    }

    return(
        <authContext.Provider value={{signUp, login, userLog, logOut, resetPassword, saveUser, addEvent, getUserData, getEvents, getUsers}}>
            {children}
        </authContext.Provider>
    )
}