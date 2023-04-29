import 'react'
import {Avatar, Breadcrumbs, Card, Container, Divider, Hidden, Paper, Stack, Typography} from "@mui/material";
import React, {FC, useEffect, useRef, useState} from "react";
import {Announcement} from "../../types/announcement";
import {Link, useParams} from "react-router-dom";
import {useDocument} from "../../hooks/firebase/useDocument";
import {format} from "date-fns";
import {EmailEditor} from "react-email-editor";
export const AnnouncementDetails = () => {
    const {announcementId} = useParams<{ announcementId: string }>();

    const [announcement, setAnnouncement] = useState<Announcement | null>(null);
    const {document: doc, isPending, error} = useDocument("announcements", announcementId!);

    useEffect(() => {
        if(doc) {
            setAnnouncement(doc);
        }
    }, [doc]);

    if(isPending || ! announcement) {
        return (
            <p>Loading...</p>
        )
    }

    return (
        <Container maxWidth={'xl'}>
            <Breadcrumbs aria-label="breadcrumb" sx={{mb: 3, ml: 1,mt: 4}} >
                <Link style={{textDecoration: 'none', color: "grey", fontSize: '0.95rem'}} to={"/announcements"}>
                    Announcements
                </Link>
                <Typography variant={"body2"} color="text.primary">{announcement?.title}</Typography>
            </Breadcrumbs>
            <Card
                sx={{
                    mt: 1,
                    p: 3,
                    width: '100%',
                    borderColor: '#e5e5e5',
                }}
            >
                <Typography
                    variant={"h4"}
                >
                    {announcement?.title}
                </Typography>
                <Divider sx={{my: 2}}/>
                <Stack direction={{xs: 'column', md: "row"}} spacing={2} justifyContent={'space-between'}>
                    <Stack direction={'row'} flex={4}>
                        <Avatar
                            src={announcement?.author.imageURL}
                            sx={{
                                mr: 2,
                                width: 48,
                                height: 48,
                            }}
                        />
                        <Stack>
                            <Typography
                                variant={"subtitle1"}
                            >
                                {`${announcement?.author.firstName} ${announcement?.author.lastName}`}
                            </Typography>

                            <Stack direction={'row'}>
                                {announcement?.targets.map((target) => (
                                    <Paper
                                        key={target.id}
                                        variant={"outlined"}
                                        sx={{
                                            px: 1,
                                            py: 0.2,
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
                                {announcement?.body}
                            </Typography>
                        </Stack>
                    </Stack>

                    <Stack
                        alignItems={{xs: 'start', md: "end"}}
                        flex={1}
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
                            {format(new Date(announcement?.createdOn ?? 0), 'MMM d, yyyy \'at\' h:mm aa')}
                        </Typography>
                    </Stack>

                </Stack>
            </Card>
        </Container>
    )
}
