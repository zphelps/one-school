import type {ChangeEvent} from "react";
import React, {useCallback, useEffect, useState} from "react";
import MessageChatSquareIcon from "@untitled-ui/icons-react/build/esm/MessageChatSquare";
import DotsHorizontalIcon from "@untitled-ui/icons-react/build/esm/DotsHorizontal";
import Image01Icon from "@untitled-ui/icons-react/build/esm/Image01";
import UserPlus02Icon from "@untitled-ui/icons-react/build/esm/UserPlus02";
import {
    Avatar,
    Box, Breadcrumbs,
    Button,
    Container,
    Divider,
    Grid, Hidden,
    IconButton, Skeleton,
    Stack,
    SvgIcon,
    Tab,
    Tabs,
    Tooltip,
    Typography
} from "@mui/material";
import {blueGrey} from "@mui/material/colors";
import {Seo} from "../../components/seo";
import {useDocument} from "../../hooks/firebase/useDocument";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Group} from "../../types/group";
import {LockUnlocked01} from "@untitled-ui/icons-react";
import {GroupPostsList} from "../../sections/groups/group-posts-list";
import {MiniCalendar} from "../../sections/calendar/mini-calendar";
import {GroupAboutCard} from "../../sections/groups/group-about-card";
import {GroupEventsCard} from "../../sections/groups/group-events-card";
import {alpha} from "@mui/material/styles";
import {GroupMembersList} from "../../sections/groups/members/list";
import PrivateLogo from "../../assets/error-401.png";
import {CreatePostPromptCard} from "../../components/feed/create-post-prompt-card";

const tabs = [
    {label: "Home", value: "home"},
    {label: "Events", value: "events"},
    {label: "Members", value: "members"},
    {label: "Conversations", value: "conversations"},
    {label: "Forms", value: "forms"},
    {label: "Files", value: "files"},
    {label: "Media", value: "media"},
];

