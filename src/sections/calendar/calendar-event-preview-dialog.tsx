import type {FC} from "react";
import React, {useCallback, useEffect, useState} from "react";
import PropTypes from "prop-types";
import Trash02Icon from "@untitled-ui/icons-react/build/esm/Trash02";
import {
    Backdrop,
    Box,
    Button, CircularProgress,
    Dialog,
    Divider,
    IconButton,
    Stack,
    SvgIcon,
    Typography,
} from "@mui/material";
import {paths} from "../../paths";
import {RouterLink} from "../../components/router-link";
import {EventDetailsTiles} from "../events/event-details-tiles";
import {Event} from "../../types/calendar";
import {cacheImages} from "../../utils/cache-image";
import {httpsCallable} from "firebase/functions";
import {functions} from "../../config";
import toast from "react-hot-toast";
import {useAuth} from "../../hooks/use-auth";
import {useNavigate} from "react-router-dom";

interface CalendarEventPreviewDialogProps {
    event?: Event;
    onClose?: () => void;
    onDeleteComplete?: () => void;
    open?: boolean;
}

export const CalendarEventPreviewDialog: FC<CalendarEventPreviewDialogProps> = (props) => {
    const {
        event,
        onClose,
        onDeleteComplete,
        open = false,
    } = props;

    const [deleting, setDeleting] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();

    const handleDelete = async () => {
        setDeleting(true)
        onClose?.();
        const deleteEvent = httpsCallable(functions, 'deleteEvent');
        const result = await deleteEvent({event: event, tenantID: auth.user?.tenantID});
        if (result.data) {
            navigate(0)
            toast.success('Event deleted!');
        } else {
            toast.error('Something went wrong!');
        }
        setDeleting(false)
    }

    useEffect(() => {
        cacheImages([event?.imageURL!]);
    }, [event]);

    return (
        <>
            <Dialog
                fullWidth
                onClose={onClose}
                open={open}
                sx={{
                    '& .MuiDialog-paper': {
                        margin: 0,
                        width: '100%',
                    },
                }}
            >
                <Box sx={{p: 3}}>
                    <Typography
                        align="center"
                        variant="h5"
                    >
                        {
                            event?.title
                        }
                    </Typography>
                </Box>
                <Divider/>
                <Box sx={{p:3}}>
                    <EventDetailsTiles event={event}/>
                </Box>
                <Divider/>
                <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="space-between"
                    spacing={1}
                    sx={{p: 2}}
                >
                    {event && (
                        <IconButton onClick={(): Promise<void> => handleDelete()}>
                            <SvgIcon>
                                <Trash02Icon/>
                            </SvgIcon>
                        </IconButton>
                    )}
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={1}
                    >
                        <Button
                            color="inherit"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            component={RouterLink}
                            href={paths.events + `/${event?.id}`}
                        >
                            View Event
                        </Button>
                    </Stack>
                </Stack>
            </Dialog>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 5 }}
                open={deleting}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
};

CalendarEventPreviewDialog.propTypes = {
    // @ts-ignore
    event: PropTypes.object,
    onClose: PropTypes.func,
    onDeleteComplete: PropTypes.func,
    open: PropTypes.bool,
};
