import 'react'
import {Announcement} from "../../types/announcement";
import {FC} from "react";
import {Avatar, Card, Hidden, Paper, Stack, Typography} from "@mui/material";
import {HoverGrowthCard} from "../groups/group-card";
import {format} from "date-fns";
import {useNavigate} from "react-router-dom";
import {paths} from "../../paths";

interface AnnouncementCardProps {
    announcement: Announcement;
}
export const AnnouncementCard: FC<AnnouncementCardProps> = (props) => {
    const {announcement} = props;
    const navigate = useNavigate();

    return (
        <HoverGrowthCard
            onClick={() => navigate(`${announcement.id}`)}
            sx={{
                p: 3,
                width: '100%',
            }}
        >
            <Stack
                direction={{xs: 'column', md: "row"}}
                spacing={2}
                justifyContent={'space-between'}
            >
                <Stack direction={'row'} flex={4}>
                    <Avatar
                        src={announcement.author.imageURL}
                        sx={{
                            mr: 3,
                            width: 48,
                            height: 48,
                        }}
                    />
                    <Stack>
                        <Typography
                            variant={"h6"}
                        >
                            {announcement.title}
                        </Typography>

                        <Stack direction={'row'}>
                            {announcement.targets.map((target) => (
                                <Paper
                                    key={target.id}
                                    variant={"outlined"}
                                    sx={{
                                        px: 1,
                                        py: 0.3,
                                        mr: 1,
                                        mt: 1,
                                        display: 'inline-flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderColor: '#e5e5e5',
                                    }}
                                >
                                    <Typography
                                        variant={'caption'}
                                    >
                                        {target.name}
                                    </Typography>
                                </Paper>
                            ))}
                        </Stack>

                        <Typography
                            variant={'body1'}
                            sx={{
                                mt: 1.5,
                            }}
                        >
                            {announcement.body}
                        </Typography>
                    </Stack>
                </Stack>

                <Stack
                    flex={1}
                    alignItems={{xs: 'start', md: "end"}}
                >
                    <Hidden only={['xs', 'sm']}>
                        <Typography
                            variant={'subtitle2'}
                            sx={{
                                mb: 0.5,
                            }}
                        >
                            Posted On:
                        </Typography>
                    </Hidden>
                    <Typography
                        variant={'body2'}
                        color={'text.secondary'}
                    >
                        {format(new Date(announcement.createdOn), 'MMM d, yyyy \'at\' h:mm aa')}
                    </Typography>
                </Stack>

            </Stack>
        </HoverGrowthCard>
    )
}
