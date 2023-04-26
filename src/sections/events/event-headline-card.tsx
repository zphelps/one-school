import 'react'
import {Box, Button, Card, Paper, Stack, SvgIcon, Typography, useTheme} from "@mui/material";
import {Group} from "../../types/calendar";
import {FC} from "react";
import {format} from "date-fns";
import {EventAttendanceForm} from "./event-attendance-form";
import {Ticket01} from "@untitled-ui/icons-react";

interface EventHeadlineCardProps {
    event?: Group;
}

export const EventHeadlineCard: FC<EventHeadlineCardProps> = (props) => {
    const { event } = props;
    const theme = useTheme();

    return (
        <Card sx={{width: "100%"}}>
            {event?.imageURL && <img
                src={event.imageURL}
                alt="event image"
                style={{
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                    objectFit: "cover",
                    width: "100%",
                    height: "200px"
                }}
            />}
            <Box sx={{p:3, left: "20px", top: "175px"}}>
                <Stack direction={{xs: 'column', md: "row"}} spacing={2} justifyContent={'space-between'}>
                    <Stack direction="row" justifyContent="start" spacing={3} alignItems={'center'}>
                        <Paper variant={"outlined"} sx={{
                            borderColor: '#e5e5e5',
                            py:2,
                            px:2.5,
                            alignItems: "center",
                            justifyContent: "center",
                            maxHeight: "115px",
                        }}>
                            <Typography
                                textAlign={"center"}
                                color={theme.palette.primary.main}
                                variant={"subtitle2"}
                            >
                                {format(new Date(event?.start ?? 0), 'EEEE')}
                            </Typography>
                            <Typography
                                variant={"h4"}
                                textAlign={"center"}
                            >
                                {format(new Date(event?.start ?? 0), 'd')}
                            </Typography>
                            <Typography
                                textAlign={"center"}
                                fontWeight={500}
                                lineHeight={1}
                            >
                                {format(new Date(event?.start ?? 0), 'LLL').toUpperCase()}
                            </Typography>
                        </Paper>
                        <Stack direction="column">
                            <Typography
                                variant="body1"
                                color={"text.secondary"}
                                fontWeight={"bold"}
                                sx={{
                                    pb: 0.75,
                                }}
                            >
                                {`${format(new Date(event?.start ?? 0), 'PPPP')}`.toUpperCase()}
                            </Typography>
                            <Typography
                                variant="h4"
                                component="div"
                                sx={{mb: 0.75}}
                                fontWeight={700}
                            >
                                {event?.title}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                color={"text.secondary"}
                                sx={{
                                    pb: 0.6,
                                }}
                            >
                                {event?.location.name}
                            </Typography>
                            {/*{event?.attendance?.RSVP && <EventAttendanceForm event={event}/>}*/}
                        </Stack>
                    </Stack>
                    {event?.attendance?.ticket &&
                        <Button
                            sx={{maxHeight: '40px'}}
                            variant="contained"
                        >
                            <SvgIcon fontSize={'small'} sx={{mr: 1}}>
                                <Ticket01 fontSize={'small'}/>
                            </SvgIcon>

                            Buy Ticket
                        </Button>
                    }
                </Stack>
            </Box>
        </Card>
    )
}
