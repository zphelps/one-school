import { useState, useEffect } from 'react'
import {db} from "../../config";
import {doc, onSnapshot} from "firebase/firestore";


export const useDocument = (_collection: string, id: string) => {
    const [document, setDocument] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState(null)

    //realtime data for document
    useEffect(() => {
        setIsPending(true)
        const ref = doc(db, "tenants", "ParkTudorSchoolDev-fse0k", _collection, id)

        const unsub = onSnapshot(ref, snap => {
            if (!snap.exists) {
                // @ts-ignore
                setError('That document does not exist')
                return
            }
            // @ts-ignore
            setDocument({ ...snap.data(), id: snap.id })
            setIsPending(false)
            setError(null)
        }, err => {
            console.log(err.message)
            setIsPending(false)
            // @ts-ignore
            setError('Could not fetch the data for that resource')
        })

        return () => unsub()

    }, [_collection, id])

    return { document, error, isPending }
}
