import type {ChangeEvent} from "react";
import {useCallback, useEffect, useState} from "react";
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
    Grid,
    IconButton,
    Stack,
    SvgIcon,
    Tab,
    Tabs,
    Tooltip,
    Typography
} from "@mui/material";
import {blueGrey} from "@mui/material/colors";
import {useMounted} from "../../hooks/use-mounted";
import {Post} from "../../types/post";
import {Seo} from "../../components/seo";
import {RouterLink} from "../../components/router-link";
import {paths} from "../../paths";
import {useDocument} from "../../hooks/firebase/useDocument";
import {CalendarEvent} from "../../types/calendar";
import {Link, useParams} from "react-router-dom";
import {Group} from "../../types/group";
import {LockUnlocked01} from "@untitled-ui/icons-react";
import {GroupPostsList} from "../../sections/groups/group-posts-list";

const tabs = [
    {label: "Home", value: "home"},
    {label: "Events", value: "events"},
    {label: "Members", value: "members"},
    {label: "Conversations", value: "conversations"},
    {label: "Forms", value: "forms"},
    {label: "Files", value: "files"},
    {label: "Media", value: "media"},
];

// const useProfile = (): Profile | null => {
//   const isMounted = useMounted();
//   const [profile, setProfile] = useState<Profile | null>(null);
//
//   const handleProfileGet = useCallback(async () => {
//     try {
//       const response = await socialApi.getProfile();
//
//       if (isMounted()) {
//         setProfile(response);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   }, [isMounted]);
//
//   useEffect(
//     () => {
//       handleProfileGet();
//     },
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     []
//   );
//
//   return profile;
// };

// const usePosts = (): Post[] => {
//   const isMounted = useMounted();
//   const [posts, setPosts] = useState<Post[]>([]);
//
//   const handlePostsGet = useCallback(
//     async () => {
//       try {
//         const response = await socialApi.getPosts();
//
//         if (isMounted()) {
//           setPosts(response);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     },
//     [isMounted]
//   );
//
//   useEffect(
//     () => {
//       handlePostsGet();
//     },
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     []
//   );
//
//   return posts;
// };
//
// const useConnections = (search: string = ''): Connection[] => {
//   const [connections, setConnections] = useState<Connection[]>([]);
//   const isMounted = useMounted();
//
//   const handleConnectionsGet = useCallback(
//     async () => {
//       const response = await socialApi.getConnections();
//
//       if (isMounted()) {
//         setConnections(response);
//       }
//     },
//     [isMounted]
//   );
//
//   useEffect(
//     () => {
//       handleConnectionsGet();
//     },
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [search]
//   );
//
//   return connections.filter((connection) => {
//     return connection.name?.toLowerCase().includes(search);
//   });
// };

export const GroupProfile = () => {
    const params = useParams();
    const {document, error, isPending} = useDocument("groups", params.groupId!);
    const [group, setGroup] = useState<Group>();
    const [currentTab, setCurrentTab] = useState<string>("home");
    const [status, setStatus] = useState<string>("not_connected");
    // const posts = usePosts();
    const [connectionsQuery, setConnectionsQuery] = useState<string>("");
    // const connections = useConnections(connectionsQuery);

    useEffect(() => {
        if (document) {
            setGroup(document);
        }
    }, [document]);

    const handleConnectionAdd = useCallback(
        (): void => {
            setStatus("pending");
        },
        []
    );

    const handleConnectionRemove = useCallback(
        (): void => {
            setStatus("not_connected");
        },
        []
    );

    const handleTabsChange = useCallback(
        (event: ChangeEvent<{}>, value: string): void => {
            setCurrentTab(value);
        },
        []
    );

    const handleConnectionsQueryChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>): void => {
            setConnectionsQuery(event.target.value);
        },
        []
    );

    const showConnect = status === "not_connected";
    const showPending = status === "pending";

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
                            sx={{mt: 2}}
                        >
                            <Stack
                                alignItems={{xs: "start", sm: "start", md: "center"}}
                                direction="row"
                                spacing={2}
                            >
                                <Avatar

                                    src={group?.profileImageURL!}
                                    sx={{
                                        maxWidth: "140px",
                                        maxHeight: "140px",
                                        minHeight: "76px",
                                        minWidth: "75px",
                                        height: "12vw",
                                        width: "12vw",
                                    }}
                                />

                                <div>
                                    {/*<Typography*/}
                                    {/*  color="text.secondary"*/}
                                    {/*  variant="overline"*/}
                                    {/*>*/}
                                    {/*  {'Administration'}*/}
                                    {/*</Typography>*/}
                                    <Typography variant="h4">
                                        {group?.name}
                                    </Typography>
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
                                    <Typography
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
                                    </Typography>
                                </div>
                            </Stack>
                            <Box sx={{flexGrow: 1}}/>
                            <Stack
                                alignItems="center"
                                direction="row"
                                spacing={2}
                                sx={{
                                    display: {
                                        md: "block",
                                        xs: "none"
                                    }
                                }}
                            >
                                {showConnect && (
                                    <Button
                                        onClick={handleConnectionAdd}
                                        size="small"
                                        startIcon={(
                                            <SvgIcon>
                                                <UserPlus02Icon/>
                                            </SvgIcon>
                                        )}
                                        variant="outlined"
                                    >
                                        Connect
                                    </Button>
                                )}
                                {showPending && (
                                    <Button
                                        color="primary"
                                        onClick={handleConnectionRemove}
                                        size="small"
                                        variant="outlined"
                                    >
                                        Pending
                                    </Button>
                                )}
                                <Button
                                    // component={RouterLink}
                                    // href={paths.dashboard.chat}
                                    size="small"
                                    startIcon={(
                                        <SvgIcon>
                                            <MessageChatSquareIcon/>
                                        </SvgIcon>
                                    )}
                                    variant="contained"
                                >
                                    Send Message
                                </Button>
                            </Stack>
                            <Tooltip title="More options">
                                <IconButton>
                                    <SvgIcon>
                                        <DotsHorizontalIcon/>
                                    </SvgIcon>
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </div>
                    <Tabs
                        indicatorColor="primary"
                        onChange={handleTabsChange}
                        scrollButtons="auto"
                        sx={{mt: 2}}
                        textColor="primary"
                        value={currentTab}
                        variant="scrollable"
                    >
                        {tabs.map((tab) => (
                            <Tab
                                key={tab.value}
                                label={tab.label}
                                value={tab.value}
                                sx={{mx: {xs: 0, sm: 1, md: 2, lg: 3}}}
                            />
                        ))}
                    </Tabs>
                    <Divider/>
                    <Box sx={{mt: 3}}>
                        {currentTab === 'home' && (
                          <GroupPostsList groupId={params.groupId!} />
                        )}
                        {/*{currentTab === 'connections' && (*/}
                        {/*  <SocialConnections*/}
                        {/*    connections={connections}*/}
                        {/*    onQueryChange={handleConnectionsQueryChange}*/}
                        {/*    query={connectionsQuery}*/}
                        {/*  />*/}
                        {/*)}*/}
                    </Box>
                </Container>
            </Box>
        </>
    );
};
