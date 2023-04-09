import type {ChangeEvent, FC, MouseEvent} from "react";
import { useCallback, useEffect, useMemo, useState } from 'react';
import Download01Icon from '@untitled-ui/icons-react/build/esm/Download01';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import Upload01Icon from '@untitled-ui/icons-react/build/esm/Upload01';
import { Box, Button, Card, Container, Stack, SvgIcon, Typography } from '@mui/material';
import {Seo} from "../../../components/seo";
import {MembersListSearch} from "./member-list-search";
import {GroupMember} from "../../../types/group-member";
import {useSelection} from "../../../hooks/use-selection";
import {MembersListTable} from "./members-list-table";
import useGroupMembers from "../../../hooks/members/use-group-members";
import {useSelector} from "react-redux";
import {applyPagination} from "../../../utils/apply-pagination";

interface Filters {
  query?: string;
  isLeadership?: boolean;
}

interface MembersSearchState {
  filters: Filters;
  page: number;
  rowsPerPage: number;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}

const useMembersSearch = () => {
  const [state, setState] = useState<MembersSearchState>({
    filters: {
      query: undefined,
      isLeadership: undefined,
    },
    page: 0,
    rowsPerPage: 5,
    sortBy: 'updatedAt',
    sortDir: 'desc'
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
    (sort: { sortBy: string; sortDir: 'asc' | 'desc'; }): void => {
      setState((prevState) => ({
        ...prevState,
        sortBy: sort.sortBy,
        sortDir: sort.sortDir
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

interface MembersStoreState {
  members: GroupMember[];
  memberCount: number;
}

// const useMembersStore = (searchState: MembersSearchState) => {
//   const isMounted = useMounted();
//   const [state, setState] = useState<MembersStoreState>({
//     members: [],
//     memberCount: 0
//   });
//
//   const handleCustomersGet = useCallback(
//     async () => {
//       try {
//         const response = await customersApi.getCustomers(searchState);
//
//         if (isMounted()) {
//           setState({
//             members: response.data,
//             memberCount: response.count
//           });
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     },
//     [searchState, isMounted]
//   );
//
//   useEffect(
//     () => {
//       handleCustomersGet();
//     },
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [searchState]
//   );
//
//   return {
//     ...state
//   };
// };

const useMembersIds = (members: GroupMember[] = []) => {
  return useMemo(
    () => {
      return members.map((member) => member.id);
    },
    [members]
  );
};

interface GroupMembersListProps {
    groupID: string;
}

export const GroupMembersList: FC<GroupMembersListProps> = (props) => {
  const {groupID} = props;
  const membersSearch = useMembersSearch();
  // const membersStore = useMembersStore(membersSearch.state);

  const [membersStore, setMembersStore] = useState<MembersStoreState>({
    members: [],
    memberCount: 0
  });

  useGroupMembers(groupID)

  // @ts-ignore
  const allGroupsMembers = useSelector((state) => state.groupMembers.data);

  useMemo(() => {
        if (allGroupsMembers[groupID] && allGroupsMembers[groupID].length > 0) {
          const members = applyPagination(allGroupsMembers[groupID].filter((member: GroupMember) => {
              if (membersSearch.state.filters.query) {
                const memberName = `${member.firstName} ${member.lastName}`;
                return memberName.toLowerCase().includes(membersSearch.state.filters.query.toLowerCase());
              }
              return true;
            }),
            membersSearch.state.page,
            membersSearch.state.rowsPerPage
          );
          setMembersStore({
            // @ts-ignore
            members: members,
            memberCount: allGroupsMembers[groupID].length
          });
        }
      },
      [
          allGroupsMembers,
          membersSearch.state.page,
          membersSearch.state.rowsPerPage,
          membersSearch.state.filters.query
      ]
  );

  const membersIds = useMembersIds(membersStore.members);
  const membersSelection = useSelection<string>(membersIds);

  return (
    <>
      <Seo title="Members | OneSchool" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Card>
          <MembersListSearch
              onFiltersChange={membersSearch.handleFiltersChange}
              onSortChange={membersSearch.handleSortChange}
              sortBy={membersSearch.state.sortBy}
              sortDir={membersSearch.state.sortDir}
          />
          <MembersListTable
              count={membersStore.memberCount}
              items={membersStore.members}
              onDeselectAll={membersSelection.handleDeselectAll}
              onDeselectOne={membersSelection.handleDeselectOne}
              onPageChange={membersSearch.handlePageChange}
              onRowsPerPageChange={membersSearch.handleRowsPerPageChange}
              onSelectAll={membersSelection.handleSelectAll}
              onSelectOne={membersSelection.handleSelectOne}
              page={membersSearch.state.page}
              rowsPerPage={membersSearch.state.rowsPerPage}
              selected={membersSelection.selected}
          />
        </Card>
      </Box>
    </>
  );
};
