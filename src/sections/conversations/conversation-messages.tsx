import type { FC } from 'react';
import PropTypes from 'prop-types';
import { Stack } from '@mui/material';
import {Message, Participant} from "../../types/conversation";
import {User} from "../../types/user";
import {useAuth} from "../../hooks/use-auth";
import {ConversationMessage} from "./conversation-message";

const getAuthor = (message: Message, participants: Participant[], user: User) => {
  const participant = participants.find((participant) => participant.id === message.authorId);

  // This should never happen
  if (!participant) {
    return {
      name: 'Unknown',
      avatar: '',
      isUser: false
    };
  }

  // Since chat mock db is not synced with external auth providers
  // we set the user details from user auth state instead of thread participants
  if (message.authorId === user.id) {
    return {
      name: 'Me',
      avatar: user.imageURL,
      isUser: true
    };
  }

  return {
    avatar: participant!.avatar,
    name: `${participant!.firstName} ${participant!.lastName}`,
    isUser: false
  };
};

interface ConversationMessagesProps {
  messages: Message[];
  participants: Participant[];
}

export const ConversationMessages: FC<ConversationMessagesProps> = (props) => {
  const { messages, participants, ...other } = props;
  const user = useAuth().user;

  return (
    <Stack
      spacing={2}
      sx={{ p: 3 }}
      {...other}
    >
      {messages.map((message) => {
        const author = getAuthor(message, participants, user!);

        return (
          <ConversationMessage
            authorAvatar={author.avatar}
            authorName={author.name}
            sent={message.sent}
            body={message.body}
            contentType={message.contentType}
            createdAt={message.createdAt}
            key={message.id}
            position={author.isUser ? 'right' : 'left'}
          />
        );
      })}
    </Stack>
  );
};

ConversationMessages.propTypes = {
  // @ts-ignore
  messages: PropTypes.array,
  // @ts-ignore
  participants: PropTypes.array
};
