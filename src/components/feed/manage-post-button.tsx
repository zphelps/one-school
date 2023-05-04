import 'react'
import {
    Backdrop, CircularProgress,
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
    ManageAccounts, MoreHorizOutlined, Report, Share, Verified
} from "@mui/icons-material";
import React, {FC, useCallback} from "react";
import {Delete} from "@untitled-ui/icons-react";
import {useDialog} from "../../hooks/use-dialog";
import {Post} from "../../types/post";
import {httpsCallable} from "firebase/functions";
import {functions} from "../../config";
import toast from "react-hot-toast";
import {useAuth} from "../../hooks/use-auth";

interface ManageMemberRoleDialogData {
    memberID?: string;
}

interface ManageMemberPermissionsDialogData {
    memberID?: string;
}

interface ManagePostButtonProps {
    post: Post;
}

export const ManagePostButton: FC<ManagePostButtonProps> = (props) => {
    const {post} = props;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [deleting, setDeleting] = React.useState<boolean>(false);
    const open = Boolean(anchorEl);
    const auth = useAuth();
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = async () => {
        handleClose();
        setDeleting(true)
        const deletePost = httpsCallable(functions, 'deletePost');
        const result = await deletePost({post: post, tenantID: auth.user?.tenantID});
        if (result.data) {
            toast.success('Post deleted!');
        } else {
            toast.error('Something went wrong!');
        }
        setDeleting(false)
    }

    return (
        <>
            <IconButton
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                sx={{mr: 1}}
                onClick={handleClick}
            >
                <SvgIcon>
                    <MoreHorizOutlined />
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
                    >
                        <ListItemIcon>
                            <Report fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Report</ListItemText>
                    </MenuItem>
                    <MenuItem
                    >
                        <ListItemIcon>
                            <Share />
                        </ListItemIcon>
                        <ListItemText>Share</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem
                        onClick={handleDelete}
                    >
                        <ListItemIcon>
                            <DeleteForeverOutlined color={'error'}/>
                        </ListItemIcon>
                        <ListItemText
                            sx={{color: 'error.main', fontWeight: 'bold'}}
                            primary={
                                <Typography variant="subtitle1" color="error.main">
                                    Delete
                                </Typography>
                            }
                        />
                    </MenuItem>
                </MenuList>
            </Menu>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={deleting}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    )
}
