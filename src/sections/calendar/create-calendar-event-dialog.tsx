import type {FC, JSXElementConstructor, Key, ReactElement, ReactFragment, ReactPortal} from "react";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import {addMinutes} from "date-fns";
import * as Yup from "yup";
import {useFormik} from "formik";
import Trash02Icon from "@untitled-ui/icons-react/build/esm/Trash02";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// @ts-ignore
import parse from "autosuggest-highlight/parse";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
    Accordion, AccordionDetails, AccordionSummary,
    Autocomplete, Avatar,
    Box,
    Button, CircularProgress, debounce,
    Dialog,
    Divider,
    FormControlLabel,
    FormHelperText, Grid,
    IconButton,
    Stack,
    SvgIcon,
    Switch,
    TextField,
    TextFieldProps,
    Typography
} from "@mui/material";
// import {useDispatch} from 'src/store';
// import {thunks} from 'src/thunks/calendar';
import type {CalendarEvent} from "../../types/calendar";
import {DateTimePicker} from "@mui/x-date-pickers";
import {v4 as uuidv4} from "uuid";
import {enumToArray} from "../../utils/enum";
import {Visibility} from "../../utils/visibility";
import {useCollection} from "../../hooks/firebase/useCollection";
import CalendarEvents from "../../slices/events/calendar-events";
import {Calendar, Ticket01, Ticket02} from "@untitled-ui/icons-react";
import {Rsvp} from "@mui/icons-material";
import {httpsCallable} from "firebase/functions";
import {functions} from "../../config";
import {useAuth} from "../../hooks/use-auth";
import {useNavigate} from "react-router-dom";

const GOOGLE_MAPS_API_KEY = "AIzaSyC_G41bRZ4HKG0cxLOTElatucbkn8mDbuE";

function loadScript(src: string, position: HTMLElement | null, id: string) {
    if (!position) {
        return;
    }

    const script = document.createElement("script");
    script.setAttribute("async", "");
    script.setAttribute("id", id);
    script.src = src;
    position.appendChild(script);
}

const autocompleteService = {current: null};

interface MainTextMatchedSubstrings {
    offset: number;
    length: number;
}

interface StructuredFormatting {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings?: readonly MainTextMatchedSubstrings[];
}

interface PlaceType {
    description: string;
    structured_formatting: StructuredFormatting;
}

enum LocationType {
    IN_PERSON = "In-Person",
    VIRTUAL = "Virtual",
}

interface Values {
    id: string;
    group: {
        id: string | undefined;
        name: string | undefined;
        imageURL: string | undefined;
        type: string | undefined;
    } | null;
    location: {
        formattedAddress: string | null;
        mapImageURL: string | null;
        name: string | null;
        format: string | null;
        description: string | null;
    };
    targetIDs: string[];
    attendance: {
        attending: string[];
        maybe: string[];
        notAttending: string[];
    } | null;
    allDay: boolean;
    color?: string;
    description: string;
    title: string;
    imageURL: string | null;
    end: Date;
    gameID: string | null;
    start: Date;
    visibility: string;
    submit: null;
}

const useInitialValues = (
    event?: CalendarEvent,
): Values => {
    return useMemo(
        (): Values => {
            if (event) {
                return {
                    id: event.id,
                    group: event.group,
                    location: event.location,
                    targetIDs: event.targetIDs,
                    visibility: event.public ? Visibility.PUBLIC : Visibility.MEMBERS_ONLY,
                    attendance: event.attendance,
                    imageURL: event.imageURL,
                    allDay: event.allDay || false,
                    color: event.color || "",
                    description: event.description || "",
                    end: event.end ? new Date(event.end) : addMinutes(new Date(), 30),
                    start: event.start ? new Date(event.start) : new Date(),
                    title: event.title || "",
                    gameID: event.gameID,
                    submit: null
                };
            }

            return {
                id: uuidv4(),
                group: null,
                location: {
                    formattedAddress: null,
                    mapImageURL: null,
                    name: null,
                    format: null,
                    description: null
                },
                targetIDs: [],
                visibility: Visibility.MEMBERS_ONLY,
                attendance: null,
                imageURL: null,
                allDay: false,
                color: "",
                description: "",
                end: addMinutes(new Date(), 30),
                start: new Date(),
                title: "",
                gameID: null,
                submit: null
            };
        },
        [event]
    );
};

