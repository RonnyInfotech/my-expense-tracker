import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "./firebase";

export const getAllItems = async (listName) => {
    return await getDocs(collection(db, listName)).then((querySnapshot) => {
        return querySnapshot.docs.map((doc) => ({ ...doc.data(), Id: doc.id }));
    })
};

export const getItemById = async (listName, Id) => {
    const result = await getDoc(doc(db, listName, Id));
    console.log(result.data())
    return result.data();
};

export const filterItem = async (listName, column, value) => {
    const collection_ref = collection(db, listName)
    const q = query(collection_ref, where(column, "==", value))
    const doc_refs = await getDocs(q);
    const result = [];
    doc_refs.forEach(_res => {
        result.push({
            Id: _res.id,
            ..._res.data()
        })
    });
    console.log("result..", result);
    return result;
};

export const addItem = async (listName, itemData) => {
    try {
        const docRef = await addDoc(collection(db, listName), itemData);
        // const docSnapshot = await getDoc(docRef);
        // console.log("doc_refs...", docSnapshot.data());
        return docRef.id;
    } catch (error) {
        console.log(error);
        return error
    }
};

export const updateItem = async (listName, itemId, itemData) => {
    try {
        await updateDoc(doc(db, listName, itemId), itemData);
    } catch (error) {
        console.log(error);
    }
};

export const deleteItem = async (listName, itemId) => {
    try {
        await deleteDoc(doc(db, listName, itemId));
    } catch (error) {
        console.log(error);
    }
};