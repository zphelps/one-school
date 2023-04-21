import type { ChangeEvent, FC, FormEvent } from 'react';
import { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import {
  Box,
  Divider, IconButton,
  InputAdornment,
  OutlinedInput,
  Stack,
  SvgIcon,
  Tab,
  Tabs,
  TextField
} from "@mui/material";
import {useUpdateEffect} from "../../hooks/use-update-effect";
import ClearIcon from '@mui/icons-material/Clear';
interface Filters {
  query?: string;
  status?: string;
}

type TabValue = 'all'
    | 'administration'
    | 'academic'
    | 'athletics'
    | 'leadership'
    | 'theatre'
    | 'arts & culture'
    | 'community'
    | 'college/career';

interface TabOption {
  label: string;
  value: TabValue;
}

const tabOptions: TabOption[] = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Administration',
    value: 'administration'
  },
  {
    label: 'Academic',
    value: 'academic'
  },
  {
    label: 'Athletics',
    value: 'athletics'
  },
  {
    label: 'Leadership',
    value: 'leadership'
  },
  {
    label: 'Theatre',
    value: 'theatre'
  },
  {
    label: 'Arts & Culture',
    value: 'arts & culture'
  },
  {
    label: 'Community',
    value: 'community'
  },
  {
    label: 'College/Career',
    value: 'college/career'
  },
];
interface AnnouncementListSearchProps {
  onFiltersChange?: (filters: Filters) => void;
}

export const AnnouncementListSearch: FC<AnnouncementListSearchProps> = (props) => {
  const {
    onFiltersChange,
  } = props;
  const queryRef = useRef<HTMLInputElement | null>(null);
  const [currentTab, setCurrentTab] = useState<TabValue>('all');
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
      const status = tab === 'all' ? undefined : tab;

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
      const query = queryRef.current?.value || '';
      setFilters((prevState) => ({
        ...prevState,
        query
      }));
    },
    []
  );

  return (
    <div>
      {/*<Tabs*/}
      {/*  indicatorColor="primary"*/}
      {/*  onChange={handleTabsChange}*/}
      {/*  scrollButtons="auto"*/}
      {/*  textColor="primary"*/}
      {/*  value={currentTab}*/}
      {/*  variant="scrollable"*/}
      {/*>*/}
      {/*  {tabOptions.map((tab) => (*/}
      {/*    <Tab*/}
      {/*      key={tab.value}*/}
      {/*      label={tab.label}*/}
      {/*      value={tab.value}*/}
      {/*      sx={{*/}
      {/*        px: 1,*/}
      {/*        py: 1,*/}
      {/*        mr: 2,*/}
      {/*        '&:hover': {*/}
      {/*          backgroundColor: 'action.hover',*/}
      {/*          borderRadius: 1,*/}
      {/*        },*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  ))}*/}
      {/*</Tabs>*/}
      {/*<Divider />*/}
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        gap={3}
        sx={{ py: 2 }}
      >
        <Box
          component="form"
          onSubmit={handleQueryChange}
          sx={{ flexGrow: 1 }}
        >
          <OutlinedInput
            defaultValue=""
            fullWidth
            onChange={() => {
              const query = queryRef.current?.value || '';
              setFilters((prevState) => ({
                ...prevState,
                query
              }));
            }}
            inputProps={{ ref: queryRef }}
            name="orderNumber"
            placeholder="Search announcements..."
            endAdornment={
                queryRef.current?.value && (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => {
                        queryRef.current!.value = "";
                        const query = queryRef.current?.value || '';
                        setFilters((prevState) => ({
                          ...prevState,
                          query
                        }));
                      }}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                )
            }
            startAdornment={(
              <InputAdornment position="start">
                <SvgIcon>
                  <SearchMdIcon />
                </SvgIcon>
              </InputAdornment>
            )}
          />
        </Box>
      </Stack>
    </div>
  );
};

AnnouncementListSearch.propTypes = {
  onFiltersChange: PropTypes.func,
};