const validationSchema = Yup.object({
    allDay: Yup.bool(),
    description: Yup.string().max(5000),
    end: Yup.date(),
    start: Yup.date(),
    group: Yup.object({
        id: Yup.string().min(10),
        name: Yup.string(),
        imageURL: Yup.string(),
        type: Yup.string()
    }).required("Please select a group"),
    location: Yup.object({
        name: Yup.string(),
        format: Yup.string(),
    }).required("Please select a location"),
    public: Yup.bool(),
    title: Yup
        .string()
        .max(255)
        .required("Title is required")
});

type Action = "create" | "update"

interface CalendarEventDialogProps {
    action?: Action;
    event?: CalendarEvent;
    onAddComplete?: () => void;
    onClose?: () => void;
    onDeleteComplete?: () => void;
    onEditComplete?: () => void;
    open?: boolean;
}

export const CreateCalendarEventDialog: FC<CalendarEventDialogProps> = (props) => {
    const {
        action = "create",
        event,
        onAddComplete,
        onClose,
        onDeleteComplete,
        onEditComplete,
        open = false,
    } = props;
    const auth = useAuth();
    const navigate = useNavigate();
    const initialValues = useInitialValues(event);
    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: async (values, helpers): Promise<void> => {
            try {
                const data = {
                    id: values.id,
                    group: values.group,
                    location: values.location,
                    targetIDs: values.targetIDs,
                    public: values.visibility != Visibility.MEMBERS_ONLY,
                    attendance: values.attendance,
                    imageURL: values.imageURL,
                    allDay: values.allDay,
                    description: values.description,
                    gameID: values.gameID,
                    end: values.end.getTime(),
                    start: values.start.getTime(),
                    title: values.title,
                };

                if (action === "update") {
                    // await dispatch(thunks.updateEvent({
                    //     eventId: event!.id,
                    //     update: data
                    // }));
                    // toast.success("Event updated");
                } else {
                    const createEvent = httpsCallable(functions, "createEvent");
                    const result = await createEvent({event: data, tenantID: auth.user?.tenantID});
                    if (result.data) {
                        formik.resetForm();
                        // @ts-ignore
                        navigate(`/events/${data.id}`)
                        toast.success("Event created");
                    } else {
                        toast.error("Something went wrong!");
                    }
                }

                if (action === "update") {
                    onEditComplete?.();
                } else {
                    onAddComplete?.();
                }
            } catch (err) {
                console.error(err);
                toast.error("Something went wrong!");
                helpers.setStatus({success: false});
                // @ts-ignore
                helpers.setErrors({submit: err.message});
                helpers.setSubmitting(false);
            }
        }
    });

    const [value, setValue] = useState<PlaceType | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState<readonly PlaceType[]>([]);
    const loaded = useRef(false);

    if (typeof window !== "undefined" && !loaded.current) {
        if (!document.querySelector("#google-maps")) {
            loadScript(
                `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
                document.querySelector("head"),
                "google-maps",
            );
        }

        loaded.current = true;
    }

    const fetch = useMemo(
        () =>
            debounce(
                (
                    request: { input: string },
                    callback: (results?: readonly PlaceType[]) => void,
                ) => {
                    (autocompleteService.current as any).getPlacePredictions(
                        request,
                        callback,
                    );
                },
                400,
            ),
        [],
    );

    useEffect(() => {
        let active = true;

        if (!autocompleteService.current && (window as any).google) {
            autocompleteService.current = new (
                window as any
            ).google.maps.places.AutocompleteService();
        }
        if (!autocompleteService.current) {
            return undefined;
        }

        if (inputValue === "") {
            setOptions(value ? [value] : []);
            return undefined;
        }

        fetch({input: inputValue}, (results?: readonly PlaceType[]) => {
            if (active) {
                let newOptions: readonly PlaceType[] = [];

                if (value) {
                    newOptions = [value];
                }

                if (results) {
                    newOptions = [...newOptions, ...results];
                }

                setOptions(newOptions);
            }
        });

        return () => {
            active = false;
        };
    }, [value, inputValue, fetch]);

    const handleStartDateChange = useCallback(
        (date: Date | null): void => {
            formik.setFieldValue("start", date);

            // Prevent end date to be before start date
            if (formik.values.end && date && date > formik.values.end) {
                formik.setFieldValue("end", date);
            }
        },
        [formik]
    );

    const handleEndDateChange = useCallback(
        (date: Date | null): void => {
            formik.setFieldValue("end", date);

            // Prevent start date to be after end date
            if (formik.values.start && date && date < formik.values.start) {
                formik.setFieldValue("start", date);
            }
        },
        [formik]
    );

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

    const {documents: groups, isPending, error} = useCollection(
        "groups",
        [[]],
        []);
    const [groupOptions, setGroupOptions] = useState([]);

    const [includeEndDate, setIncludeEndDate] = useState(false);

    const [locationType, setLocationType] = useState(LocationType.IN_PERSON);

    useEffect(() => {
        if (groups) {
            // @ts-ignore
            setGroupOptions(groups.map((group) => {
                return {
                    id: group.id,
                    name: group.name,
                    imageURL: group.profileImageURL,
                    type: group.type,
                };
            }));
        }
    }, [groups]);

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            onClose={onClose}
            open={open}
            sx={{
                '& .MuiDialog-paper': {
                    margin: 0,
                    width: '100%',
                },
            }}
        >
            <form onSubmit={formik.handleSubmit}>
                <Box sx={{px: 3, pt: 3}}>
                    <Typography
                        align="center"
                        gutterBottom
                        variant="h5"
                    >
                        {
                            event
                                ? "Edit Event"
                                : "Create Event"
                        }
                    </Typography>
                </Box>
                <Stack
                    spacing={2}
                    sx={{p: 3}}
                >

                    <Autocomplete
                        id="group-selection"
                        onChange={(event, newValue) => {
                            formik.setFieldValue("group", newValue);
                        }}
                        value={formik.values.group}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(option) => option.name ?? ""}
                        options={groupOptions}
                        loading={isPending}
                        renderOption={(props, option) => (
                            <li {...props}>
                                <Avatar src={option.imageURL} sx={{width: "36px", height: "36px"}}/>
                                <Typography
                                    sx={{ml: 2}}
                                    variant="body1"
                                >
                                    {option.name}
                                </Typography>
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                error={!!(formik.touched.group && formik.errors.group)}
                                label="Who is this event for?"
                                onBlur={formik.handleBlur}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {isPending ? <CircularProgress color="inherit" size={20}/> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />

                    <TextField
                        label="Who can see this?"
                        name="visibility"
                        onChange={formik.handleChange}
                        select
                        SelectProps={{native: true}}
                        sx={{
                            minWidth: 120,
                            // order: {
                            //     xs: -1,
                            //     md: 0
                            // }
                        }}
                        value={formik.values.visibility}
                    >
                        {(enumToArray(Visibility).map((k) => (
                            <option
                                key={k.key}
                                value={k.value}
                            >
                                {k.value}
                            </option>
                        )))}
                    </TextField>

                    <Divider/>

                    <TextField
                        error={!!(formik.touched.title && formik.errors.title)}
                        fullWidth
                        helperText={formik.touched.title && formik.errors.title}
                        label="Event Name"
                        name="title"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.title}
                    />
                    <DateTimePicker
                        label="Start date"
                        onChange={handleStartDateChange}
                        value={formik.values.start}
                    />
                    {includeEndDate && <DateTimePicker
                        label="End date"
                        onChange={handleEndDateChange}
                        value={formik.values.end}
                    />}
                    <Button
                        size={"small"}
                        fullWidth={false}
                        sx={{p: 0, width: "100px"}}

                        onClick={() => setIncludeEndDate(!includeEndDate)}
                    >
                        {includeEndDate ? "- " : "+ "} End Date
                    </Button>

                    <TextField
                        label="In-Person or Virtual?"
                        onChange={(e) => {
                            // @ts-ignore
                            setLocationType(e.target.value);
                        }}
                        select
                        SelectProps={{native: true}}
                        sx={{
                            minWidth: 120,
                        }}
                        value={locationType}
                    >
                        {(enumToArray(LocationType).map((k) => (
                            <option
                                key={k.key}
                                value={k.value}
                            >
                                {k.value}
                            </option>
                        )))}
                    </TextField>

                    <Autocomplete
                        id="physical-location"
                        getOptionLabel={(option) =>
                            typeof option === "string" ? option : option.description
                        }
                        onBlur={formik.handleBlur}
                        filterOptions={(x) => x}
                        options={options}
                        autoComplete
                        includeInputInList
                        filterSelectedOptions
                        value={value}
                        noOptionsText="No locations"
                        onChange={(event: any, newValue: PlaceType | null) => {
                            formik.setFieldValue("location", {
                                name: newValue?.structured_formatting.main_text,
                                formattedAddress: newValue?.structured_formatting.secondary_text,
                                description: newValue?.description,
                                mapImageURL: null,
                                format: locationType,
                            });
                            setOptions(newValue ? [newValue, ...options] : options);
                            setValue(newValue);
                        }}
                        onInputChange={(event, newInputValue) => {
                            setInputValue(newInputValue);
                        }}
                        renderInput={(params) => (
                            <TextField {...params}
                                       onBlur={formik.handleBlur}
                                       id={"location"}
                                       name={"location"}
                                       label="Add location"
                                       error={!!(formik.touched.location && formik.errors.location)}
                                       fullWidth
                            />
                        )}
                        renderOption={(props, option) => {
                            const matches =
                                option.structured_formatting.main_text_matched_substrings || [];

                            const parts = parse(
                                option.structured_formatting.main_text,
                                matches.map((match: any) => [match.offset, match.offset + match.length]),
                            );

                            return (
                                <li {...props}>
                                    <Grid container alignItems="center">
                                        <Grid item sx={{display: "flex", width: 44}}>
                                            <LocationOnIcon sx={{color: "text.secondary"}}/>
                                        </Grid>
                                        <Grid item sx={{width: "calc(100% - 44px)", wordWrap: "break-word"}}>
                                            {parts.map((part: { highlight: any; text: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; }, index: Key | null | undefined) => {
                                                return (
                                                    <Box
                                                        key={index}
                                                        component="span"
                                                        sx={{fontWeight: part.highlight ? "bold" : "regular"}}
                                                    >
                                                        {part.text}
                                                    </Box>
                                                );
                                            })}
                                            <Typography variant="body2" color="text.secondary">
                                                {option.structured_formatting.secondary_text}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </li>
                            );
                        }}
                    />

                    <TextField
                        error={!!(formik.touched.description && formik.errors.description)}
                        fullWidth
                        rows={3}
                        multiline={true}
                        helperText={formik.touched.description && formik.errors.description}
                        label="What are the details?"
                        name="description"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.description}
                    />

                    <Divider/>

                    <Accordion variant={"outlined"}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            sx={{alignItems: "center", alignContent: "center"}}
                        >
                            <SvgIcon>
                                <Ticket01/>
                            </SvgIcon>
                            <Typography sx={{pl: 2}}>Manage Attendance</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                malesuada lacus ex, sit amet blandit leo lobortis eget.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                    {!!(formik.touched.end && formik.errors.end) && (
                        <FormHelperText error>
                            {formik.errors.end as string}
                        </FormHelperText>
                    )}
                </Stack>
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
                            disabled={formik.isSubmitting}
                            type="submit"
                            variant="contained"
                        >
                            Confirm
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </Dialog>
    );
};

CreateCalendarEventDialog.propTypes = {
    action: PropTypes.oneOf<Action>(["create", "update"]),
    // @ts-ignore
    event: PropTypes.object,
    onAddComplete: PropTypes.func,
    onClose: PropTypes.func,
    onDeleteComplete: PropTypes.func,
    onEditComplete: PropTypes.func,
    open: PropTypes.bool,
    // @ts-ignore
    range: PropTypes.object
};
