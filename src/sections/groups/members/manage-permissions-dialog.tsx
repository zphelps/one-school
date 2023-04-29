import "react";
import React, {FC} from "react";
import {Post} from "../../../types/post";
import {GroupMember} from "../../../types/group-member";
import {
    Box, Button,
    Checkbox,
    Dialog,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel, IconButton,
    Radio,
    RadioGroup, Stack, SvgIcon,
    Typography
} from "@mui/material";
import {Group} from "../../../types/group";
import Trash02Icon from "@untitled-ui/icons-react/build/esm/Trash02";

interface ManagePermissionsDialogProps {
    groupMember?: GroupMember;
    group: Group;
    onClose?: () => void;
    open?: boolean;

}

export const ManagePermissionsDialog: FC<ManagePermissionsDialogProps> = (props) => {
    const {groupMember, group, onClose, open = false} = props;

    const [value, setValue] = React.useState(groupMember?.role || "Member");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            onClose={onClose}
            open={open}
            sx={{
                p: 0,
                "& .MuiDialog-paper": {
                    margin: 0,
                    width: "100%",
                    overflowY: "hidden",
                },
            }
            }
        >
            <Box
                sx={{
                    p: 3,
                }}
            >
                <Typography
                    variant={"h6"}
                    sx={{
                        mb: 3,
                    }}
                >
                    Manage Permissions
                </Typography>
                <Typography
                    variant={"body1"}
                    sx={{
                        mb: 3,
                    }}
                >
                    Select the permissions that <b>{groupMember?.firstName} {groupMember?.lastName}</b> should have within
                    the <b>{group.name}</b> group.
                </Typography>
                <FormGroup>
                    <FormLabel
                        component="legend"
                        sx={{
                            mb: 2,
                        }}
                    >
                        Assign permissions
                    </FormLabel>
                    <FormControlLabel
                        control={<Checkbox defaultChecked/>}
                        sx={{
                            mb: 1.5,
                        }}
                        label={
                            <Stack>
                                <Typography>
                                    Posts
                                </Typography>
                                <Typography
                                    variant={"body2"}
                                    color={"text.secondary"}
                                >
                                    Can create, edit, and delete posts
                                </Typography>
                            </Stack>
                        }
                    />
                    <FormControlLabel
                        control={<Checkbox/>}
                        sx={{
                            mb: 1.5,
                        }}
                        label={
                            <Stack>
                                <Typography>
                                    Events
                                </Typography>
                                <Typography
                                    variant={"body2"}
                                    color={"text.secondary"}
                                >
                                    Can create, edit, and delete events
                                </Typography>
                            </Stack>
                        }
                    />
                    <FormControlLabel
                        control={<Checkbox/>}
                        sx={{
                            mb: 1.5,
                        }}
                        label={
                            <Stack>
                                <Typography>
                                    Games
                                </Typography>
                                <Typography
                                    variant={"body2"}
                                    color={"text.secondary"}
                                >
                                    Can create, edit, delete, and report scores for games
                                </Typography>
                            </Stack>
                        }
                    />
                    <FormControlLabel
                        control={<Checkbox/>}
                        sx={{
                            mb: 1.5,
                        }}
                        label={
                            <Stack>
                                <Typography>
                                    Members
                                </Typography>
                                <Typography
                                    variant={"body2"}
                                    color={"text.secondary"}
                                >
                                    Can add, remove, and manage members' roles and permissions
                                </Typography>
                            </Stack>
                        }
                    />
                </FormGroup>
                <Divider sx={{my: 2}}/>
                <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="start"
                    spacing={1}
                    sx={{}}
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
                            // disabled={formik.isSubmitting}
                            type="submit"
                            variant="contained"
                        >
                            Save
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Dialog>
    );
};
