import type {ChangeEvent, MouseEvent} from "react";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import {Box, Button, Container, Divider, Grid, Stack, SvgIcon, Typography} from "@mui/material";
import {CalendarEvent} from "../../types/calendar";
import useCalendarEvents from "../../hooks/events/use-calendar-events";
import {useSelector} from "react-redux";
import {Group} from "../../types/group";
import useGroups from "../../hooks/groups/use-groups";
import {Seo} from "../../components/seo";
import {useDialog} from "../../hooks/use-dialog";
import {useMounted} from "../../hooks/use-mounted";
import {GroupListContainer} from "../../sections/groups/group-list-container";
import {GroupListSearch} from "../../sections/groups/group-list-search";
import {GroupCard} from "../../components/groups/group-card";

interface Filters {
    query?: string;
    status?: string;
}

type SortDir = "asc" | "desc";

interface GroupsSearchState {
    filters: Filters;
    page: number;
    rowsPerPage: number;
    sortBy?: string;
    sortDir?: SortDir;
}

const useGroupsSearch = () => {
    const [state, setState] = useState<GroupsSearchState>({
        filters: {
            query: undefined,
            status: undefined
        },
        page: 0,
        rowsPerPage: 5,
        sortBy: "createdAt",
        sortDir: "desc"
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

    const handleSortChange = useCallback(
        (sortDir: SortDir): void => {
            setState((prevState) => ({
                ...prevState,
                sortDir
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
        handleSortChange,
        handlePageChange,
        handleRowsPerPageChange,
        state
    };
};

interface GroupsStoreState {
    groups: Group[];
    groupsCount: number;
}

const useCurrentGroup = (groups: Group[], groupID?: string): Group | undefined => {
    return useMemo(
        (): Group | undefined => {
            if (!groupID) {
                return undefined;
            }

            return groups.find((group) => group.id === groupID);
        },
        [groups, groupID]
    );
};

export const Groups = () => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const groupsSearch = useGroupsSearch();
    // const groupsStore = useGroupsStore(groupsSearch.state);
    const dialog = useDialog<string>();

    useGroups();

    const [groupsStore, setGroupsStore] = useState<GroupsStoreState>({
        groups: [],
        groupsCount: 0
    });

    // @ts-ignore
    const groups = useSelector((state) => state.groups.data);

    const currentGroup = useCurrentGroup(groupsStore.groups, dialog.data);

    const isMounted = useMounted();

    useEffect(() => {
            if (groups.length > 0 && isMounted()) {
                setGroupsStore({
                    // @ts-ignore
                    groups: groups.filter((group) => {
                        if (groupsSearch.state.filters.query) {
                            return group.name.toLowerCase().includes(groupsSearch.state.filters.query.toLowerCase());
                        }
                        return true;
                    }),
                    groupsCount: groups.length
                });
            }
        },
        [groupsSearch.state, groups]
    );

    const handleOrderOpen = useCallback(
        (orderId: string): void => {
            // Close drawer if is the same order

            if (dialog.open && dialog.data === orderId) {
                dialog.handleClose();
                return;
            }

            dialog.handleOpen(orderId);
        },
        [dialog]
    );

    return (
        <>
            <Seo title="Groups | OneSchool"/>
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
                    <GroupListContainer open={dialog.open}>
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
                                            Groups
                                        </Typography>
                                    </div>
                                    <div>
                                        <Button
                                            startIcon={(
                                                <SvgIcon>
                                                    <PlusIcon/>
                                                </SvgIcon>
                                            )}
                                            variant="contained"
                                        >
                                            Create
                                        </Button>
                                    </div>
                                </Stack>
                            </Box>
                            <Divider/>
                            <GroupListSearch
                                onFiltersChange={groupsSearch.handleFiltersChange}
                                onSortChange={groupsSearch.handleSortChange}
                                sortBy={groupsSearch.state.sortBy}
                                sortDir={groupsSearch.state.sortDir}
                            />
                        </Container>
                        <Divider/>
                        <Container maxWidth="xl" sx={{mt: 2}}>
                            <Grid container spacing={2}>
                                {groupsStore.groupsCount > 0 && groupsStore.groups.map((group) => (
                                    <Grid key={group.id} item xs={12} sm={6} md={4} lg={3} xl={3} >
                                        <GroupCard group={group}/>
                                    </Grid>
                                ))}
                            </Grid>
                        </Container>


                        {/*<GroupListTable*/}
                        {/*  count={groupsStore.groupsCount}*/}
                        {/*  items={groupsStore.groups}*/}
                        {/*  onPageChange={groupsSearch.handlePageChange}*/}
                        {/*  onRowsPerPageChange={groupsSearch.handleRowsPerPageChange}*/}
                        {/*  onSelect={handleOrderOpen}*/}
                        {/*  page={groupsSearch.state.page}*/}
                        {/*  rowsPerPage={groupsSearch.state.rowsPerPage}*/}
                        {/*/>*/}
                    </GroupListContainer>
                </Box>
            </Box>
        </>
    );
};