export const GroupProfile = () => {
    const params = useParams();
    const {document, error, isPending} = useDocument("groups", params.groupId!);
    const [group, setGroup] = useState<Group>();
    const [currentTab, setCurrentTab] = useState<string>(params.tab || "home");
    const navigate = useNavigate();

    useEffect(() => {
        if (document) {
            setGroup(document);
        }
    }, [document]);

    const handleTabsChange = useCallback(
        (event: ChangeEvent<{}>, value: string): void => {
            setCurrentTab(value);
            navigate(`/groups/${params.groupId}/${value}`, {replace: true})
        },
        []
    );

    return (
        <>
            <Seo title={`${group?.name} | OneSchool`}/>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 3
                }}
            >
                <Container maxWidth="xl">
                    <Breadcrumbs aria-label="breadcrumb" sx={{mb: 2}} >
                        <Link style={{textDecoration: 'none', color: "grey", fontSize: '0.95rem'}} to={"/groups"}>
                            Groups
                        </Link>
                        <Typography variant={"body2"} color="text.primary">{group?.name}</Typography>
                    </Breadcrumbs>
                    <div>
                        <Box
                            style={{backgroundImage: `url(${group?.backgroundImageURL})`}}
                            sx={{
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                                borderRadius: 1,
                                height: 250,
                                position: "relative",
                                "&:hover": {
                                    "& button": {
                                        visibility: "visible"
                                    }
                                }
                            }}
                        >
                            <Button
                                startIcon={(
                                    <SvgIcon>
                                        <Image01Icon/>
                                    </SvgIcon>
                                )}
                                sx={{
                                    backgroundColor: blueGrey[900],
                                    bottom: {
                                        lg: 24,
                                        xs: "auto"
                                    },
                                    color: "common.white",
                                    position: "absolute",
                                    right: 24,
                                    top: {
                                        lg: "auto",
                                        xs: 24
                                    },
                                    visibility: "hidden",
                                    "&:hover": {
                                        backgroundColor: blueGrey[900]
                                    }
                                }}
                                variant="contained"
                            >
                                Change Cover
                            </Button>
                        </Box>
                        <Stack
                            alignItems="center"
                            direction="row"
                            spacing={2}
                            sx={{mt: 1}}
                        >
                            <Stack
                                alignItems={{xs: "start", sm: "start", md: "center"}}
                                direction="row"
                                spacing={2}
                            >
                                {group && <Avatar
                                    src={group?.profileImageURL!}
                                    sx={{
                                        maxWidth: "140px",
                                        maxHeight: "140px",
                                        minHeight: "76px",
                                        minWidth: "75px",
                                        height: "12vw",
                                        width: "12vw",
                                    }}
                                />}

                                {!group && <Skeleton
                                    variant="circular"
                                    style={{
                                        maxWidth: "140px",
                                        maxHeight: "140px",
                                        minHeight: "76px",
                                        minWidth: "75px",
                                        height: "12vw",
                                        width: "12vw",
                                    }}
                                />}

                                <div>
                                    {/*<Typography*/}
                                    {/*  color="text.secondary"*/}
                                    {/*  variant="overline"*/}
                                    {/*>*/}
                                    {/*  {'Administration'}*/}
                                    {/*</Typography>*/}
                                    {group && <Typography variant="h4">
                                        {group?.name}
                                    </Typography>}
                                    {!group && <Skeleton width="200px" height={50} />}
                                    <Stack direction={"row"} alignItems={"center"} sx={{mt: 0.5}}>
                                        {/* @ts-ignore */}
                                        <SvgIcon fontSize={"xs"} sx={{color: "text.secondary", mr: 0.75}}>
                                            <LockUnlocked01/>
                                        </SvgIcon>
                                        <Typography
                                            variant={"body1"}
                                            color={"text.secondary"}
                                        >
                                            {group?.isPrivate ? "Private" : "Public"}
                                        </Typography>
                                        <Typography sx={{mx: 0.75}} color={"text.secondary"}>•</Typography>
                                        <Typography
                                            variant={"subtitle1"}
                                            color={"text.secondary"}
                                        >
                                            {group?.memberCount} {group?.memberCount == 1 ? "member" : "members"}
                                        </Typography>
                                    </Stack>
                                    {group && <Typography
                                        sx={{
                                            mt: 1,
                                            display: "-webkit-box",
                                            overflow: "hidden",
                                            WebkitBoxOrient: "vertical",
                                            WebkitLineClamp: 3,
                                            fontSize: {
                                                xs: "0.9rem", // Font size for extra-small screens
                                                sm: "1rem", // Font size for small screens
                                                md: "1rem", // Font size for medium screens
                                            },
                                        }}
                                        variant={"body1"}
                                        // color={'text.secondary'}
                                    >
                                        {group?.description}
                                    </Typography>}
                                    {!group && <>
                                        <Skeleton width="80%" height={24} style={{ marginTop: '10px' }}/>
                                        <Skeleton width="60%" height={20} style={{ marginTop: '4px', marginBottom: '16px' }} />
                                    </>}
                                </div>
                            </Stack>
                            <Box sx={{flexGrow: 1}}/>
                            {/*<Button*/}
                            {/*    size="small"*/}
                            {/*    startIcon={(*/}
                            {/*        <SvgIcon>*/}
                            {/*            <MessageChatSquareIcon/>*/}
                            {/*        </SvgIcon>*/}
                            {/*    )}*/}
                            {/*    sx={{height: 40}}*/}
                            {/*    variant="contained"*/}
                            {/*>*/}
                            {/*    Send Message*/}
                            {/*</Button>*/}
                            <Tooltip title="More options">
                                <IconButton>
                                    <SvgIcon>
                                        <DotsHorizontalIcon/>
                                    </SvgIcon>
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </div>
                    {group?.isPrivate && <Container maxWidth="lg">
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mb: 4,
                                mt: 10
                            }}
                        >
                            <Box
                                alt="Not found"
                                component="img"
                                src={PrivateLogo}
                                sx={{
                                    height: 'auto',
                                    maxWidth: '100%',
                                    width: 250
                                }}
                            />
                        </Box>
                        <Typography
                            align="center"
                            variant={'h5'}
                        >
                            Private Group
                        </Typography>
                        <Typography
                            align="center"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            This pages is only visible to members of this group. Join the group to see the content.
                        </Typography>
                    </Container>}
                    {!group?.isPrivate && <Box>
                        <Tabs
                            indicatorColor="primary"
                            onChange={handleTabsChange}
                            scrollButtons="auto"
                            sx={{
                                position: "sticky",
                                top: 64,
                                zIndex: 1,
                                mt: 2,
                                backdropFilter: "blur(6px)",
                                backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
                            }}
                            textColor="primary"
                            value={currentTab}
                            variant="scrollable"
                        >
                            {tabs.map((tab) => (
                                <Tab
                                    key={tab.value}
                                    label={tab.label}
                                    value={tab.value}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'action.hover',
                                            borderRadius: 1,
                                        },
                                        px: 1,
                                        mx: {xs: 1, sm: 1, md: 2, lg: 2}
                                    }}
                                />
                            ))}
                        </Tabs>
                        <Divider/>
                        <Box sx={{mt: 3}}>
                            {currentTab === "home" && (
                                <Grid container justifyContent={"center"} spacing={3}>
                                    <Grid item xs={12} sm={12} md={7} lg={8}>
                                        <CreatePostPromptCard />
                                        <GroupPostsList groupId={params.groupId!}/>
                                    </Grid>
                                    <Hidden mdDown>
                                        <Grid item xs={0} sm={0} md={5} lg={4}>
                                            <GroupAboutCard group={group!}/>
                                        </Grid>
                                    </Hidden>
                                </Grid>)}
                            {currentTab === "events" && (
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={12} md={7} lg={7} xl={8}>
                                        <GroupEventsCard groupID={params.groupId!}/>
                                    </Grid>
                                    <Hidden mdDown>
                                        <Grid item xs={0} sm={0} md={5} lg={5} xl={4}>
                                            <MiniCalendar groupID={params.groupId!}/>
                                        </Grid>
                                    </Hidden>
                                </Grid>

                            )}
                            {currentTab === "members" && group && (
                                <GroupMembersList group={group}/>
                            )}
                        </Box>
                    </Box>}
                </Container>
            </Box>
        </>
    );
};
