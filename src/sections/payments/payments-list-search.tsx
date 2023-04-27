import type {ChangeEvent, FC, FormEvent} from "react";
import {useCallback, useRef, useState} from "react";
import PropTypes from "prop-types";
import SearchMdIcon from "@untitled-ui/icons-react/build/esm/SearchMd";
import {
    Box,
    Divider,
    InputAdornment,
    OutlinedInput,
    Stack,
    SvgIcon,
    Tab,
    Tabs,
    TextField, Typography
} from "@mui/material";
import {useUpdateEffect} from "../../hooks/use-update-effect";

interface Filters {
    query?: string;
    status?: string;
}

type TabValue = "upcoming" | "paid" | "overdue";

interface TabOption {
    label: string;
    value: TabValue;
}

const tabOptions: TabOption[] = [
    {
        label: "Upcoming",
        value: "upcoming"
    },
    {
        label: "Paid",
        value: "paid"
    },
    {
        label: "Overdue",
        value: "overdue"
    },
];

type SortDir = "asc" | "desc";

interface SortOption {
    label: string;
    value: SortDir;
}

const sortOptions: SortOption[] = [
    {
        label: "Newest",
        value: "desc"
    },
    {
        label: "Oldest",
        value: "asc"
    }
];

interface PaymentsListSearchProps {
    onFiltersChange?: (filters: Filters) => void;
    onSortChange?: (sort: SortDir) => void;
    sortBy?: string;
    sortDir?: "asc" | "desc";
}

export const PaymentsListSearch: FC<PaymentsListSearchProps> = (props) => {
    const {
        onFiltersChange,
        onSortChange,
        // sortBy = 'createdAt',
        sortDir = "asc"
    } = props;
    const queryRef = useRef<HTMLInputElement | null>(null);
    const [currentTab, setCurrentTab] = useState<TabValue>("upcoming");
    const [filters, setFilters] = useState<Filters>({
        query: undefined,
        status: undefined
    });

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
        (event: ChangeEvent<{}>, tab: TabValue): void => {
            setCurrentTab(tab);
            const status = tab === "upcoming" ? undefined : tab;

            setFilters((prevState) => ({
                ...prevState,
                status
            }));
        },
        []
    );

    const handleQueryChange = useCallback(
        (event: FormEvent<HTMLFormElement>): void => {
            event.preventDefault();
            const query = queryRef.current?.value || "";
            setFilters((prevState) => ({
                ...prevState,
                query
            }));
        },
        []
    );

    const handleSortChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>): void => {
            const sortDir = event.target.value as SortDir;
            onSortChange?.(sortDir);
        },
        [onSortChange]
    );

    return (
        <div>
            <Tabs
                indicatorColor="primary"
                onChange={handleTabsChange}
                scrollButtons="auto"
                sx={{px: 3}}
                textColor="primary"
                value={currentTab}
                variant="scrollable"
            >
                {tabOptions.map((tab) => (
                    <Tab
                        key={tab.value}
                        label={tab.label}
                        value={tab.value}
                        sx={{
                            px: 1,
                            py: 1,
                            mr: 2,
                            '&:hover': {
                                backgroundColor: 'action.hover',
                                borderRadius: 1,
                            },
                        }}
                    />
                ))}
            </Tabs>
            <Divider/>
            <Stack
                alignItems="center"
                direction="row"
                flexWrap="wrap"
                gap={3}
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
                        inputProps={{ref: queryRef}}
                        name="paymentNumber"
                        placeholder="Search by payment name"
                        startAdornment={(
                            <InputAdornment position="start">
                                <SvgIcon>
                                    <SearchMdIcon/>
                                </SvgIcon>
                            </InputAdornment>
                        )}
                    />
                </Box>
                <TextField
                    label="Sort By"
                    name="sort"
                    onChange={handleSortChange}
                    select
                    SelectProps={{native: true}}
                    value={sortDir}
                >
                    {sortOptions.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </TextField>
            </Stack>
        </div>
    );
};

PaymentsListSearch.propTypes = {
    onFiltersChange: PropTypes.func,
    onSortChange: PropTypes.func,
    sortBy: PropTypes.string,
    sortDir: PropTypes.oneOf<SortDir>(["asc", "desc"])
};
