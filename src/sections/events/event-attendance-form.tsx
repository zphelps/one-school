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
    const [attendance, setAttendance] = useState("");

    useEffect(() => {
        if (event?.attendance.attending.includes(auth.user?.id as string)) {
            setAttendance('attending');
        } else if (event?.attendance.maybe.includes(auth.user?.id as string)) {
            setAttendance("maybe");
        } else if (event?.attendance.notAttending.includes(auth.user?.id as string)) {
            setAttendance("notAttending");
        } else {
            setAttendance("")
        }
    }, [response])

    const handleAttendanceUpdate = async (newAttendanceStatus: string) => {
        if (!event) {
            return;
        }

        await updateDocument(event.id, {
            attendance: {
                attending: attendance === "attending"
                    ? event.attendance.attending.filter(id => id !== auth.user?.id)
                    : newAttendanceStatus == "attending"
                        ? [...event.attendance.attending, auth.user?.id as string]
                        : [...event?.attendance.attending],
                maybe: attendance === "maybe"
                    ? event.attendance.maybe.filter(id => id !== auth.user?.id)
                    : newAttendanceStatus == "maybe"
                        ? [...event.attendance.maybe, auth.user?.id as string]
                        : [...event?.attendance.maybe],
                notAttending: attendance === "notAttending"
                    ? event.attendance.notAttending.filter(id => id !== auth.user?.id)
                    : newAttendanceStatus == "notAttending"
                        ? [...event.attendance.notAttending, auth.user?.id as string]
                        : [...event?.attendance.notAttending],
            }
        })
    }

    return (
        <ButtonGroup
            variant="outlined"
            aria-label="outlined button group"
            disabled={response.isPending}
        >
            <Button
                onClick={() => handleAttendanceUpdate("attending")}
                sx={{
                    borderRadius: "8px",
                    height: "32px"
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
                    height: "32px"
                }}
            >
                Maybe
            </Button>
            <Button
                onClick={() => handleAttendanceUpdate("notAttending")}
                variant={event?.attendance.notAttending.includes(auth.user?.id as string) ? "contained" : "outlined"}
                sx={{
                    borderRadius: "8px",
                    height: "32px"
                }}
            >
                Not Going
            </Button>
        </ButtonGroup>
    )
}