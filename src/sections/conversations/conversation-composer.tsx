import type { FC } from 'react';
import { useCallback, useState } from 'react';
import { Box, Divider } from '@mui/material';
import {User} from "../../types/user";
import {paths} from "../../paths";
import {ConversationComposerRecipients} from "./conversation-composer-recipients";
import {ConversationMessageAdd} from "./conversation-message-add";
import {useDispatch} from "react-redux";
import {useRouter} from "../../hooks/use-router";

const useRecipients = () => {
  const [recipients, setRecipients] = useState<User[]>([]);

  const handleRecipientAdd = useCallback(
    (recipient: User): void => {
      setRecipients((prevState) => {
        const found = prevState.find((_recipient) => _recipient.id === recipient.id);

        if (found) {
          return prevState;
        }

        return [...prevState, recipient];
      });
    },
    []
  );

  const handleRecipientRemove = useCallback(
    (recipientId: string): void => {
      setRecipients((prevState) => {
        return prevState.filter((recipient) => recipient.id !== recipientId);
      });
    },
    []
  );

  return {
    handleRecipientAdd,
    handleRecipientRemove,
    recipients
  };
};

interface ConversationComposerProps {}

export const ConversationComposer: FC<ConversationComposerProps> = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { handleRecipientAdd, handleRecipientRemove, recipients } = useRecipients();

  // const handleSend = useCallback(
  //   async (body: string): Promise<void> => {
  //     const recipientIds = recipients.map((recipient) => recipient.id);
  //
  //     let threadId: string;
  //
  //     try {
  //       // Handle send message and redirect to the new thread
  //       threadId = await dispatch(thunks.addMessage({
  //         recipientIds,
  //         body
  //       })) as unknown as string;
  //     } catch (err) {
  //       console.error(err);
  //       return;
  //     }
  //
  //     router.push(paths.conversations + `?threadKey=${threadId}`);
  //   },
  //   [dispatch, router, recipients]
  // );

  const canAddMessage = recipients.length > 0;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      }}
      {...props}
    >
      <ConversationComposerRecipients
        onRecipientAdd={handleRecipientAdd}
        onRecipientRemove={handleRecipientRemove}
        recipients={recipients}
      />
      <Divider />
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <ConversationMessageAdd
        disabled={!canAddMessage}
        // onSend={handleSend}
      />
    </Box>
  );
};
