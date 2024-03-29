import type { ChangeEvent, FocusEvent } from 'react';
import { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import {
  Avatar,
  Box,
  ClickAwayListener,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  OutlinedInput,
  SvgIcon,
  Typography
} from '@mui/material';
import {User} from "../../types/user";
import {Tip} from "../../components/tip";

interface ConversationsSidebarSearchProps {
  isFocused?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickAway?: () => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onSelect?: (result: User) => void;
  query?: string;
  results?: User[];
}

export const ConversationsSidebarSearch = forwardRef<HTMLDivElement, ConversationsSidebarSearchProps>((
  props,
  ref
) => {
  const {
    isFocused,
    onChange,
    onClickAway = () => {},
    onFocus,
    onSelect,
    query = '',
    results = [],
    ...other
  } = props;

  const handleSelect = useCallback(
    (result: User): void => {
      onSelect?.(result);
    },
    [onSelect]
  );

  const showTip = isFocused && !query;
  const showResults = isFocused && query;
  const hasResults = results.length > 0;

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <Box
        ref={ref}
        sx={{ p: 2 }}
        {...other}
      >
        <OutlinedInput
          fullWidth
          onChange={onChange}
          onFocus={onFocus}
          placeholder="Search OneSchool users"
          startAdornment={(
            <InputAdornment position="start">
              <SvgIcon>
                <SearchMdIcon />
              </SvgIcon>
            </InputAdornment>
          )}
          value={query}
        />
        {showTip && (
          <Box sx={{ py: 2 }}>
            <Tip message="Enter a contact name" />
          </Box>
        )}
        {showResults && (
          <>
            {
              hasResults
                ? (
                  <Box sx={{ py: 2 }}>
                    <Typography
                      color="text.secondary"
                      variant="subtitle2"
                    >
                      Users
                    </Typography>
                    <List>
                      {results.map((contact) => (
                        <ListItemButton
                          key={contact.id}
                          onClick={(): void => handleSelect(contact)}
                        >
                          <ListItemAvatar>
                            <Avatar
                              src={contact.imageURL}
                              sx={{
                                height: 32,
                                width: 32
                              }}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={`${contact.firstName} ${contact.lastName}`}
                            primaryTypographyProps={{
                              noWrap: true,
                              variant: 'subtitle2'
                            }}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </Box>
                )
                : (
                  <Box sx={{ py: 2 }}>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                    >
                      We couldn&apos;t find any matches for &quot;{query}&quot;. Try checking
                      for typos or using complete words.
                    </Typography>
                  </Box>
                )
            }
          </>
        )}
      </Box>
    </ClickAwayListener>
  );
});

ConversationsSidebarSearch.propTypes = {
  isFocused: PropTypes.bool,
  onChange: PropTypes.func,
  onClickAway: PropTypes.func,
  onFocus: PropTypes.func,
  onSelect: PropTypes.func,
  query: PropTypes.string,
  results: PropTypes.array
};
