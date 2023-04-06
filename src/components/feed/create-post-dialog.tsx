import type {FC} from 'react';
import {useCallback, useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import {addMinutes} from 'date-fns';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import Trash02Icon from '@untitled-ui/icons-react/build/esm/Trash02';
import {
    Autocomplete,
    Box,
    Button, CircularProgress,
    Dialog,
    Divider,
    FormControlLabel,
    FormHelperText,
    IconButton,
    Stack,
    SvgIcon,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import {Post} from "../../types/post";
import { v4 as uuidv4 } from 'uuid';
import {useAuth} from "../../hooks/use-auth";
import {useCollection} from "../../hooks/firebase/useCollection";
import {functions} from "../../config";
import { httpsCallable } from 'firebase/functions';
import { enumToArray } from '../../utils/enum';
import {Visibility} from "../../utils/visibility";
import {values} from "lodash";

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
    pollID: string | null;
    author: {
        id: string | undefined;
        firstName: string | undefined;
        lastName: string | undefined;
        imageURL: string | undefined;
    }
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
                    id: post.id || '',
                    likeCount: post.likeCount || 0,
                    commentCount: post.commentCount || 0,
                    eventID: post.eventID || null,
                    gameID: post.gameID || null,
                    group: post.group || {
                        id: '',
                        name: '',
                        imageURL: '',
                        type: '',
                    },
                    pollID: post.pollID || null,
                    author: post.author || {
                        id: '',
                        firstName: '',
                        lastName: '',
                        imageURL: '',
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
                text: null,
                videoURL: null,
                commentCount: 0,
                eventID: null,
                gameID: null,
                group: null,
                pollID: null,
                submit: null
            };
        },
        [post]
    );
};

const validationSchema = Yup.object({
    public: Yup.bool(),
    text: Yup.string().max(5000).required('Please enter a message^'),
    group: Yup.object({
        id: Yup.string().min(10),
        name: Yup.string(),
        imageURL: Yup.string(),
        type: Yup.string()
    }).required('Please select a group'),
});

type Action = 'create' | 'update'

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
    const auth = useAuth();
    const {
        action = 'create',
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
                const data = {
                    id: values.id ?? uuidv4(),
                    createdAt: values.createdAt ?? new Date(),
                    likeCount: values.likeCount,
                    commentCount: values.commentCount,
                    eventID: values.eventID,
                    gameID: values.gameID,
                    group: values.group,
                    pollID: values.pollID,
                    imageURLS: values.imageURLS,
                    videoURL: values.videoURL,
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

                if (action === 'update') {
                    // await dispatch(thunks.updateEvent({
                    //     eventId: event!.id,
                    //     update: data
                    // }));
                    // toast.success('Event updated');
                } else {
                    const createPost = httpsCallable(functions, 'createPost');
                    const result = await createPost({post: data, tenantID: auth.user?.tenantID});
                    if(result.data) {
                        formik.resetForm();
                        toast.success('Post created!');
                    } else {
                        toast.error('Something went wrong!');
                    }
                }

                if (action === 'update') {
                    onEditComplete?.();
                } else {
                    onAddComplete?.();
                }
            } catch (err) {
                console.error(err);
                toast.error('Something went wrong!');
                helpers.setStatus({success: false});
                // @ts-ignore
                helpers.setErrors({submit: err.message});
                helpers.setSubmitting(false);
            }
        }
    });

    const {documents: groups, isPending, error} = useCollection(
        'groups',
        [[]],
        []);
    const [groupOptions, setGroupOptions] = useState([]);

    useEffect(() => {
        if (groups) {
            // @ts-ignore
            setGroupOptions(groups.map((group) => {
                return {
                    id: group.id,
                    name: group.name,
                    imageURL: group.imageURL,
                    type: group.type,
                }
            }))
        }
    },[groups])

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

    // @ts-ignore
    // @ts-ignore
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
                <Box sx={{pt: 3, pb: 1}}>
                    <Typography
                        align="center"
                        gutterBottom
                        variant="h5"
                    >
                        {
                            post
                                ? 'Edit Post'
                                : 'Create Post'
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
                            formik.setFieldValue('group', newValue);
                        }}
                        value={formik.values.group}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(option) => option.name ?? ''}
                        options={groupOptions}
                        loading={isPending}
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
                                            {isPending ? <CircularProgress color="inherit" size={20} /> : null}
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
                        SelectProps={{ native: true }}
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
    action: PropTypes.oneOf<Action>(['create', 'update']),
    // @ts-ignore
    post: PropTypes.object,
    onAddComplete: PropTypes.func,
    onClose: PropTypes.func,
    onDeleteComplete: PropTypes.func,
    onEditComplete: PropTypes.func,
    open: PropTypes.bool,
};
