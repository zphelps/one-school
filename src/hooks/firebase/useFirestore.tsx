import { useReducer, useEffect, useState } from "react"
import {collection, doc, setDoc, deleteDoc, updateDoc} from "firebase/firestore";
import {db} from "../../config";


let initialState = {
    document: null,
    isPending: false,
    error: null,
    success: null
}

// @ts-ignore
const firestoreReducer = (state, action) => {
    switch (action.type) {
        case 'IS_PENDING':
            return { isPending: true, document: null, success: false, error: null }
        case 'ADDED_DOCUMENT':
            return { isPending: false, document: action.payload, success: true, error: null }
        case 'DELETED_DOCUMENT':
            return { isPending: false, document: null, success: true, error: null }
        case 'UPDATED_DOCUMENT':
            return { isPending: false, document: action.payload, success: true, error: null }
        case 'ERROR':
            return { isPending: false, document: null, success: false, error: action.payload }
        default:
            return state
    }
}

// @ts-ignore
export const useFirestore = (_collection) => {
    const [response, dispatch] = useReducer(firestoreReducer, initialState)
    const [isCancelled, setIsCancelled] = useState(false)

    // collection ref
    const ref = collection(db, "tenants", "ParkTudorSchoolDev-fse0k", _collection)

    // only dispatch is not cancelled
    // @ts-ignore
    const dispatchIfNotCancelled = (action) => {
        if (!isCancelled) {
            dispatch(action)
        }
    }

    // add a document
    // @ts-ignore
    const addDocument = async (document) => {
        // @ts-ignore
        dispatch({ type: 'IS_PENDING' })

        try {
            const addedDocument = await setDoc(doc(ref, document.id), { ...document })
            dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: addedDocument })
        }
        catch (err) {
            // @ts-ignore
            dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
        }
    }

    // delete a document
    // @ts-ignore
    const deleteDocument = async (id) => {
        dispatch({ type: 'IS_PENDING' })

        try {
            await deleteDoc(doc(ref, id))
            dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT' })
        }
        catch (err) {
            dispatchIfNotCancelled({ type: 'ERROR', payload: 'could not delete' })
        }
    }

    //update document
    // @ts-ignore
    const updateDocument = async (id, updatedFields) => {
        dispatch({ type: 'IS_PENDING' })

        try {
            const updatedDocument = await updateDoc(doc(ref, id), updatedFields)
            dispatchIfNotCancelled({ type: 'UPDATED_DOCUMENT', payload: updateDocument })
            return updatedDocument
        }
        catch (err) {
            // @ts-ignore
            dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
            return null
        }
    }

    useEffect(() => {
        setIsCancelled(false) // add this line
        return () => setIsCancelled(true)
    }, [])

    return { addDocument, deleteDocument, updateDocument, response }

}
