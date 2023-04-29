import 'react'
import React, {FC} from "react";
import {Post} from "../../../types/post";
import {GroupMember} from "../../../types/group-member";
import {
    Box, Button,
    Dialog,
    Divider,
    FormControl,
    FormControlLabel,
    FormLabel, IconButton,
    Radio,
    RadioGroup, Stack, SvgIcon,
    Typography
} from "@mui/material";
import { Group } from '../../../types/group';
import Trash02Icon from "@untitled-ui/icons-react/build/esm/Trash02";

interface ManageRoleDialogProps {
    groupMember?: GroupMember;
    group: Group;
    onClose?: () => void;
    open?: boolean;

}
export const ManageRoleDialog: FC<ManageRoleDialogProps> = (props) => {
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
                    overflowY: 'hidden',
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
                        mb:2.5,
                    }}
                >
                    Manage Role
                </Typography>
                <Typography
                    variant={"body1"}
                    sx={{
                        mb:2.5,
                    }}
                >
                    Select the role that <b>{groupMember?.firstName} {groupMember?.lastName}</b> should have within
                    the <b>{group.name}</b> group.
                </Typography>
                <FormControl>
                    <FormLabel
                        id="demo-controlled-radio-buttons-group"
                        sx={{
                            mb:2,
                            color: "text.secondary",
                        }}
                    >
                        Choose a role
                    </FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={value}
                        onChange={handleChange}
                    >
                        <FormControlLabel
                            sx={{
                                alignItems: "start",
                                mb: 1,
                            }}
                            value="Owner"
                            control={<Radio />}
                            label={
                                <Stack>
                                    <Typography>
                                        Owner
                                    </Typography>
                                    <Typography
                                        variant={"body2"}
                                        color={"text.secondary"}
                                    >
                                        Can create content and manage group
                                    </Typography>
                                </Stack>
                            }

                        />
                        <FormControlLabel
                            value="Member"
                            control={<Radio />}
                            label={
                                <Typography>
                                    Member
                                </Typography>
                            }
                        />
                    </RadioGroup>
                </FormControl>
                <Divider sx={{my: 2}} />
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
    )
}
