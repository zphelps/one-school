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
    IconButton, Paper,
    Stack,
    SvgIcon,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import {Post} from "../../types/post";
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
import PollIcon from "@mui/icons-material/Poll";
import {getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable} from "firebase/storage";
import {uploadFile} from "../../utils/firebase_storage";
import {Poll} from "../../types/poll";
import {PollBuilder} from "./poll-builder";

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
    post?: Post,
): Values => {
    const auth = useAuth();
    return useMemo(
        (): Values => {
            if (post) {
                return {
                    createdAt: post.createdAt ? new Date(post.createdAt) : new Date(),
                    id: post.id || "",
                    likeCount: post.likeCount || 0,
                    commentCount: post.commentCount || 0,
                    eventID: post.eventID || null,
                    gameID: post.gameID || null,
                    group: post.group || {
                        id: "",
                        name: "",
                        imageURL: "",
                        type: "",
                    },
                    poll: post.poll || null,
                    author: post.author || {
                        id: "",
                        firstName: "",
                        lastName: "",
                        imageURL: "",
                    },
                    imageURLS: post.imageURLS || null,
                    videoURL: post.videoURL || null,
                    targetIDs: post.targetIDs || [],
                    visibility: post.public ? Visibility.PUBLIC : Visibility.MEMBERS_ONLY,
                    text: post.text || null,
                    submit: null
                };
            }

            return {
                id: null,
                createdAt: null,
                likeCount: 0,
                author: {
                    firstName: auth.user?.firstName,
                    id: auth.user?.id,
                    imageURL: auth.user?.imageURL,
                    lastName: auth.user?.lastName
                },
                imageURLS: null,
                visibility: Visibility.MEMBERS_ONLY,
                targetIDs: [],
                text: "",
                videoURL: null,
                commentCount: 0,
                eventID: null,
                gameID: null,
                group: null,
                poll: null,
                submit: null
            };
        },
        [post]
    );
};

type Action = "create" | "update"

interface PostDialogProps {
    action?: Action;
    post?: Post;
    onAddComplete?: () => void;
    onClose?: () => void;
    onDeleteComplete?: () => void;
    onEditComplete?: () => void;
    open?: boolean;
}

export const PostDialog: FC<PostDialogProps> = (props) => {
    const [selectingImage, setSelectingImage] = useState(false);
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
                    text: values.text,
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
                <Box sx={{pt: 3, pb: 1}}>
                    <Typography
                        align="center"
                        gutterBottom
                        variant="h5"
                    >
                        {
                            post
                                ? "Edit Post"
                                : "Create Post"
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
                                label="Where should this post go?"
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

                    <TextField
                        error={!!(formik.touched.text && formik.errors.text)}
                        fullWidth
                        helperText={formik.touched.text && formik.errors.text}
                        label="What would you like to share?"
                        name="text"
                        multiline={true}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.text}
                        rows={5}
                    />

                    {buildingPoll && <PollBuilder setPoll={setPoll} error={pollError}/>}

                    {selectingImage && <FileDropzone
                        accept={{"image/*": []}}
                        caption="Max file size is 3 MB"
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
                                Add to post
                            </Typography>
                            <Stack direction={'row'}>
                                <IconButton sx={{color: "dodgerblue"}} onClick={() => setSelectingImage(!selectingImage)}>
                                    <CollectionsIcon/>
                                </IconButton>
                                <IconButton sx={{color: "orange"}} onClick={() => setBuildingPoll(!buildingPoll)}>
                                    <PollIcon/>
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

PostDialog.propTypes = {
    action: PropTypes.oneOf<Action>(["create", "update"]),
    // @ts-ignore
    post: PropTypes.object,
    onAddComplete: PropTypes.func,
    onClose: PropTypes.func,
    onDeleteComplete: PropTypes.func,
    onEditComplete: PropTypes.func,
    open: PropTypes.bool,
};
