import {useEffect, useMemo} from "react";
import { useSelector, useDispatch } from "react-redux";
import {collection, onSnapshot, orderBy, query, where, FieldPath} from "firebase/firestore";
import {db} from "../../config";
import {useAuth} from "../use-auth";
import {Status} from "../../utils/status";
import {setPayments, setPaymentsStatus} from "../../slices/payments/payments";

const usePayments = () => {
    const dispatch = useDispatch();
    // @ts-ignore
    const status = useSelector((state) => state.payments.status);

    const auth = useAuth();

    useEffect(() => {
        // @ts-ignore
        let ref = query(collection(db, "tenants", auth.user?.tenantID, "payments"), where("target.id", "in", auth.user?.targetMembership));

        const unsubscribe = onSnapshot(ref,
            (snapshot: { docs: any[]; }) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                dispatch(setPayments(data));
                dispatch(setPaymentsStatus(Status.SUCCESS));
            },
            (error) => {
                console.error("Error listening to Firestore changes:", error);
                dispatch(setPaymentsStatus(Status.ERROR));
            }
        );

        return () => {
            unsubscribe();
        };
    }, [dispatch]);

    return { status };
};

export default usePayments;
