import type {FC} from "react";
import PropTypes from "prop-types";
import type {DropzoneOptions, FileWithPath} from "react-dropzone";
import {useDropzone} from "react-dropzone";
import Upload01Icon from "@untitled-ui/icons-react/build/esm/Upload01";
import XIcon from "@untitled-ui/icons-react/build/esm/X";
import {
    Avatar,
    Box,
    Button, Grid,
    IconButton, ImageList,
    ImageListItem,
    List,
    ListItem,
    ListItemIcon,
    ListItemText, Paper,
    Stack,
    SvgIcon,
    Tooltip,
    Typography
} from "@mui/material";
import FileIcon from "@mui/icons-material/InsertDriveFile";
import {bytesToSize} from "../utils/bytes-to-size";
import {useEffect, useState} from "react";
import HighlightOffIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

export type File = FileWithPath;

interface FileDropzoneProps extends DropzoneOptions {
    caption?: string;
    files?: File[];
    onRemove?: (file: File) => void;
    onRemoveAll?: () => void;
    onUpload?: () => void;
}

export const FileDropzone: FC<FileDropzoneProps> = (props) => {
    const {caption, files = [], onRemove, onRemoveAll, onUpload, ...other} = props;
    const {getRootProps, getInputProps, isDragActive} = useDropzone(other);

    const hasAnyFiles = files.length > 0;

    const [filePreviewURLs, setFilePreviewURLs] = useState([]);

    useEffect(() => {
        setFilePreviewURLs([])
        let newFilePreviewURLs = new Array();
        files.forEach(file => {
            console.log(file);
            const reader = new FileReader();
            reader.onload = () => {
                const dataURL = reader.result;
                newFilePreviewURLs.push(dataURL);
                // // @ts-ignore
                // if (!filePreviewURLs.includes(dataURL)) {
                //     // @ts-ignore
                //     newFilePreviewURLs.push(dataURL);
                // }
            };
            reader.readAsDataURL(file);
        });
        // @ts-ignore
        setFilePreviewURLs(newFilePreviewURLs);

    }, [files]);

    return (
        <div>
            <Box
                sx={{
                    alignItems: "center",
                    border: 1,
                    borderRadius: 1,
                    borderColor: "#e5e5e5",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    outline: "none",
                    py: hasAnyFiles ? 0 : 3,
                    ...(
                        isDragActive && {
                            backgroundColor: "action.active",
                            opacity: 0.5
                        }
                    ),
                    "&:hover": {
                        backgroundColor: "action.hover",
                        cursor: "pointer",
                        opacity: 0.5
                    }
                }}
                {...getRootProps()}
            >
                <input {...getInputProps()} />
                {!hasAnyFiles && <Stack
                    alignItems="center"
                    direction="row"
                    spacing={2}
                >
                    <Avatar
                        sx={{
                            height: 50,
                            width: 50
                        }}
                    >
                        <SvgIcon>
                            <Upload01Icon fontSize={"small"}/>
                        </SvgIcon>
                    </Avatar>
                    <Stack spacing={0.5}>
                        <Typography
                            sx={{
                                "& span": {
                                    textDecoration: "underline"
                                }
                            }}
                            variant="subtitle1"
                        >
                            <span>Click to upload</span> or drag and drop
                        </Typography>
                        {caption && (
                            <Typography
                                color="text.secondary"
                                variant="body2"
                            >
                                {caption}
                            </Typography>
                        )}
                    </Stack>
                </Stack>}
                {hasAnyFiles && (
                    <Paper variant={"outlined"} sx={{position: 'relative', display: "inline-block", mt: 1, mb: 1, width: '100%', height: '100%'}}>
                        <ImageList
                            // sx={{ width: 500, height: 450 }}
                            variant="quilted"
                            cols={files.length > 1 ? 2 : 1}
                            rowHeight={files.length > 1 ? 200 : 400}
                        >
                            {files.map((file) => (
                                <ImageListItem key={file.path}>
                                    <img
                                        src={URL.createObjectURL(file)}
                                        loading="lazy"
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                        <IconButton
                            color="primary"
                            sx={{
                                position: 'absolute',
                                top: 10,
                                left: 10,
                                backgroundColor: '#fafafa',
                                '&:hover': {
                                    backgroundColor: '#dddddd',
                                }
                            }}
                            {...getRootProps()}
                        >
                            <AddIcon sx={{color: 'black'}}/>
                        </IconButton>
                        <IconButton
                            color="primary"
                            sx={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                backgroundColor: '#fafafa',
                                '&:hover': {
                                    backgroundColor: '#dddddd',
                                }
                            }}
                            onClick={() => {
                                files.forEach(file => {
                                    onRemove?.(file)
                                })}
                            }
                        >
                            <HighlightOffIcon sx={{color: 'black'}}/>
                        </IconButton>
                    </Paper>
                    // <Box sx={{mt: 2}}>
                    //     <Grid container>
                    //         {filePreviewURLs.map((filePreviewURL, index) => (
                    //             <Grid item key={filePreviewURL} xs={12}>
                    //                 <img
                    //                     width={"100%"}
                    //                     src={filePreviewURL}
                    //                 />
                    //             </Grid>
                    //         ))}
                    //     </Grid>
                    //
                    // </Box>
                )}
            </Box>
        </div>
    );
};

FileDropzone.propTypes = {
    caption: PropTypes.string,
    files: PropTypes.array,
    onRemove: PropTypes.func,
    onRemoveAll: PropTypes.func,
    onUpload: PropTypes.func,
    // From Dropzone
    accept: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string.isRequired).isRequired),
    disabled: PropTypes.bool,
    getFilesFromEvent: PropTypes.func,
    maxFiles: PropTypes.number,
    maxSize: PropTypes.number,
    minSize: PropTypes.number,
    noClick: PropTypes.bool,
    noDrag: PropTypes.bool,
    noDragEventsBubbling: PropTypes.bool,
    noKeyboard: PropTypes.bool,
    onDrop: PropTypes.func,
    onDropAccepted: PropTypes.func,
    onDropRejected: PropTypes.func,
    onFileDialogCancel: PropTypes.func,
    preventDropOnDocument: PropTypes.bool
};
