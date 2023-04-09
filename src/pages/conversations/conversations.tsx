import { useCallback, useEffect, useRef, useState } from 'react';
import Menu01Icon from '@untitled-ui/icons-react/build/esm/Menu01';
import type { Theme } from '@mui/material';
import { Box, Divider, IconButton, SvgIcon, useMediaQuery } from '@mui/material';
import {useSearchParams} from "../../hooks/use-search-params";
import {Seo} from "../../components/seo";
import {ConversationsSidebar} from "../../sections/conversations/conversations-sidebar";
import {ConversationContainer} from "../../sections/conversations/conversation-container";
import {ConversationThread} from "../../sections/conversations/conversation-thread";
import {ConversationComposer} from "../../sections/conversations/conversation-composer";
import {ConversationBlank} from "../../sections/conversations/conversation-blank";
import useThreads from "../../hooks/conversations/use-threads";

/**
 * NOTE:
 * In our case there two possible routes
 * one that contains /chat and one with a chat?threadKey={{threadKey}}
 * if threadKey does not exist, it means that the chat is in compose mode
 */

// const useThreads = (): void => {
//   const dispatch = useDispatch();
//
//   const handleThreadsGet = useCallback(
//     (): void => {
//       dispatch(thunks.getThreads());
//     },
//     [dispatch]
//   );
//
//   useEffect(
//     () => {
//       handleThreadsGet();
//     },
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     []
//   );
// };

const useSidebar = () => {
  const searchParams = useSearchParams();
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const [open, setOpen] = useState(mdUp);

  const handleScreenResize = useCallback(
    (): void => {
      if (!mdUp) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    },
    [mdUp]
  );

  useEffect(
    () => {
      handleScreenResize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mdUp]
  );

  const handeParamsUpdate = useCallback(
    (): void => {
      if (!mdUp) {
        setOpen(false);
      }
    },
    [mdUp]
  );

  useEffect(
    () => {
      handeParamsUpdate();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams]
  );

  const handleToggle = useCallback(
    (): void => {
      setOpen((prevState) => !prevState);
    },
    []
  );

  const handleClose = useCallback(
    (): void => {
      setOpen(false);
    },
    []
  );

  return {
    handleToggle,
    handleClose,
    open
  };
};

export const Conversations = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();
  const compose = searchParams.get('compose') === 'true';
  const threadKey = searchParams.get('threadKey') || undefined;
  const sidebar = useSidebar();

  useThreads();

  const view = threadKey
    ? 'thread'
    : compose
      ? 'compose'
      : 'blank';

  return (
    <>
      <Seo title="Conversations | OneSchool" />
      <Divider />
      <Box
        component="main"
        sx={{
          backgroundColor: 'background.paper',
          flex: '1 1 auto',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Box
          ref={rootRef}
          sx={{
            bottom: 0,
            display: 'flex',
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0
          }}
        >
          <ConversationsSidebar
            container={rootRef.current}
            onClose={sidebar.handleClose}
            open={sidebar.open}
          />
          <ConversationContainer open={sidebar.open}>
            <Box sx={{ p: 2 }}>
              <IconButton onClick={sidebar.handleToggle}>
                <SvgIcon>
                  <Menu01Icon />
                </SvgIcon>
              </IconButton>
            </Box>
            <Divider />
            {view === 'thread' && <ConversationThread threadKey={threadKey!} />}
            {view === 'compose' && <ConversationComposer />}
            {view === 'blank' && <ConversationBlank />}
          </ConversationContainer>
        </Box>
      </Box>
    </>
  );
};
