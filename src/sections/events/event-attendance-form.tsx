import 'react'
import {FC, useCallback, useEffect, useState} from "react";
import {CalendarEvent} from "../../types/calendar";
import {Button, ButtonGroup, Paper} from "@mui/material";
import {useAuth} from "../../hooks/use-auth";
import {useFirestore} from "../../hooks/firebase/useFirestore";

interface EventAttendanceFormProps {
    event?: CalendarEvent;
}

export const EventAttendanceForm: FC<EventAttendanceFormProps> = (props) => {
    const auth = useAuth();
    const {event} = props;
    const {updateDocument, response} = useFirestore("events");
    const [attendance, setAttendance] = useState<"attending" | "maybe" | "notAttending">();

    useEffect(() => {
        if (event?.attendance.attending.includes(auth.user?.id as string)) {
            setAttendance("attending");
        } else if (event?.attendance.maybe.includes(auth.user?.id as string)) {
            setAttendance("maybe");
        } else if (event?.attendance.notAttending.includes(auth.user?.id as string)) {
            setAttendance("notAttending");
        }
    }, [event])

    const handleAttendanceUpdate = useCallback(
        async (newAttendanceStatus: any): Promise<void> => {
            if (!event) {
                return;
            }
            console.log("newAttendanceStatus", newAttendanceStatus)
            console.log(event.id)
            await updateDocument(event.id, {
                attendance: {
                    attending: attendance === "attending"
                        ? event.attendance.attending.filter(id => id !== auth.user?.id)
                        : [...event.attendance.attending, auth.user?.id as string],
                    maybe: attendance === "maybe"
                        ? event.attendance.maybe.filter(id => id !== auth.user?.id)
                        : [...event.attendance.maybe, auth.user?.id as string],
                    notAttending: attendance === "notAttending"
                        ? event.attendance.notAttending.filter(id => id !== auth.user?.id)
                        : [...event.attendance.notAttending, auth.user?.id as string],
                }
            })
            console.log(response)
            setAttendance(newAttendanceStatus)
        },
        [event]
    );
    
    return (
        <ButtonGroup
            variant="outlined"
            aria-label="outlined button group"
        >
            <Button
                onClick={() => handleAttendanceUpdate("attending")}
                sx={{
                    borderRadius: "8px",
                    height: "35px"
                }}
                variant={event?.attendance.attending.includes(auth.user?.id as string) ? "contained" : "outlined"}
            >
                Going
            </Button>
            <Button
                onClick={() => handleAttendanceUpdate("maybe")}
                variant={event?.attendance.maybe.includes(auth.user?.id as string) ? "contained" : "outlined"}
                sx={{
                    borderRadius: "8px",
                    height: "35px"
                }}
            >
                Maybe
            </Button>
            <Button
                onClick={() => handleAttendanceUpdate("notAttending")}
                variant={event?.attendance.notAttending.includes(auth.user?.id as string) ? "contained" : "outlined"}
                sx={{
                    borderRadius: "8px",
                    height: "35px"
                }}
            >
                Not Going
            </Button>
        </ButtonGroup>
    )
}