import type {ChangeEvent, MouseEvent} from "react";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import {Box, Button, Container, Divider, Grid, Stack, SvgIcon, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {Form} from "../../types/form";
import useForms from "../../hooks/forms/use-forms";
import {Seo} from "../../components/seo";
import {useDialog} from "../../hooks/use-dialog";
import {useMounted} from "../../hooks/use-mounted";
import {GroupListContainer} from "../../sections/groups/group-list-container";
import {FormListSearch} from "../../sections/forms/form-list-search";
import {FormCard} from "../../components/forms/form-card";
import GroupCardSkeleton from "../../components/groups/group-skeleton-card";
import {PostDialog} from "../../components/feed/create-post-dialog";
import {CreateGroupDialog} from "../../sections/groups/create-group-dialog";

interface Filters {
    query?: string;
    status?: string;
}

type SortDir = "asc" | "desc";

interface FormsSearchState {
    filters: Filters;
    page: number;
    rowsPerPage: number;
}

const useFormsSearch = () => {
    const [state, setState] = useState<FormsSearchState>({
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

interface FormsStoreState {
    forms: Form[];
    formsCount: number;
}

export const Forms = () => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const formsSearch = useFormsSearch();
    const createDialog = useDialog();

    const handleAddClick = useCallback(
        (): void => {
            createDialog.handleOpen();
        },
        [createDialog.handleOpen]
    );

    useForms();

    const [formsStore, setFormsStore] = useState<FormsStoreState>({
        forms: [],
        formsCount: 0
    });

    // @ts-ignore
    const forms = useSelector((state) => state.forms.data);

    const isMounted = useMounted();

    useEffect(() => {
            if (forms.length > 0 && isMounted()) {
                setFormsStore({
                    // @ts-ignore
                    forms: forms.filter((form) => {
                        if (formsSearch.state.filters.query
                            && !form.title.toLowerCase().includes(formsSearch.state.filters.query.toLowerCase())) {
                            return false;
                        }
                        if(formsSearch.state.filters.status) {
                            if(formsSearch.state.filters.status === 'Completed') {
                                return form.category == 'Completed';
                            } else if(formsSearch.state.filters.status === 'Incomplete') {
                                return form.category == 'Incomplete';
                            } else if(formsSearch.state.filters.status === 'Overdue') {
                                return form.category == 'Overdue';
                            }
                            return false;
                        }
                        return true;
                    }),
                    formsCount: forms.length
                });
            }
        },
        [formsSearch.state, forms]
    );

    return (
        <>
            <Seo title="Forms | OneSchool"/>
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
                                            Forms
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
                            <FormListSearch
                                onFiltersChange={formsSearch.handleFiltersChange}
                            />
                        </Container>
                        <Divider/>
                        <Container maxWidth="xl" sx={{mt: 2}}>
                            <Grid container spacing={2.5}>
                                {formsStore.formsCount > 0 && formsStore.forms.map((form) => (
                                    <Grid key={form.id} item xs={12} sm={6} md={4} lg={3} xl={3} >
                                        <FormCard form={form}/>
                                    </Grid>
                                ))}
                                {formsStore.formsCount === 0 && Array.from({length: 12}).map((_, index) => (
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
