import 'react'
import {FC} from "react";
import {Group} from "../../types/group";
import {Box, Card, Divider, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Typography} from "@mui/material";
import GlobeIcon from '@mui/icons-material/Public';
import AdminIcon from '@mui/icons-material/AdminPanelSettings';
import HistoryIcon from '@mui/icons-material/Schedule';
import {formatDistanceToNowStrict} from "date-fns";

interface GroupAboutCardProps {
    group?: Group
}
export const GroupAboutCard: FC<GroupAboutCardProps> = (props) => {
    const {group} = props;
    return (
        <Card
            sx={{pb:1}}
        >
            <Box
                sx={{
                    px:3,
                    pt: 3,
                    pb: 2
                }}
            >
                <Typography
                    variant={'h5'}
                >
                    About
                </Typography>

                <Typography
                    variant={'body1'}
                    sx={{mt:1}}
                >
                    {group?.description}
                </Typography>
            </Box>
            <Divider />
            <ListItem
                alignItems={'flex-start'}
            >
                <ListItemIcon>
                    <GlobeIcon />
                </ListItemIcon>
                <ListItemText
                    primary={
                        <Typography
                            variant={'subtitle1'}
                        >
                            {group?.isPrivate ? "Private" : "Public"}
                        </Typography>
                    }
                    secondary={
                        <Typography
                            color={'text.secondary'}
                            variant={'subtitle2'}
                        >
                            {group?.isPrivate
                                ? 'Only members can view group posts, events, members, and more'
                                : "Anyone can view this group's public posts, events, members, and more"}
                        </Typography>
                    }
                />
            </ListItem>
            <ListItem
                alignItems={'flex-start'}
            >
                <ListItemIcon>
                    <AdminIcon />
                </ListItemIcon>
                <ListItemText

                    primary={
                        <Typography
                            variant={'subtitle1'}
                        >
                            Creator
                        </Typography>
                    }
                    secondary={
                        <Typography
                            color={'text.secondary'}
                            variant={'subtitle2'}
                        >
                            {group?.creator?.firstName} {group?.creator?.lastName} ({group?.creator?.email})
                        </Typography>
                    }
                >

                </ListItemText>
            </ListItem>
            <ListItem
                alignItems={'flex-start'}
            >
                <ListItemIcon>
                    <HistoryIcon />
                </ListItemIcon>
                <ListItemText
                    primary={
                        <Typography
                            variant={'subtitle1'}
                        >
                            {'History'}
                        </Typography>
                    }
                    secondary={
                        <Typography
                            color={'text.secondary'}
                            variant={'subtitle2'}
                        >
                            {group?.createdOn && `Created ${formatDistanceToNowStrict(group?.createdOn)}`} ago
                        </Typography>
                    }
                />
            </ListItem>
        </Card>
    )
}
