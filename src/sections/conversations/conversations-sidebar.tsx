import type {ChangeEvent, FC} from "react";
import {useCallback, useState} from "react";
import PropTypes from "prop-types";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import XIcon from "@untitled-ui/icons-react/build/esm/X";
import type {Theme} from "@mui/material";
import {
    Box,
    Button,
    Drawer,
    IconButton,
    Stack,
    SvgIcon,
    Typography,
    useMediaQuery
} from "@mui/material";
import {Thread} from "../../types/conversation";
import {useSelector} from "react-redux";
import {useRouter} from "../../hooks/use-router";
import {paths} from "../../paths";
import {User} from "../../types/user";
import {Scrollbar} from "../../components/scrollbar";
import {ConversationsSidebarSearch} from "./conversations-sidebar-search";
import {ConversationsThreadItem} from "./conversations-thread-item";
import {useAuth} from "../../hooks/use-auth";
import {useCollection} from "../../hooks/firebase/useCollection";

const useThreads = (): { byId: Record<string, Thread>, allIds: string[] } => {
    // @ts-ignore
    return useSelector((state) => state.conversations.threads);
};

const useCurrentThreadId = (): string | undefined => {
    // @ts-ignore
    return useSelector((state) => state.conversations.currentThreadId);
};

interface ConversationsSidebarProps {
    container?: HTMLDivElement | null;
    onClose?: () => void;
    open?: boolean;
}

export const ConversationsSidebar: FC<ConversationsSidebarProps> = (props) => {
    const {container, onClose, open, ...other} = props;
    const user = useAuth().user;
    const router = useRouter();
    const threads = useThreads();
    const currentThreadId = useCurrentThreadId();
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

    const {documents: users, isPending, error} = useCollection(
        "users",
        ["id", "!=", user?.id],
        []
    );

    const handleCompose = useCallback(
        (): void => {
            router.push(paths.conversations + "?compose=true");
        },
        [router]
    );

    const handleSearchChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
            const {value} = event.target;

            setSearchQuery(value);

            if (!value) {
                setSearchResults([]);
                return;
            }

            try {
                if (!users) return;
                setSearchResults(users);
            } catch (err) {
                console.error(err);
            }
        },
        [users]
    );

    const handleSearchClickAway = useCallback(
        (): void => {
            if (searchFocused) {
                setSearchFocused(false);
                setSearchQuery("");
            }
        },
        [searchFocused]
    );

    const handleSearchFocus = useCallback(
        (): void => {
            setSearchFocused(true);
        },
        []
    );

    const handleSearchSelect = useCallback(
        (user: User): void => {
            // We use the user ID as a thread key
            const threadKey = user.id;

            setSearchFocused(false);
            setSearchQuery("");

            router.push(paths.conversations + `?threadKey=${threadKey}`);
        },
        [router]
    );

    const handleThreadSelect = useCallback(
        (threadId: string): void => {
            // const thread = threads.byId[threadId];
            // const threadKey = getThreadKey(thread, user!.id);
            //
            // console.log("Thread:", threadId, thread, threadKey)
            //
            // if (!threadKey) {
            //     router.push(paths.conversations);
            // } else {
            //     router.push(paths.conversations + `?threadKey=${threadId}`);
            // }

            router.push(paths.conversations + `?threadKey=${threadId}`);
        },
        [router, threads, user]
    );

    const content = (
        <div>
            <Stack
                alignItems="center"
                direction="row"
                spacing={2}
                sx={{p: 2}}
            >
                <Typography
                    variant="h5"
                    sx={{flexGrow: 1}}
                >
                    Conversations
                </Typography>
                <Button
                    onClick={handleCompose}
                    startIcon={(
                        <SvgIcon>
                            <PlusIcon/>
                        </SvgIcon>
                    )}
                    variant="contained"
                >
                    Group
                </Button>
                {!mdUp && (
                    <IconButton onClick={onClose}>
                        <SvgIcon>
                            <XIcon/>
                        </SvgIcon>
                    </IconButton>
                )}
            </Stack>
            <ConversationsSidebarSearch
                isFocused={searchFocused}
                onChange={handleSearchChange}
                onClickAway={handleSearchClickAway}
                onFocus={handleSearchFocus}
                onSelect={handleSearchSelect}
                query={searchQuery}
                results={searchResults}
            />
            <Box sx={{display: searchFocused ? "none" : "block"}}>
                <Scrollbar>
                    <Stack
                        component="ul"
                        spacing={0.5}
                        sx={{
                            listStyle: "none",
                            m: 0,
                            p: 2
                        }}
                    >
                        {threads.allIds.map((threadId) => (
                            <ConversationsThreadItem
                                active={currentThreadId === threadId}
                                key={threadId}
                                onSelect={(): void => handleThreadSelect(threadId)}
                                thread={threads.byId[threadId]}
                            />
                        ))}
                    </Stack>
                </Scrollbar>
            </Box>
        </div>
    );

    if (mdUp) {
        return (
            <Drawer
                anchor="left"
                open={open}
                PaperProps={{
                    sx: {
                        position: "relative",
                        width: 380
                    }
                }}
                SlideProps={{container}}
                variant="persistent"
                {...other}
            >
                {content}
            </Drawer>
        );
    }

    return (
        <Drawer
            anchor="left"
            hideBackdrop
            ModalProps={{
                container,
                sx: {
                    pointerEvents: "none",
                    position: "absolute"
                }
            }}
            onClose={onClose}
            open={open}
            PaperProps={{
                sx: {
                    maxWidth: "100%",
                    width: 380,
                    pointerEvents: "auto",
                    position: "absolute"
                }
            }}
            SlideProps={{container}}
            variant="temporary"
            {...other}
        >
            {content}
        </Drawer>
    );
};

ConversationsSidebar.propTypes = {
    container: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool
};
