import type {FC} from "react";
import {ChangeEvent, FormEvent, useCallback, useRef, useState} from "react";
import PropTypes from "prop-types";
import SearchMdIcon from "@untitled-ui/icons-react/build/esm/SearchMd";
import {
    Box, Button,
    Divider, IconButton,
    InputAdornment,
    OutlinedInput,
    Stack,
    SvgIcon,
    Tab,
    Tabs,
    TextField
} from "@mui/material";
import {useUpdateEffect} from "../../../hooks/use-update-effect";
import ClearIcon from "@mui/icons-material/Clear";
import {Settings} from "@mui/icons-material";

interface Filters {
    query?: string;
    leadership?: boolean;
    owners?: boolean;
    members?: boolean;
}

type TabValue = "all" | "owners" | "leadership" | "members";

interface TabOption {
    label: string;
    value: TabValue;
}

const tabs: TabOption[] = [
    {
        label: "All",
        value: "all"
    },
    {
        label: "Leadership",
        value: "leadership"
    },
    {
        label: "Owners",
        value: "owners"
    },
    {
        label: "Members",
        value: "members"
    },
];

type SortValue = "updatedAt|desc" | "updatedAt|asc" | "totalOrders|desc" | "totalOrders|asc";

interface SortOption {
    label: string;
    value: SortValue;
}

const sortOptions: SortOption[] = [
    {
        label: "Last update (newest)",
        value: "updatedAt|desc"
    },
    {
        label: "Last update (oldest)",
        value: "updatedAt|asc"
    },
    {
        label: "Total orders (highest)",
        value: "totalOrders|desc"
    },
    {
        label: "Total orders (lowest)",
        value: "totalOrders|asc"
    }
];

type SortDir = "asc" | "desc";

interface MembersListSearchProps {
    onFiltersChange?: (filters: Filters) => void;
    onSortChange?: (sort: { sortBy: string; sortDir: SortDir }) => void;
    sortBy?: string;
    sortDir?: SortDir;
}

export const MembersListSearch: FC<MembersListSearchProps> = (props) => {
    const {onFiltersChange, onSortChange, sortBy, sortDir} = props;
    const queryRef = useRef<HTMLInputElement | null>(null);
    const [currentTab, setCurrentTab] = useState<TabValue>("all");
    const [filters, setFilters] = useState<Filters>({});

    const handleFiltersUpdate = useCallback(
        () => {
            onFiltersChange?.(filters);
        },
        [filters, onFiltersChange]
    );

    useUpdateEffect(
        () => {
            handleFiltersUpdate();
        },
        [filters, handleFiltersUpdate]
    );

    const handleTabsChange = useCallback(
        (event: ChangeEvent<{}>, value: TabValue): void => {
            setCurrentTab(value);
            setFilters((prevState: any) => {
                const updatedFilters: Filters = {
                    ...prevState,
                    isLeadership: undefined,
                };

                if (value !== "all") {
                    updatedFilters[value] = true;
                }

                return updatedFilters;
            });
        },
        []
    );

    const handleQueryChange = useCallback(
        (event: FormEvent<HTMLFormElement>): void => {
            event.preventDefault();
            setFilters((prevState: any) => ({
                ...prevState,
                query: queryRef.current?.value
            }));
        },
        []
    );

    const handleSortChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>): void => {
            const [sortBy, sortDir] = event.target.value.split("|") as [string, SortDir];

            onSortChange?.({
                sortBy,
                sortDir
            });
        },
        [onSortChange]
    );

    return (
        <>
            <Stack direction={'row'} justifyContent={'space-between'}>
                <Tabs
                    indicatorColor="primary"
                    onChange={handleTabsChange}
                    scrollButtons="auto"
                    sx={{px: 3, py: 1, alignItems: 'end'}}
                    textColor="primary"
                    value={currentTab}
                    variant="scrollable"
                >
                    {tabs.map((tab) => (
                        <Tab
                            sx={{
                                px: 1,
                                borderRadius: 1.5,
                                '&:hover': {
                                    backgroundColor: 'action.hover'
                                }
                            }}
                            key={tab.value}
                            label={tab.label}
                            value={tab.value}
                        />
                    ))}
                </Tabs>
                <Button
                    sx={{my: 2, mr: 2}}
                    variant={'contained'}
                >
                    <Settings sx={{mr: 1}}/>
                    Manage Members
                </Button>
            </Stack>

            <Divider/>
            <Stack
                alignItems="center"
                direction="row"
                flexWrap="wrap"
                spacing={3}
                sx={{p: 3}}
            >
                <Box
                    component="form"
                    onSubmit={handleQueryChange}
                    sx={{flexGrow: 1}}
                >
                    <OutlinedInput
                        defaultValue=""
                        fullWidth
                        onChange={() => {
                            const query = queryRef.current?.value || "";
                            setFilters((prevState) => ({
                                ...prevState,
                                query
                            }));
                        }}
                        inputProps={{ref: queryRef}}
                        placeholder="Search members"
                        endAdornment={
                            queryRef.current?.value && (
                                <InputAdornment position="end">
                                    <IconButton edge="end" onClick={() => {
                                        queryRef.current!.value = "";
                                        const query = queryRef.current?.value || "";
                                        setFilters((prevState) => ({
                                            ...prevState,
                                            query
                                        }));
                                    }}>
                                        <ClearIcon/>
                                    </IconButton>
                                </InputAdornment>
                            )
                        }
                        startAdornment={(
                            <InputAdornment position="start">
                                <SvgIcon>
                                    <SearchMdIcon/>
                                </SvgIcon>
                            </InputAdornment>
                        )}
                    />
                </Box>
                {/*<TextField*/}
                {/*  label="Sort By"*/}
                {/*  name="sort"*/}
                {/*  onChange={handleSortChange}*/}
                {/*  select*/}
                {/*  SelectProps={{ native: true }}*/}
                {/*  value={`${sortBy}|${sortDir}`}*/}
                {/*>*/}
                {/*  {sortOptions.map((option) => (*/}
                {/*    <option*/}
                {/*      key={option.value}*/}
                {/*      value={option.value}*/}
                {/*    >*/}
                {/*      {option.label}*/}
                {/*    </option>*/}
                {/*  ))}*/}
                {/*</TextField>*/}
            </Stack>
        </>
    );
};

MembersListSearch.propTypes = {
    onFiltersChange: PropTypes.func,
    onSortChange: PropTypes.func,
    sortBy: PropTypes.string,
    sortDir: PropTypes.oneOf<SortDir>(["asc", "desc"])
};
