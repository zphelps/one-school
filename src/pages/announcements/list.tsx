import type {ChangeEvent, MouseEvent} from "react";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import {Box, Button, Container, Divider, Grid, Stack, SvgIcon, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {Group} from "../../types/group";
import useGroups from "../../hooks/groups/use-groups";
import {Seo} from "../../components/seo";
import {useDialog} from "../../hooks/use-dialog";
import {useMounted} from "../../hooks/use-mounted";
import {GroupListContainer} from "../../sections/groups/group-list-container";
import {GroupListSearch} from "../../sections/groups/group-list-search";
import {GroupCard} from "../../components/groups/group-card";
import GroupCardSkeleton from "../../components/groups/group-skeleton-card";
import {AnnouncementListSearch} from "../../sections/announcements/announcement-list-search";
import useAnnouncements from "../../hooks/announcements/use-announcements";
import {AnnouncementCard} from "../../components/announcements/announcement-card";
import {Announcement} from "../../types/announcement";
import {AnnouncementComposer} from "../../sections/announcements/announcement-composer";

interface Filters {
    query?: string;
    status?: string;
}
interface AnnouncementsSearchState {
    filters: Filters;
    page: number;
    rowsPerPage: number;
}

const useAnnouncementsSearch = () => {
    const [state, setState] = useState<AnnouncementsSearchState>({
        filters: {
            query: undefined,
            status: undefined
        },
        page: 0,
        rowsPerPage: 5,
    });

    const handleFiltersChange = useCallback(
        (filters: Filters): void => {
            setState((prevState) => ({
                ...prevState,
                filters
            }));
        },
        []
    );

    const handlePageChange = useCallback(
        (event: MouseEvent<HTMLButtonElement> | null, page: number): void => {
            setState((prevState) => ({
                ...prevState,
                page
            }));
        },
        []
    );

    const handleRowsPerPageChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>): void => {
            setState((prevState) => ({
                ...prevState,
                rowsPerPage: parseInt(event.target.value, 10)
            }));
        },
        []
    );

    return {
        handleFiltersChange,
        handlePageChange,
        handleRowsPerPageChange,
        state
    };
};

interface AnnouncementsStoreState {
    announcements: Announcement[];
    announcementsCount: number;
}

interface ComposerState {
    isFullScreen: boolean;
    isOpen: boolean;
    message: string;
    subject: string;
    to: string;
}

const useComposer = () => {
    const initialState: ComposerState = {
        isFullScreen: false,
        isOpen: false,
        message: '',
        subject: '',
        to: ''
    };

    const [state, setState] = useState<ComposerState>(initialState);

    const handleOpen = useCallback(
        (): void => {
            setState((prevState) => ({
                ...prevState,
                isOpen: true
            }));
        },
        []
    );

    const handleClose = useCallback(
        (): void => {
            setState(initialState);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const handleMaximize = useCallback(
        (): void => {
            setState((prevState) => ({
                ...prevState,
                isFullScreen: true
            }));
        },
        []
    );

    const handleMinimize = useCallback(
        (): void => {
            setState((prevState) => ({
                ...prevState,
                isFullScreen: false
            }));
        },
        []
    );

    const handleMessageChange = useCallback(
        (message: string): void => {
            setState((prevState) => ({
                ...prevState,
                message
            }));
        },
        []
    );

    const handleSubjectChange = useCallback(
        (subject: string): void => {
            setState((prevState) => ({
                ...prevState,
                subject
            }));
        },
        []
    );

    const handleToChange = useCallback(
        (to: string): void => {
            setState((prevState) => ({
                ...prevState,
                to
            }));
        },
        []
    );

    return {
        ...state,
        handleClose,
        handleMaximize,
        handleMessageChange,
        handleMinimize,
        handleOpen,
        handleSubjectChange,
        handleToChange
    };
};

export const Announcements = () => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const announcementsSearch = useAnnouncementsSearch();
    const dialog = useDialog<string>();
    const composer = useComposer();

    useAnnouncements();

    const [announcementsStore, setAnnouncementsStore] = useState<AnnouncementsStoreState>({
        announcements: [],
        announcementsCount: 0
    });

    // @ts-ignore
    const announcements = useSelector((state) => state.announcements.data);

    const isMounted = useMounted();

    useEffect(() => {
            if (announcements.length > 0 && isMounted()) {
                setAnnouncementsStore({
                    // @ts-ignore
                    announcements: announcements.filter((announcement) => {
                        if (announcementsSearch.state.filters.query) {
                            return announcement.body.toLowerCase().includes(announcementsSearch.state.filters.query.toLowerCase());
                        }
                        return true;
                    }),
                    announcementsCount: announcements.length
                });
            }
        },
        [announcementsSearch.state, announcements]
    );

    return (
        <>
            <Seo title="Announcements | OneSchool"/>
            <Divider/>
            <Box
                component="main"
                ref={rootRef}
                sx={{
                    display: "flex",
                    flex: "1 1 auto",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                <Box
                    ref={rootRef}
                    sx={{
                        bottom: 0,
                        display: "flex",
                        left: 0,
                        position: "absolute",
                        right: 0,
                        top: 0,
                    }}
                >
                    <GroupListContainer>
                        <Container maxWidth={'xl'}>
                            <Box sx={{py: 2}}>
                                <Stack
                                    // alignItems="flex-start"
                                    direction="row"
                                    justifyContent="space-between"
                                    spacing={4}
                                >
                                    <div>
                                        <Typography variant="h4">
                                            Announcements
                                        </Typography>
                                    </div>
                                    <div>
                                        <Button
                                            startIcon={(
                                                <SvgIcon>
                                                    <PlusIcon/>
                                                </SvgIcon>
                                            )}
                                            onClick={() => composer.handleOpen()}
                                            variant="contained"
                                        >
                                            Create
                                        </Button>
                                    </div>
                                </Stack>
                            </Box>
                            <Divider/>
                            <AnnouncementListSearch
                                onFiltersChange={announcementsSearch.handleFiltersChange}
                            />
                        </Container>
                        <Divider/>
                        <Container maxWidth="xl" sx={{mt: 2}}>
                            <Grid container spacing={2.5}>
                                {announcementsStore.announcementsCount > 0
                                    && announcementsStore.announcements.map((announcement) => (
                                    <Grid key={announcement.id} item xs={12} >
                                        <AnnouncementCard announcement={announcement}/>
                                    </Grid>
                                ))}
                                {announcementsStore.announcementsCount === 0 && Array.from({length: 12}).map((_, index) => (
                                    <Grid key={index} item xs={12} >
                                        <GroupCardSkeleton/>
                                    </Grid>
                                ))}
                            </Grid>
                        </Container>
                    </GroupListContainer>
                </Box>
            </Box>
            <AnnouncementComposer
                maximize={composer.isFullScreen}
                message={composer.message}
                onClose={composer.handleClose}
                onMaximize={composer.handleMaximize}
                onMessageChange={composer.handleMessageChange}
                onMinimize={composer.handleMinimize}
                onSubjectChange={composer.handleSubjectChange}
                onToChange={composer.handleToChange}
                open={composer.isOpen}
                subject={composer.subject}
                to={composer.to}
            />
        </>
    );
};
