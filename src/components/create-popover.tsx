import type { FC } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import User01Icon from '@untitled-ui/icons-react/build/esm/User01';
import Mail04Icon from '@untitled-ui/icons-react/build/esm/Mail04';
import MessageChatSquareIcon from '@untitled-ui/icons-react/build/esm/MessageChatSquare';
import XIcon from '@untitled-ui/icons-react/build/esm/X';
import {
    Avatar,
    Box,
    IconButton,
    Link,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Popover,
    Stack,
    SvgIcon,
    Tooltip,
    Typography
} from '@mui/material';
import SportsIcon from '@mui/icons-material/Sports';
import EventIcon from "@mui/icons-material/Event";
import GroupIcon from "@mui/icons-material/Group";
import {PostAdd} from "@mui/icons-material";
import CampaignIcon from "@mui/icons-material/Campaign";

interface CreateContentPopoverProps {
    anchorEl: null | Element;
    onClose?: () => void;
    open?: boolean;
}

export const CreateContentPopover: FC<CreateContentPopoverProps> = (props) => {
    const {
        anchorEl,
        onClose,
        open = false,
        ...other
    } = props;

    return (
        <Popover
            anchorEl={anchorEl}
            anchorOrigin={{
                horizontal: 'left',
                vertical: 'bottom'
            }}
            disableScrollLock
            onClose={onClose}
            open={open}
            PaperProps={{ sx: { width: anchorEl?.clientWidth, mt: 1 } }}
            {...other}
        >
            <Stack
                alignItems="center"
                direction="row"
                justifyContent="space-between"
                spacing={2}
                sx={{
                    px: 3,
                    // py: 2
                }}
            >
                {/*<Typography*/}
                {/*    color="inherit"*/}
                {/*    variant="h6"*/}
                {/*>*/}
                {/*    Create*/}
                {/*</Typography>*/}
                {/*<Tooltip title="Mark all as read">*/}
                {/*    <IconButton*/}
                {/*        onClick={onMarkAllAsRead}*/}
                {/*        size="small"*/}
                {/*        color="inherit"*/}
                {/*    >*/}
                {/*        <SvgIcon>*/}
                {/*            <Mail04Icon />*/}
                {/*        </SvgIcon>*/}
                {/*    </IconButton>*/}
                {/*</Tooltip>*/}
            </Stack>
            <Box sx={{ px: 1, py: 2 }}>
                <ListItem
                    sx={{
                        px: 1,
                        borderRadius: 2.5,
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: 'action.hover'
                        },
                    }}
                >
                    <Avatar
                        sx={{
                            backgroundColor: '#FFEBEE',
                            mr: 2,
                        }}
                    >
                        <CampaignIcon fontSize={'small'} sx={{ color: '#F44336'}}/>
                    </Avatar>
                    <Typography
                        variant={'subtitle1'}
                    >
                        Announcement
                    </Typography>
                </ListItem>
                <ListItem
                    sx={{
                        px: 1,
                        borderRadius: 2.5,
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: 'action.hover'
                        },
                    }}
                >
                    <Avatar
                        sx={{
                            backgroundColor: '#E3F2FD',
                            mr: 2,
                        }}
                    >
                        <PostAdd fontSize={'small'} sx={{ color: '#2196F3'}}/>
                    </Avatar>
                    <Typography
                        variant={'subtitle1'}
                    >
                        Post
                    </Typography>
                </ListItem>
                <ListItem
                    sx={{
                        px: 1,
                        borderRadius: 2.5,
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: 'action.hover'
                        },
                    }}
                >
                    <Avatar
                        sx={{
                            backgroundColor: '#E8F5E9',
                            mr: 2,
                        }}
                    >
                        <EventIcon fontSize={'small'} sx={{ color: '#4CAF50' }}/>
                    </Avatar>
                    <Typography
                        variant={'subtitle1'}
                    >
                        Event
                    </Typography>
                </ListItem>
                <ListItem
                    sx={{
                        px: 1,
                        borderRadius: 2.5,
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: 'action.hover'
                        },
                    }}
                >
                    <Avatar
                        sx={{
                            backgroundColor: '#FFF3E0',
                            mr: 2,
                        }}
                    >
                        <GroupIcon fontSize={'small'} sx={{ color: '#FF9800' }}/>
                    </Avatar>
                    <Typography
                        variant={'subtitle1'}
                    >
                        Group
                    </Typography>
                </ListItem>
            </Box>
        </Popover>
    );
};

CreateContentPopover.propTypes = {
    anchorEl: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool
};
