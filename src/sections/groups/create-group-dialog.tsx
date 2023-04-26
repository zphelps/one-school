import type {FC, JSXElementConstructor, Key, ReactElement, ReactFragment, ReactPortal} from "react";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
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
    Accordion, AccordionDetails, AccordionSummary, Alert,
    Autocomplete, Avatar,
    Box,
    Button, CircularProgress, debounce,
    Dialog,
    Divider,
    FormControlLabel,
    FormHelperText, Grid,
    IconButton, Paper,
    Stack,
    SvgIcon,
    Switch,
    TextField,
    TextFieldProps,
    Typography
} from "@mui/material";
import type {Attendance} from "../../types/calendar";
import {DateTimePicker} from "@mui/x-date-pickers";
import {v4 as uuidv4} from "uuid";
import {enumToArray} from "../../utils/enum";
import {GroupPrivacy, GroupType, Visibility} from "../../utils/visibility";
import {useCollection} from "../../hooks/firebase/useCollection";
import CalendarEvents from "../../slices/events/calendar-events";
import {Calendar, Ticket01, Ticket02} from "@untitled-ui/icons-react";
import {Rsvp, Sports} from "@mui/icons-material";
import {httpsCallable} from "firebase/functions";
import {functions, storage} from "../../config";
import {useAuth} from "../../hooks/use-auth";
import {useNavigate} from "react-router-dom";
import Image01Icon from "@untitled-ui/icons-react/build/esm/Image01";
import {blueGrey} from "@mui/material/colors";
import {ManageAttendanceForm} from "../../components/events/manage-attendance-form";
import {useDropzone} from "react-dropzone";
import {ref} from "firebase/storage";
import {uploadFile} from "../../utils/firebase_storage";
import {Group} from "../../types/group";
import {alpha} from "@mui/material/styles";
import Camera01Icon from "@untitled-ui/icons-react/build/esm/Camera01";
import User01Icon from "@untitled-ui/icons-react/build/esm/User01";
import { GroupCategories } from "../../utils/group-categories";
interface Values {
    id: string;
    name: string;
    description: string | null;
    memberCount: number;
    backgroundImageURL: string | null;
    type: string;
    profileImageURL: string | null;
    isPrivate: boolean;
    createdOn: number;
    category: string | null;
    creator: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        imageURL: string;
    } | null;
    submit: null;
}

const useInitialValues = (
    group?: Group,
): Values => {
    return useMemo(
        (): Values => {
            if (group) {
                return {
                    id: group.id,
                    name: group.name,
                    description: group.description,
                    memberCount: group.memberCount,
                    backgroundImageURL: group.backgroundImageURL,
                    type: group.type,
                    profileImageURL: group.profileImageURL,
                    isPrivate: group.isPrivate,
                    createdOn: group.createdOn,
                    category: group.category,
                    creator: group.creator,
                    submit: null
                };
            }

            return {
                id: uuidv4(),
                name: "",
                description: null,
                memberCount: 0,
                backgroundImageURL: null,
                type: "Club",
                profileImageURL: null,
                isPrivate: false,
                createdOn: new Date().getTime(),
                category: null,
                creator: null,
                submit: null
            };
        },
        [group]
    );
};

type Action = "create" | "update"

interface CreateGroupDialogProps {
    action?: Action;
    event?: Group;
    onAddComplete?: () => void;
    onClose?: () => void;
    onDeleteComplete?: () => void;
    onEditComplete?: () => void;
    open?: boolean;
}

const validationSchema = Yup.object({
    category: Yup.string().required("Category is required"),
    createdOn: Yup.number(),
    description: Yup.string().max(5000).required("Description is required"),
    isPrivate: Yup.bool(),
    memberCount: Yup.number(),
    name: Yup.string().max(255).required("Name is required"),
});

