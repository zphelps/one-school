import type {FC} from "react";
import {useCallback, useMemo} from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import {addMinutes, format} from "date-fns";
import * as Yup from "yup";
import {useFormik} from "formik";
import Trash02Icon from "@untitled-ui/icons-react/build/esm/Trash02";
import {
    Box,
    Button,
    Dialog,
    Divider,
    FormControlLabel,
    FormHelperText,
    IconButton,
    Link,
    Stack,
    SvgIcon,
    Switch,
    TextField,
    TextFieldProps,
    Typography, useTheme
} from "@mui/material";
import {DateTimePicker} from "@mui/x-date-pickers";
// import {useDispatch} from 'src/store';
// import {thunks} from 'src/thunks/calendar';
import type {Group} from "../../types/calendar";
import {Calendar, Lock01, LockUnlocked01, MarkerPin01} from "@untitled-ui/icons-react";
import {useNavigate} from "react-router-dom";
import {paths} from "../../paths";
import {RouterLink} from "../../components/router-link";
import {EventDetailsTiles} from "../events/event-details-tiles";

interface CalendarEventPreviewDialogProps {
    event?: Group;
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
    const theme = useTheme();
    const navigate = useNavigate();

    const handleDelete = useCallback(
        async (): Promise<void> => {
            if (!event) {
                return;
            }

            // try {
            //   await dispatch(thunks.deleteEvent({
            //     eventId: event.id!
            //   }));
            //   onDeleteComplete?.();
            // } catch (err) {
            //   console.error(err);
            // }
        },
        [event, onDeleteComplete]
    );

    return (
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
    );
};

CalendarEventPreviewDialog.propTypes = {
    // @ts-ignore
    event: PropTypes.object,
    onClose: PropTypes.func,
    onDeleteComplete: PropTypes.func,
    open: PropTypes.bool,
};
