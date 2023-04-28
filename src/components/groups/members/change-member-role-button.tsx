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
import React from "react";
import {Delete} from "@untitled-ui/icons-react";

export const ChangeMemberRoleButton = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

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
                    <MenuItem>
                        <ListItemIcon>
                            <Verified fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Manage Role</ListItemText>
                    </MenuItem>
                    <MenuItem>
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
        </>
    )
}
