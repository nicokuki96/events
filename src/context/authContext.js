import { React, useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail } from "firebase/auth";
import {auth} from '../firebase'
import { db } from "../firebase";
import { storage } from "../firebase";
import uuid from "react-uuid";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import {  ref, deleteObject } from "firebase/storage";
import moment from "moment/moment";
import 'firebase/compat/firestore';

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

    const getUserData = async () => {
        if (auth.currentUser) {
            const userRef = db.collection("users").doc(auth.currentUser.uid);
            const userDoc = await userRef.get()
                // Verifica si el documento del usuario existe
                if (userDoc.exists) {
                    // Obtiene el nombre del usuario
                    const {adress, category, image, name} = userDoc.data()
                    return {adress, category, image, name }
                }
        }
    }

    const addEvent = async (title, adress, category, eventDate, description, amount, free, image) => {
        const price = Number(amount)
        const cleanAmount = parseInt(price, 10)
        const date = eventDate.format("DD/MM/YYYY")
        const hour = eventDate.format("h:mm a")
        const userRef = db.collection("users").doc(auth?.currentUser?.uid);
        const userDoc = await userRef.get()
            // Verifica si el documento del usuario existe
        if (userDoc.exists) {
            // Obtiene el nombre del usuario
            const name = userDoc.data().name;
            const id = uuid()
            const eventId = name + "_" + id;
            const imageFilePath = `events/${eventId}_${image.name}`;
            const fileRef = storage.ref().child(imageFilePath);
            // Carga el archivo en Firebase Storage
            const snapshot = await fileRef.put(image)
                // Obtiene la URL de descarga del archivo cargado
            const url = await snapshot.ref.getDownloadURL()
                setNameUser(name)
                const newEvent = {
                    id: id,
                    userName: name,
                    category,
                    title,
                    date,
                    hour,
                    objectDate: eventDate.$d,
                    adress,
                    description,
                    amount: cleanAmount,
                    free,
                    image:url,
                    image_name: image.name
                };
                await db.collection("events").doc(eventId).set(newEvent);
                return newEvent;
        }
        else {
            console.log("No se encontró el documento del usuario actual.");
        }
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

    const eventsCurrentUser = async () => {
        const dateTime = new Date();
        const currentDate = moment(dateTime, "DD [de] MMMM [de] YYYY, HH:mm:ss z").toDate();

        if (auth.currentUser) {
            const userRef = db.collection("users").doc(auth.currentUser.uid)
            const snapshotUser = await userRef.get()
            const currentUser = snapshotUser.data().name
            
            const eventsRef = db.collection("events").where("userName", "==", currentUser)
            const snapshotEvent = await eventsRef.get()

            const eventsUser = snapshotEvent.docs.filter(doc => {
                const objectDate = doc?.data().objectDate?.toDate();
                return objectDate > currentDate;
            });
            return eventsUser
        }
    }

    const deleteEvent = async (id, image) => {
        const snapshotEvent = await eventsCurrentUser()
        const idSelected = snapshotEvent.find((doc) => doc.id.includes(id)).id
        const imageDeleteRef = ref(storage, image);
        await deleteObject(imageDeleteRef)
        await deleteDoc(doc(db, "events", idSelected)); 
    }

    const saveEditEvent = async (id, title, adress, category, eventDate, description, price, checked, image) => {
        const eventsRef = db.collection("events").where("id", "==", id)
        const date = eventDate.format("DD/MM/YYYY")
        const hour = eventDate.format("h:mm a")
        const snapshotEvent = await eventsRef.get()
        const docId = snapshotEvent.docs[0].id;
        const eventSelected = doc(db, "events", docId);

        const imageFilePath = `events/${id}`;
        const fileRef = storage.ref().child(imageFilePath);
        await fileRef.put(image);
        const url = await fileRef.getDownloadURL();
        await updateDoc(eventSelected, {
            title: title,
            adress: adress,
            category: category,
            description: description,
            amount: price,
            date: date,
            hour: hour,
            free: checked,
            image_name: image,
            image: url
        });
    }

    return(
        <authContext.Provider value={{signUp, login, userLog, logOut, resetPassword, saveUser, addEvent, getUserData, getEvents, getUsers, eventsCurrentUser, deleteEvent, saveEditEvent}}>
            {children}
        </authContext.Provider>
    )
}