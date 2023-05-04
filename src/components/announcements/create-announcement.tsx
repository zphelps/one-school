import type {FC} from "react";
import {useCallback, useEffect, useMemo, useState} from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import {addMinutes} from "date-fns";
import * as Yup from "yup";
import {useFormik} from "formik";
import Trash02Icon from "@untitled-ui/icons-react/build/esm/Trash02";
import {
    Autocomplete, Avatar,
    Box,
    Button, CircularProgress,
    Dialog,
    Divider,
    FormControlLabel,
    FormHelperText,
    IconButton, Input,
    Paper,
    Stack,
    SvgIcon,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import {Announcement} from "../../types/announcement";
import {v4 as uuidv4} from "uuid";
import {useAuth} from "../../hooks/use-auth";
import {useCollection} from "../../hooks/firebase/useCollection";
import {functions, storage} from "../../config";
import {httpsCallable} from "firebase/functions";
import {enumToArray} from "../../utils/enum";
import {Visibility} from "../../utils/visibility";
import {values} from "lodash";
import {Group} from "../../types/group";
import {File, FileDropzone} from "../file-dropzone";
import CollectionsIcon from "@mui/icons-material/Collections";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import {getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable} from "firebase/storage";
import {uploadFile} from "../../utils/firebase_storage";
import {Poll} from "../../types/poll";
import {PollBuilder} from "./poll-builder";
import {QuillEditor} from "../../components/quill-editor";
import "react-quill/dist/quill.snow.css";

interface Values {
    id: string | null;
    createdAt: Date | null;
    likeCount: number;
    commentCount: number;
    eventID: string | null;
    gameID: string | null;
    group: {
        id: string | undefined;
        name: string | undefined;
        imageURL: string | undefined;
        type: string | undefined;
    } | null;
    poll: Poll | null;
    author: {
        id: string | undefined;
        firstName: string | undefined;
        lastName: string | undefined;
        imageURL: string | undefined;
    };
    imageURLS: string[] | null;
    videoURL: string | null;
    targetIDs: string[];
    visibility: string;
    text: string | null;
    submit: null;
}

const useInitialValues = (
    announcement?: Announcement,
): Values => {
    const auth = useAuth();
    return useMemo(
        (): Values => {
            if (announcement) {
                return {
                    id: announcement.id || "",
                    title: announcement.title || null,
                    body: announcement.body || null,
                    createdAt: announcement.createdAt ? new Date(announcement.createdAt) : new Date(),
                    author: announcement.author || {
                        id: "",
                        firstName: "",
                        lastName: "",
                        imageURL: "",
                    },
                    targets: announcement.targets || {
                        id: "",
                        name: "",
                        targetType: "",
                    },
                    submit: null
                };
            }

            return {
                id: null,
                title: null,
                body: null,
                createdAt: null,
                author: {
                    firstName: auth.user?.firstName,
                    id: auth.user?.id,
                    imageURL: auth.user?.imageURL,
                    lastName: auth.user?.lastName
                },
                targets: {
                    id: "",
                    name: "",
                    targetType: "",
                },
                submit: null
            };
        },
        [announcement]
    );
};

type Action = "create" | "update"

interface AnnouncementDialogProps {
    action?: Action;
    announcement?: Announcement;
    onAddComplete?: () => void;
    onClose?: () => void;
    onDeleteComplete?: () => void;
    onEditComplete?: () => void;
    open?: boolean;
}

export const AnnouncementDialog: FC<AnnouncementDialogProps> = (props) => {
    const [selectingImage, setSelectingImage] = useState(false);
    const [selectingAttachment, setSelectingAttachment] = useState(false);
    const [files, setFiles] = useState<File[]>([]);

    const [buildingPoll, setBuildingPoll] = useState(false);
    const [poll, setPoll] = useState<Poll | null>(null);
    const [pollError, setPollError] = useState<string | null>(null);

    const validationSchema = Yup.object({
        public: Yup.bool(),
        text: buildingPoll ? Yup.string() : Yup.string().min(2).max(5000).required("Please enter a message^"),
        group: Yup.object({
            id: Yup.string().min(10),
            name: Yup.string(),
            imageURL: Yup.string(),
            type: Yup.string()
        }).required("Please select a group"),
    });

    const auth = useAuth();
    const {
        action = "create",
        post,
        onAddComplete,
        onClose,
        onDeleteComplete,
        onEditComplete,
        open = false,
    } = props;
    const initialValues = useInitialValues(post);
    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: async (values, helpers): Promise<void> => {
            try {
                let data = {
                    id: values.id ?? uuidv4(),
                    createdAt: values.createdAt ?? new Date(),
                    likeCount: values.likeCount,
                    commentCount: values.commentCount,
                    eventID: values.eventID,
                    gameID: values.gameID,
                    group: values.group,
                    imageURLS: values.imageURLS,
                    videoURL: values.videoURL,
                    poll: null,
                    targetIDs: [...values.targetIDs, values.group?.id],
                    public: values.visibility != Visibility.MEMBERS_ONLY,
                    title: values.title,
                    body: values.body,
                    author: {
                        id: auth.user?.id,
                        firstName: auth.user?.firstName,
                        lastName: auth.user?.lastName,
                        imageURL: auth.user?.imageURL,
                    }
                };

                if (action === "update") {
                    // await dispatch(thunks.updateEvent({
                    //     eventId: event!.id,
                    //     update: data
                    // }));
                    // toast.success('Event updated');
                } else {

                    if(files) {
                        const imageURLs = await Promise.all(files.map(async (file) => {
                            // Upload file and metadata to the object 'images/mountains.jpg'
                            const storageRef = ref(storage, `tenants/${auth.user?.tenantID}/posts/${data.id}/${file.name}`);
                            return await uploadFile(storageRef, file);
                        }));
                        data = {
                            ...data,
                            imageURLS: imageURLs
                        }
                    }

                    if(buildingPoll) {
                        const error = validatePoll();
                        if(error) {
                            setPollError(error);
                            return;
                        } else {
                            data = {
                                ...data,
                                // @ts-ignore
                                poll: {
                                    id: uuidv4(),
                                    text: poll?.text,
                                    options: poll?.options,
                                    votes: poll?.votes,
                                }
                            }
                        }
                    }

                    const createPost = httpsCallable(functions, 'createPost');
                    const result = await createPost({post: data, tenantID: auth.user?.tenantID});
                    if(result.data) {
                        formik.resetForm();
                        setPollError(null)
                        setBuildingPoll(false)
                        toast.success('Post created!');
                    } else {
                        toast.error('Something went wrong!');
                    }
                }

                if (action === "update") {
                    onEditComplete?.();
                } else {
                    console.log("onAddComplete")
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

    const validatePoll = () => {
        if(poll?.text.length === 0) {
            return "Poll must have a question";
        }
        // @ts-ignore
        if(poll?.options.length < 2) {
            return "Poll must have at least 2 options";
        }
        // @ts-ignore
        for(let i = 0; i < poll?.options.length; i++) {
            if(poll?.options[i].text.length === 0) {
                return "Poll options cannot be empty";
            }
        }
        return null;
    }

    useEffect(
        () => {
            setFiles([]);
        },
        [open]
    );

    const handleDrop = useCallback(
        (newFiles: File[]): void => {
            setFiles((prevFiles) => {
                return [...prevFiles, ...newFiles];
            });
        },
        []
    );

    const handleRemove = useCallback(
        (file: File): void => {
            setFiles((prevFiles) => {
                return prevFiles.filter((_file) => _file.path !== file.path);
            });
            setSelectingImage(false);
            setSelectingAttachment(false);
        },
        []
    );

    const handleRemoveAll = useCallback(
        (): void => {
            setFiles([]);
        },
        []
    );

    const {documents: groups, isPending, error} = useCollection(
        "groups",
        ["canCreatePostsIds", "array-contains", auth.user?.id],
        []);
    const [groupOptions, setGroupOptions] = useState([]);

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

    const handleDelete = useCallback(
        async (): Promise<void> => {
            // if (!event) {
            //     return;
            // }
            //
            // try {
            //     await dispatch(thunks.deleteEvent({
            //         eventId: event.id!
            //     }));
            //     onDeleteComplete?.();
            // } catch (err) {
            //     console.error(err);
            // }
        },
        [post, onDeleteComplete]
    );

    return (
        <Dialog
            fullWidth
            maxWidth="md"
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
                <Box sx={{pt: 3, pb: 1}}>
                    <Typography
                        align="center"
                        gutterBottom
                        variant="h5"
                    >
                        {
                            post
                                ? "Edit Announcement"
                                : "Create Announcement"
                        }
                    </Typography>
                </Box>
                <Divider/>
                <Stack
                    spacing={2}
                    sx={{px: 3, pb: 3, pt: 3}}
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
                                label="Who should get this announcement?"
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

                    <Input
                        disableUnderline
                        fullWidth
                        onChange={formik.handleChange}
                        placeholder="Title"
                        sx={{
                            py: 1,
                            px: 2,
                            borderBottom: 1,
                            borderColor: "divider"
                        }}
                        value={formik.values.title}
                    />
                    <QuillEditor
                        onChange={formik.handleChange}
                        placeholder="Leave a message"
                        sx={{
                            border: "none",
                            minHeight: 200,
                            flexGrow: 1
                        }}
                        value={formik.values.body}
                    />
                    <Divider/>

                    {selectingAttachment && <FileDropzone
                        accept={{"*": []}}
                        caption="Max file size is 10 MB"
                        files={files}
                        onDrop={handleDrop}
                        onRemove={handleRemove}
                        onRemoveAll={handleRemoveAll}
                        onUpload={onClose}
                    />}

                    {selectingImage && <FileDropzone
                        accept={{"image/*": []}}
                        caption="Max image size is 3 MB"
                        files={files}
                        onDrop={handleDrop}
                        onRemove={handleRemove}
                        onRemoveAll={handleRemoveAll}
                        onUpload={onClose}
                    />}

                    <Paper sx={{px: 2, py: 0.5, borderColor: "#e5e5e5"}} variant={"outlined"}>
                        <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                            <Typography
                                variant={"subtitle2"}
                            >
                                Add to Announcement
                            </Typography>
                            <Stack direction={'row'}>
                                <IconButton sx={{color: "dodgerblue"}} onClick={() => setSelectingImage(!selectingImage)}>
                                    <CollectionsIcon/>
                                </IconButton>
                                <IconButton sx={{color: "grey"}} onClick={() => setSelectingAttachment(!selectingAttachment)}>
                                    <AttachFileIcon/>
                                </IconButton>
                            </Stack>
                        </Stack>
                    </Paper>
                </Stack>
                <Divider/>
                <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="space-between"
                    spacing={1}
                    sx={{p: 2}}
                >
                    {post && (
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
                            Post
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </Dialog>
    );
};

AnnouncementDialog.propTypes = {
    action: PropTypes.oneOf<Action>(["create", "update"]),
    // @ts-ignore
    post: PropTypes.object,
    onAddComplete: PropTypes.func,
    onClose: PropTypes.func,
    onDeleteComplete: PropTypes.func,
    onEditComplete: PropTypes.func,
    open: PropTypes.bool,
};
