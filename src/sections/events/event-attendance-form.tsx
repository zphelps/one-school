import 'react'
import {FC, useCallback, useEffect, useState} from "react";
import {Group} from "../../types/calendar";
import {Button, ButtonGroup, Paper, Typography, useMediaQuery, useTheme} from "@mui/material";
import {useAuth} from "../../hooks/use-auth";
import {useFirestore} from "../../hooks/firebase/useFirestore";

interface EventAttendanceFormProps {
    event?: Group;
}

export const EventAttendanceForm: FC<EventAttendanceFormProps> = (props) => {
    const auth = useAuth();
    const {event} = props;
    const {updateDocument, response} = useFirestore("events");
    const [attendance, setAttendance] = useState("");

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const variant = isSmallScreen ? "caption" : "subtitle2";

    useEffect(() => {
        if (event?.attendance?.RSVP?.attending.includes(auth.user?.id as string)) {
            setAttendance('attending');
        } else if (event?.attendance?.RSVP?.maybe.includes(auth.user?.id as string)) {
            setAttendance("maybe");
        } else if (event?.attendance?.RSVP?.notAttending.includes(auth.user?.id as string)) {
            setAttendance("notAttending");
        } else {
            setAttendance("")
        }
    }, [response, event])

    const handleAttendanceUpdate = async (newAttendanceStatus: string) => {

        if (!event) {
            return;
        }

        await updateDocument(event.id, {
            attendance: {
                RSVP: {
                    attending: attendance === "attending"
                        ? event.attendance?.RSVP?.attending.filter(id => id !== auth.user?.id)
                        : newAttendanceStatus == "attending"
                            ? [...event.attendance?.RSVP?.attending!, auth.user?.id as string]
                            : [...event?.attendance?.RSVP?.attending!],
                    maybe: attendance === "maybe"
                        ? event.attendance?.RSVP?.maybe.filter(id => id !== auth.user?.id)
                        : newAttendanceStatus == "maybe"
                            ? [...event.attendance?.RSVP?.maybe!, auth.user?.id as string]
                            : [...event?.attendance?.RSVP?.maybe!],
                    notAttending: attendance === "notAttending"
                        ? event.attendance?.RSVP?.notAttending.filter(id => id !== auth.user?.id)
                        : newAttendanceStatus == "notAttending"
                            ? [...event.attendance?.RSVP?.notAttending!, auth.user?.id as string]
                            : [...event?.attendance?.RSVP?.notAttending!],
                }
            }
        })
    }

    return (
        <ButtonGroup
            sx={{width: "100%"}}
            variant="outlined"
            aria-label="outlined button group"
            disabled={response.isPending}
            className={"attendance-buttons"}
        >
            <Button
                onClick={async (e) => {
                    await handleAttendanceUpdate("attending")
                }}
                sx={{
                    borderRadius: "8px",
                    height: "32px",
                    width: "100%",
                    p:0
                }}
                variant={event?.attendance?.RSVP?.attending.includes(auth.user?.id as string) ? "contained" : "outlined"}
            >
                <Typography
                    variant={variant}
                >
                    Going
                </Typography>
            </Button>
            <Button
                onClick={async (e) => {
                    await handleAttendanceUpdate("maybe")
                }}
                variant={event?.attendance?.RSVP?.maybe.includes(auth.user?.id as string) ? "contained" : "outlined"}
                sx={{
                    borderRadius: "8px",
                    height: "32px",
                    width: "100%",
                    p:0
                }}
            >
                <Typography
                    variant={variant}
                >
                    Maybe
                </Typography>
            </Button>
            <Button
                onClick={async (e) => {
                    await handleAttendanceUpdate("notAttending")
                }}
                variant={event?.attendance?.RSVP?.notAttending.includes(auth.user?.id as string) ? "contained" : "outlined"}
                sx={{
                    borderRadius: "8px",
                    height: "32px",
                    width: "100%",
                    p:0
                }}
            >
                <Typography
                    variant={variant}
                >
                    Not Going
                </Typography>
            </Button>
        </ButtonGroup>
    )
}
