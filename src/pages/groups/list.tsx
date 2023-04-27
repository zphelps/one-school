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
import {PostDialog} from "../../components/feed/create-post-dialog";
import {CreateGroupDialog} from "../../sections/groups/create-group-dialog";

interface Filters {
    query?: string;
    status?: string;
}

type SortDir = "asc" | "desc";

interface GroupsSearchState {
    filters: Filters;
    page: number;
    rowsPerPage: number;
}

const useGroupsSearch = () => {
    const [state, setState] = useState<GroupsSearchState>({
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

interface GroupsStoreState {
    groups: Group[];
    groupsCount: number;
}

export const Groups = () => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const groupsSearch = useGroupsSearch();
    const createDialog = useDialog();

    const handleAddClick = useCallback(
        (): void => {
            createDialog.handleOpen();
        },
        [createDialog.handleOpen]
    );

    useGroups();

    const [groupsStore, setGroupsStore] = useState<GroupsStoreState>({
        groups: [],
        groupsCount: 0
    });

    // @ts-ignore
    const groups = useSelector((state) => state.groups.data);

    const isMounted = useMounted();

    useEffect(() => {
            if (groups.length > 0 && isMounted()) {
                setGroupsStore({
                    // @ts-ignore
                    groups: groups.filter((group) => {
                        if (groupsSearch.state.filters.query
                            && !group.name.toLowerCase().includes(groupsSearch.state.filters.query.toLowerCase())) {
                            return false;
                        }
                        if(groupsSearch.state.filters.status) {
                            if(groupsSearch.state.filters.status === 'Administration') {
                                return group.category == 'Administration';
                            } else if(groupsSearch.state.filters.status === 'Academic') {
                                return group.category == 'Academic';
                            } else if(groupsSearch.state.filters.status === 'Athletics') {
                                return group.category == 'Athletics';
                            } else if (groupsSearch.state.filters.status === 'Leadership') {
                                return group.category == 'Leadership';
                            } else if (groupsSearch.state.filters.status === 'Theatre') {
                                return group.category == 'Theatre';
                            } else if (groupsSearch.state.filters.status === 'Arts & Culture') {
                                return group.category == 'Arts & Culture';
                            } else if (groupsSearch.state.filters.status === 'Community') {
                                return group.category == 'Community';
                            } else if (groupsSearch.state.filters.status === 'College/Career') {
                                return group.category == 'College/Career';
                            }
                            return false;
                        }
                        return true;
                    }),
                    groupsCount: groups.length
                });
            }
        },
        [groupsSearch.state, groups]
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
                                            onClick={handleAddClick}
                                        >
                                            Create
                                        </Button>
                                    </div>
                                </Stack>
                            </Box>
                            <Divider/>
                            <GroupListSearch
                                onFiltersChange={groupsSearch.handleFiltersChange}
                            />
                        </Container>
                        <Divider/>
                        <Container maxWidth="xl" sx={{mt: 2}}>
                            <Grid container spacing={2.5}>
                                {groupsStore.groupsCount > 0 && groupsStore.groups.map((group) => (
                                    <Grid key={group.id} item xs={12} sm={6} md={4} lg={3} xl={3} >
                                        <GroupCard group={group}/>
                                    </Grid>
                                ))}
                                {groupsStore.groupsCount === 0 && Array.from({length: 12}).map((_, index) => (
                                    <Grid key={index} item xs={12} sm={6} md={4} lg={3} xl={3} >
                                        <GroupCardSkeleton/>
                                    </Grid>
                                ))}
                            </Grid>
                        </Container>
                    </GroupListContainer>
                </Box>
            </Box>
            <CreateGroupDialog
                action="create"
                onAddComplete={createDialog.handleClose}
                onClose={createDialog.handleClose}
                open={createDialog.open}
            />
        </>
    );
};
