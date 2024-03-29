import type {ChangeEvent, FC, KeyboardEvent, SetStateAction} from "react";
import {useCallback, useRef, useState} from "react";
import PropTypes from "prop-types";
import Attachment01Icon from "@untitled-ui/icons-react/build/esm/Attachment01";
import Camera01Icon from "@untitled-ui/icons-react/build/esm/Camera01";
import Send01Icon from "@untitled-ui/icons-react/build/esm/Send01";
import {
    Avatar,
    Box,
    IconButton,
    InputAdornment,
    OutlinedInput,
    Paper,
    Stack,
    SvgIcon,
    Tooltip,
    Typography
} from "@mui/material";
import {useAuth} from "../../hooks/use-auth";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

interface ConversationMessageAddProps {
    disabled?: boolean;
    onSend?: (value: string) => void;
}

export const ConversationMessageAdd: FC<ConversationMessageAddProps> = (props) => {
    const {disabled, onSend, ...other} = props;
    const user = useAuth().user;
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [body, setBody] = useState<string>("");

    const [imageSRC, setImageSRC] = useState(null);

    const handleFileChange = (e: any) => {
        console.log("handleFileChange");
        console.log(e.target.files);
        if (e.target.files[0] && e.target.files[0].type.includes("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // @ts-ignore
                setImageSRC(reader.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleAttach = useCallback(
        (): void => {
            fileInputRef.current?.click();
            console.log("handleAttach");
            console.log(fileInputRef.current?.files);
        },
        []
    );

    const handleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>): void => {
            setBody(event.target.value);
        },
        []
    );

    const handleSend = useCallback(
        (): void => {
            if (!body) {
                return;
            }

            onSend?.(body);
            setBody("");
        },
        [body, onSend]
    );

    const handleKeyUp = useCallback(
        (event: KeyboardEvent<HTMLInputElement>): void => {
            if (event.code === "Enter") {
                handleSend();
            }
        },
        [handleSend]
    );

    return (
        <Stack
            alignItems={imageSRC ? "end" : "center"}
            direction="row"
            spacing={2}
            sx={{
                px: 3,
                pt: 0.5,
                pb: imageSRC ? 2 : 1,
            }}
            {...other}
        >
            <Avatar
                sx={{
                    display: {
                        xs: "none",
                        sm: "inline"
                    }
                }}
                src={user!.imageURL}
            />
            <Stack sx={{width: '100%'}}>
                {imageSRC && <Box>
                    <Paper variant={"outlined"} sx={{position: 'relative', display: "inline-block", p:0, mt: 1, mb: 1}}>
                        <IconButton
                            color="primary"
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                            }}
                            onClick={() => {
                                setImageSRC(null)
                            }}
                        >
                            <HighlightOffIcon />
                        </IconButton>
                        <img
                            height={"200px"}
                            width={"200px"}
                            style={{objectFit: "cover", borderRadius: "8px"}}
                            src={imageSRC!}
                            alt="icon"
                        />
                    </Paper>
                </Box>}
                <OutlinedInput
                    disabled={disabled}
                    fullWidth
                    onChange={handleChange}
                    onKeyUp={handleKeyUp}
                    placeholder="Leave a message"
                    size="small"
                    value={body}
                />
            </Stack>

            <Box
                sx={{
                    alignItems: "center",
                    display: "flex",
                    m: -2,
                    ml: 2,
                }}
            >
                <Tooltip title="Send">
                    <Box sx={{m: 1}}>
                        <IconButton
                            color="primary"
                            disabled={!(body || imageSRC) || disabled}
                            sx={{
                                backgroundColor: "primary.main",
                                color: "primary.contrastText",
                                "&:hover": {
                                    backgroundColor: "primary.dark"
                                }
                            }}
                            onClick={handleSend}
                        >
                            <SvgIcon>
                                <Send01Icon/>
                            </SvgIcon>
                        </IconButton>
                    </Box>
                </Tooltip>
                <Tooltip title="Attach file">
                    <Box
                        sx={{
                            display: {
                                xs: "none",
                                sm: "inline-flex"
                            },
                            m: 1
                        }}
                    >
                        <IconButton
                            disabled={disabled}
                            edge="end"
                            onClick={handleAttach}
                        >
                            <SvgIcon>
                                <Attachment01Icon/>
                            </SvgIcon>
                        </IconButton>
                    </Box>
                </Tooltip>
            </Box>
            <input
                hidden
                onChange={handleFileChange}
                ref={fileInputRef}
                type="file"
                accept={"image/*"}
            />
        </Stack>
    );
};

ConversationMessageAdd.propTypes = {
    disabled: PropTypes.bool,
    onSend: PropTypes.func
};

ConversationMessageAdd.defaultProps = {
    disabled: false
};