export const CreateGroupDialog: FC<CreateGroupDialogProps> = (props) => {
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
                if (!profileImageFile || !backgroundImageFile) {
                    setImageError("Please upload a profile and background image");
                    return;
                }

                let data = {
                    id: values.id,
                    name: values.name,
                    description: values.description,
                    memberCount: values.memberCount,
                    backgroundImageURL: values.backgroundImageURL,
                    type: values.type,
                    profileImageURL: values.profileImageURL,
                    isPrivate: values.isPrivate,
                    createdOn: values.createdOn,
                    category: values.category,
                    creator: {
                        id: auth.user?.id,
                        firstName: auth.user?.firstName,
                        lastName: auth.user?.lastName,
                        email: auth.user?.email,
                        imageURL: auth.user?.imageURL,
                    },
                };

                const backgroundImageStorageRef = ref(storage, `tenants/${auth.user?.tenantID}/groups/${data.id}/${backgroundImageFile.name}`);
                const profileImageStorageRef = ref(storage, `tenants/${auth.user?.tenantID}/groups/${data.id}/${profileImageFile.name}`);
                const backgroundImageURL = await uploadFile(backgroundImageStorageRef, backgroundImageFile);
                const profileImageURL = await uploadFile(profileImageStorageRef, profileImageFile);
                data = {
                    ...data,
                    profileImageURL: profileImageURL,
                    backgroundImageURL: backgroundImageURL,
                }

                if (action === "update") {
                    // await dispatch(thunks.updateEvent({
                    //     eventId: event!.id,
                    //     update: data
                    // }));
                    // toast.success("Event updated");
                } else {
                    const createGroup = httpsCallable(functions, "createGroup");
                    const result = await createGroup({group: data, tenantID: auth.user?.tenantID});
                    if (result.data) {
                        formik.resetForm();
                        setProfileImageFile(null);
                        setBackgroundImageFile(null);
                        // @ts-ignore
                        navigate(`/groups/${data.id}`);
                        toast.success("Group created");
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
    const [imageError, setImageError] = useState<string | null>(null);
    const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null);
    const {getRootProps: getBackgroundRootProps, getInputProps: getBackgroundInputProps} = useDropzone(
        {
            accept: {
                "image/*": [],
            },
            onDrop: (acceptedFiles) => {
                const file = acceptedFiles[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        setBackgroundImageFile(file);
                        formik.setFieldValue("backgroundImageURL", reader.result);
                    };
                    reader.readAsDataURL(file);
                }
            }
        });

    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const {getRootProps: getProfileRootProps, getInputProps: getProfileInputProps} = useDropzone(
        {
            accept: {
                "image/*": [],
            },
            onDrop: (acceptedFiles) => {
                const file = acceptedFiles[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        setProfileImageFile(file);
                        formik.setFieldValue("profileImageURL", reader.result);
                    };
                    reader.readAsDataURL(file);
                }
            }
        });

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            onClose={onClose}
            open={open}
            sx={{
                "& .MuiDialog-paper": {
                    margin: 0,
                    width: "100%",
                },
            }}
        >
            <form onSubmit={formik.handleSubmit}>
                <Box sx={{px: 3, pt: 3, pb: 1.5}}>
                    <Typography
                        align="center"
                        gutterBottom
                        variant="h5"
                    >
                        {
                            event
                                ? "Edit Group"
                                : "Create Group"
                        }
                    </Typography>
                </Box>
                <Divider sx={{borderColor: "#e5e5e5"}}/>
                <Stack
                    spacing={2}
                    sx={{p: 3}}
                >

                    <Box
                        sx={{
                            mx: -3,
                            mt: -3,
                            mb: 1,
                            minWidth: "100%",
                            height: "200px",
                            backgroundColor: blueGrey[50],//'#f5f5f5',
                            position: "relative",
                        }}
                        {...getBackgroundRootProps()}
                    >
                        <input {...getBackgroundInputProps()}/>
                        {formik.values.backgroundImageURL && <img
                            src={formik.values.backgroundImageURL}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />}
                        <Button
                            startIcon={(
                                <SvgIcon>
                                    <Image01Icon/>
                                </SvgIcon>
                            )}
                            disableElevation
                            sx={{
                                backgroundColor: blueGrey[300],
                                bottom: {
                                    lg: 24,
                                    xs: "auto"
                                },
                                color: "common.white",
                                position: "absolute",
                                right: 24,
                                top: {
                                    lg: "auto",
                                    xs: 24
                                },
                                "&:hover": {
                                    backgroundColor: blueGrey[900]
                                }
                            }}
                            variant="contained"
                        >
                            Add Cover Photo
                        </Button>
                    </Box>

                    <Stack>
                        <Box
                            sx={{
                                borderColor: "neutral.300",
                                borderRadius: "50%",
                                borderStyle: "dashed",
                                borderWidth: 1,
                                height: 115,
                                width: 115,
                                mt: -12,
                            }}
                            {...getProfileRootProps()}
                        >
                            <Box
                                sx={{
                                    borderRadius: "50%",
                                    height: "100%",
                                    width: "100%",
                                    position: "relative"
                                }}
                            >
                                <Box
                                    sx={{
                                        alignItems: "center",
                                        backgroundColor: (theme) => alpha(theme.palette.neutral[700], 0.5),
                                        borderRadius: "50%",
                                        color: "common.white",
                                        cursor: "pointer",
                                        display: "flex",
                                        height: "100%",
                                        justifyContent: "center",
                                        left: 0,
                                        opacity: 0,
                                        position: "absolute",
                                        top: 0,
                                        width: "100%",
                                        zIndex: 1,
                                        "&:hover": {
                                            opacity: 1
                                        }
                                    }}
                                >
                                    <Stack
                                        alignItems="center"
                                        direction="row"
                                        spacing={1}
                                    >
                                        <SvgIcon color="inherit">
                                            <Camera01Icon/>
                                        </SvgIcon>
                                        <Typography
                                            color="inherit"
                                            variant="subtitle2"
                                            sx={{fontWeight: 700}}
                                        >
                                            Select
                                        </Typography>
                                    </Stack>
                                </Box>
                                <Avatar
                                    // @ts-ignore
                                    src={formik.values.profileImageURL}
                                    sx={{
                                        height: 115,
                                        width: 115
                                    }}
                                >
                                    <SvgIcon>
                                        <User01Icon/>
                                    </SvgIcon>
                                </Avatar>
                            </Box>
                        </Box>

                    </Stack>
                    <TextField
                        required
                        error={!!(formik.touched.name && formik.errors.name)}
                        fullWidth
                        helperText={formik.touched.name && formik.errors.name}
                        label="Group Name"
                        name="name"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.name}
                    />

                    <Divider sx={{borderColor: "#e5e5e5"}}/>

                    <TextField
                        error={!!(formik.touched.description && formik.errors.description)}
                        fullWidth
                        rows={2}
                        multiline={true}
                        helperText={formik.touched.description && formik.errors.description}
                        label="Group Description"
                        name="description"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.description ?? ""}
                    />

                    <TextField
                        label="Group Privacy"
                        name="privacy"
                        onChange={e => {
                            if(e.target.value === GroupPrivacy.PRIVATE) {
                                formik.setFieldValue("type", GroupType.CLUB);
                            }
                            formik.setFieldValue("isPrivate", e.target.value === GroupPrivacy.PRIVATE);
                        }}
                        select
                        SelectProps={{native: true}}
                        sx={{
                            minWidth: 120,
                        }}
                        value={formik.values.isPrivate ? GroupPrivacy.PRIVATE : GroupPrivacy.PUBLIC}
                    >
                        {(enumToArray(GroupPrivacy).map((k) => (
                            <option
                                key={k.key}
                                value={k.value}
                            >
                                {k.value}
                            </option>
                        )))}
                    </TextField>

                    {formik.values.isPrivate && (
                        <Box sx={{backgroundColor: '#fafafa', borderColor: '#e5e5e5', borderWidth: '1px', px:2, py:1, borderRadius: '10px'}}>
                            <Typography
                                variant={"body2"}
                            >
                                *Important: Private groups cannot be made public later. Sports teams must be public.
                            </Typography>
                        </Box>
                    )}

                    <Paper variant={"outlined"} sx={{borderColor: '#e5e5e5', pl: 1.5, pr: 1, py: 1}}>
                        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                            <Stack direction={"row"}>
                                <SvgIcon>
                                    <Sports/>
                                </SvgIcon>
                                <Typography variant={'subtitle1'} sx={{pl: 2}}>Sports Team</Typography>
                            </Stack>
                            <Switch
                                checked={formik.values.type === GroupType.TEAM}
                                onChange={() => {
                                    if(formik.values.type === GroupType.CLUB) {
                                        formik.setFieldValue("isPrivate", false);
                                        formik.setFieldValue("type", GroupType.TEAM);
                                    } else {
                                        formik.setFieldValue("type", GroupType.CLUB);
                                    }
                                }}
                            />
                        </Stack>
                    </Paper>

                    <Autocomplete
                        // disablePortal
                        fullWidth
                        id="combo-box-demo"
                        options={GroupCategories}
                        value={formik.values.category}
                        onChange={(event, newValue) => {
                            formik.setFieldValue("category", newValue);
                        }}
                        renderInput={(params) =>
                            <TextField
                                error={!!(formik.touched.category && formik.errors.category)}
                                helperText={formik.touched.category && formik.errors.category}
                                {...params} label="Category"
                            />
                        }
                    />

                    {
                        imageError && (
                            <Alert severity="error">
                                {imageError}
                            </Alert>
                        )
                    }

                </Stack>
                <Divider sx={{borderColor: "#e5e5e5"}}/>
                <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="space-between"
                    spacing={1}
                    sx={{p: 2}}
                >
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
                            Create
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </Dialog>
    );
};

CreateGroupDialog.propTypes = {
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
