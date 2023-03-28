import { React, useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail ,sendEmailVerification } from "firebase/auth";
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

export const saveUser = (email, password, name, adress, image, category) => {
    const imageFilePath = `users/${auth.currentUser.uid}_${name}`;
    const file = storage.ref().child(imageFilePath);
    // Carga el archivo en Firebase Storage
    file.put(image).then((snapshot) => {
        // Obtiene la URL de descarga del archivo cargado
        snapshot.ref.getDownloadURL().then((url) => {
            file.put(image);
            db.collection("users").doc(auth.currentUser.uid).set({
                email,
                password,
                name,
                adress,
                category,
                creationDate: new Date().toLocaleString() + "",
                displayName: auth.currentUser.displayName,
                image:url
            });
        });
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
            await userRef.get().then((userDoc) => {
                // Verifica si el documento del usuario existe
                if (userDoc.exists) {
                    // Obtiene el nombre del usuario
                    const adress = userDoc.data().adress;
                    console.log(adress)
                    return adress
                }
            })
        }
    }

    const addEvent = (title, adress, category, eventDate, description, amount, free, image) => {
        const date = eventDate.format("DD/MM/YYYY")
        const hour = eventDate.format("h:mm a")
        const userRef = db.collection("users").doc(auth.currentUser.uid);
        userRef.get().then((userDoc) => {
            // Verifica si el documento del usuario existe
            if (userDoc.exists) {
            // Obtiene el nombre del usuario
            const name = userDoc.data().name;
            const id = uuid()
            const eventId = name + "_" + id;
            const imageFilePath = `events/${eventId}_${image.name}`;
            const fileRef = storage.ref().child(imageFilePath);
            // Carga el archivo en Firebase Storage
            fileRef.put(image).then((snapshot) => {
                // Obtiene la URL de descarga del archivo cargado
                snapshot.ref.getDownloadURL().then((url) => {
                    setNameUser(name)
                    db.collection("events").doc(eventId).set({
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
                    });
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