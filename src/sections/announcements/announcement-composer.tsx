import type {ChangeEvent, FC} from "react";
import {useCallback, useEffect, useState} from "react";
import PropTypes from "prop-types";
import Attachment01Icon from "@untitled-ui/icons-react/build/esm/Attachment01";
import Expand01Icon from "@untitled-ui/icons-react/build/esm/Expand01";
import Image01Icon from "@untitled-ui/icons-react/build/esm/Image01";
import Minimize01Icon from "@untitled-ui/icons-react/build/esm/Minimize01";
import XIcon from "@untitled-ui/icons-react/build/esm/X";
import {
    Autocomplete, Avatar,
    Backdrop,
    Box,
    Button, CircularProgress,
    Divider,
    IconButton,
    Input,
    Paper,
    Portal,
    Stack,
    SvgIcon, TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {QuillEditor} from "../../components/quill-editor";
import "react-quill/dist/quill.snow.css";
import {useCollection} from "../../hooks/firebase/useCollection";
import {useAuth} from "../../hooks/use-auth"; // Import styles for the "snow" theme

interface AnnouncementComposerProps {
    maximize?: boolean;
    message?: string;
    onClose?: () => void;
    onMaximize?: () => void;
    onMessageChange?: (value: string) => void;
    onMinimize?: () => void;
    onSubjectChange?: (value: string) => void;
    onToChange?: (value: string) => void;
    open?: boolean;
    subject?: string;
    to?: string;
}

interface Target {
    id: string;
    name: string;
    imageURL: string;
    type: string;
}

export const AnnouncementComposer: FC<AnnouncementComposerProps> = (props) => {
    const {
        maximize = false,
        message = "",
        onClose,
        onMaximize,
        onMessageChange,
        onMinimize,
        onSubjectChange,
        onToChange,
        open = false,
        subject = "",
        to = ""
    } = props;
    const auth = useAuth();
    const [targets, setTargets] = useState<Target[] | null>(null);

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

    const handleSubjectChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>): void => {
            onSubjectChange?.(event.target.value);
        },
        [onSubjectChange]
    );

    const handleToChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>): void => {
            onToChange?.(event.target.value);
        },
        [onToChange]
    );

    if (!open) {
        return null;
    }

    return (
        <Portal>
            <Backdrop open={maximize}/>
            <Paper
                sx={{
                    bottom: 0,
                    display: "flex",
                    flexDirection: "column",
                    margin: 3,
                    maxHeight: (theme) => `calc(100% - ${theme.spacing(6)})`,
                    maxWidth: (theme) => `calc(100% - ${theme.spacing(6)})`,
                    minHeight: {xs: "95%", md: 700},
                    outline: "none",
                    position: "fixed",
                    right: 0,
                    width: 750,
                    zIndex: 1400,
                    overflow: "hidden",
                    ...(maximize && {
                        borderRadius: 0,
                        height: "100%",
                        margin: 0,
                        maxHeight: "100%",
                        maxWidth: "100%",
                        width: "100%"
                    })
                }}
                elevation={12}
            >
                <Box
                    sx={{
                        alignItems: "center",
                        display: "flex",
                        px: 2,
                        py: 2
                    }}
                >
                    <Typography variant="h6">
                        New Announcement
                    </Typography>
                    <Box sx={{flexGrow: 1}}/>
                    {
                        maximize
                            ? (
                                <IconButton onClick={onMinimize}>
                                    <SvgIcon>
                                        <Minimize01Icon/>
                                    </SvgIcon>
                                </IconButton>
                            )
                            : (
                                <IconButton onClick={onMaximize}>
                                    <SvgIcon>
                                        <Expand01Icon/>
                                    </SvgIcon>
                                </IconButton>
                            )
                    }
                    <IconButton onClick={onClose}>
                        <SvgIcon>
                            <XIcon/>
                        </SvgIcon>
                    </IconButton>
                </Box>
                <Divider />
                {/*<Input*/}
                {/*    disableUnderline*/}
                {/*    fullWidth*/}
                {/*    onChange={handleToChange}*/}
                {/*    placeholder="To"*/}
                {/*    sx={{*/}
                {/*        py: 1,*/}
                {/*        px: 2,*/}
                {/*        borderBottom: 1,*/}
                {/*        borderColor: "divider"*/}
                {/*    }}*/}
                {/*    value={to}*/}
                {/*/>*/}
                <Autocomplete
                    id="group-selection"
                    multiple
                    onChange={(event, newValue) => {
                        setTargets(newValue);
                    }}
                    value={targets ?? undefined}
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
                            sx={{
                                pt: 0,
                                pb: 1,
                                px: 2,
                                'MuiFilledInput-root': {
                                    backgroundColor: "transparent",
                                    border: "none"
                                }
                            }}
                            fullWidth
                            placeholder="Who should this post go to?"
                            InputLabelProps={{
                                style: {
                                    display: 'none',
                                },
                            }}
                            // InputProps={{
                            //     ...params.InputProps,
                            //     endAdornment: (
                            //         <>
                            //             {isPending ? <CircularProgress color="inherit" size={20}/> : null}
                            //             {params.InputProps.endAdornment}
                            //         </>
                            //     ),
                            // }}
                        />
                    )}
                />

                <Input
                    disableUnderline
                    fullWidth
                    onChange={handleSubjectChange}
                    placeholder="Title"
                    sx={{
                        py: 1,
                        px: 2,
                        borderBottom: 1,
                        borderColor: "divider"
                    }}
                    value={subject}
                />
                <QuillEditor
                    onChange={onMessageChange}
                    placeholder="Leave a message"
                    sx={{
                        border: "none",
                        flexGrow: 1
                    }}
                    value={message}
                />
                <Divider/>
                <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                    sx={{p: 2}}
                >
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={1}
                    >
                        <Tooltip title="Attach image">
                            <IconButton size="small">
                                <SvgIcon>
                                    <Image01Icon/>
                                </SvgIcon>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Attach file">
                            <IconButton size="small">
                                <SvgIcon>
                                    <Attachment01Icon/>
                                </SvgIcon>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    <div>
                        <Button variant="contained">
                            Send
                        </Button>
                    </div>
                </Stack>
            </Paper>
        </Portal>
    );
};

AnnouncementComposer.propTypes = {
    maximize: PropTypes.bool,
    message: PropTypes.string,
    onClose: PropTypes.func,
    onMaximize: PropTypes.func,
    onMessageChange: PropTypes.func,
    onMinimize: PropTypes.func,
    onSubjectChange: PropTypes.func,
    onToChange: PropTypes.func,
    open: PropTypes.bool,
    subject: PropTypes.string,
    to: PropTypes.string
};
