import type {FC} from "react";
import {useCallback, useEffect} from "react";
import PropTypes from "prop-types";
import Trash02Icon from "@untitled-ui/icons-react/build/esm/Trash02";
import {
    Box,
    Button,
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

interface CalendarEventPreviewDialogProps {
    event?: Event;
    onClose?: () => void;
    onDeleteComplete?: () => void;
    open?: boolean;
}

const cacheImages = async (srcArray: string[]) => {
    const promises = srcArray.map((src) => {
        return new Promise<void>(function (resolve, reject) {
            const img = new Image();
            img.src = src;
            // @ts-ignore
            img.onload = resolve();
            // @ts-ignore
            img.onerror = reject();
        })
    });
    await Promise.all(promises);
};

export const CalendarEventPreviewDialog: FC<CalendarEventPreviewDialogProps> = (props) => {
    const {
        event,
        onClose,
        onDeleteComplete,
        open = false,
    } = props;

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

    useEffect(() => {
        cacheImages([event?.imageURL!]);
    }, [event]);

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
