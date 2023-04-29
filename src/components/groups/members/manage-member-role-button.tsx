import 'react'
import {
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList,
    SvgIcon,
    Typography
} from "@mui/material";
import Edit02Icon from "@untitled-ui/icons-react/build/esm/Edit02";
import {
    Cloud,
    ContentCopy,
    ContentCut,
    ContentPaste,
    DeleteForever,
    DeleteForeverOutlined,
    ManageAccounts, Verified
} from "@mui/icons-material";
import React, {FC, useCallback} from "react";
import {Delete} from "@untitled-ui/icons-react";
import {useDialog} from "../../../hooks/use-dialog";
import {PreviewPostDialogData} from "../../../pages/home/home";
import {GroupMember} from "../../../types/group-member";
import {ManageRoleDialog} from "../../../sections/groups/members/manage-role-dialog";
import {Group} from "../../../types/group";
import {ManagePermissionsDialog} from "../../../sections/groups/members/manage-permissions-dialog";

interface ManageMemberRoleDialogData {
    memberID?: string;
}

interface ManageMemberPermissionsDialogData {
    memberID?: string;
}

interface ManageMemberRoleButtonProps {
    member: GroupMember;
    group: Group;
}

export const ManageMemberRoleButton: FC<ManageMemberRoleButtonProps> = (props) => {
    const {member, group} = props;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const manageRoleDialog = useDialog<ManageMemberRoleDialogData>();
    const managePermissionsDialog = useDialog<ManageMemberPermissionsDialogData>();

    const handleManageRoleClick = useCallback(
        (memberID: string): void => {
            manageRoleDialog.handleOpen({
                memberID: memberID
            });
            handleClose()
        },
        [manageRoleDialog.handleOpen]
    );

    const handleManagePermissionsClick = useCallback(
        (memberID: string): void => {
            managePermissionsDialog.handleOpen({
                memberID: memberID
            });
            handleClose()
        },
        [managePermissionsDialog.handleOpen]
    );

    return (
        <>
            <IconButton
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <SvgIcon>
                    <Edit02Icon />
                </SvgIcon>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <MenuList>
                    <MenuItem
                        onClick={() => handleManageRoleClick(member?.id)}
                    >
                        <ListItemIcon>
                            <Verified fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Manage Role</ListItemText>
                    </MenuItem>
                    <MenuItem
                        onClick={() => handleManagePermissionsClick(member?.id)}
                    >
                        <ListItemIcon>
                            <ManageAccounts />
                        </ListItemIcon>
                        <ListItemText>Manage Permissions</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                        <ListItemIcon>
                            <DeleteForeverOutlined color={'error'}/>
                        </ListItemIcon>
                        <ListItemText
                            sx={{color: 'error.main', fontWeight: 'bold'}}
                            primary={
                                <Typography variant="subtitle1" color="error.main">
                                    Remove Member
                                </Typography>
                            }
                        />
                    </MenuItem>
                </MenuList>
            </Menu>
            <ManageRoleDialog
                onClose={manageRoleDialog.handleClose}
                open={manageRoleDialog.open}
                groupMember={member}
                group={group}
            />
            <ManagePermissionsDialog
                onClose={managePermissionsDialog.handleClose}
                open={managePermissionsDialog.open}
                groupMember={member}
                group={group}
            />
        </>
    )
}
