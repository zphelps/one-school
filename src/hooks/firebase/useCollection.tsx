import { useEffect, useState, useRef, SetStateAction} from "react"
import {db} from "../../config";
import {collection, onSnapshot, query, doc, where} from "firebase/firestore";

export const useCollection = (_collection: any, _queries: any[], _orderBy: any[]) => {
    const [documents, setDocuments] = useState(null)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)

    useEffect(() => {
        try {
            setIsPending(true)
            let ref = collection(db, "tenants")
            // @ts-ignore
            ref = doc(ref, "ParkTudorSchoolDev-fse0k")

            if(_collection.includes("/")) {
                const pathSegments = _collection.split('/');
                for (let i = 0; i < pathSegments.length; i++) {
                    if (i % 2 === 0) {
                        // @ts-ignore
                        ref = collection(ref || db, pathSegments[i]);
                    } else {
                        // @ts-ignore
                        ref = doc(ref, pathSegments[i]);
                    }
                }
            } else {
                // @ts-ignore
                ref = collection(ref, _collection);
            }

            if (_queries) {
                // @ts-ignore
                ref = query(ref, where(..._queries))
            }
            // if (_orderBy) {
            //     // @ts-ignore
            //     ref = orderBy(ref, ..._orderBy)
            // }

            const unsubscribe = onSnapshot(ref, (snapshot) => {
                // @ts-ignore
                let results = []
                snapshot.docs.forEach(doc => {
                    // @ts-ignore
                    results.push({ ...doc.data(), id: doc.id })
                });

                // update state
                // @ts-ignore
                setDocuments(results)
                setError(null)
                setIsPending(false)
            }, error => {
                console.log(error)
                // @ts-ignore
                setError('could not fetch the data')
                setIsPending(false)
            })

            // unsubscribe on unmount
            return () => unsubscribe()

        } catch (e) {
            console.log(e)
        }

    }, [collection, JSON.stringify(_queries), JSON.stringify(_orderBy)])

    return { documents, error, isPending }
}
