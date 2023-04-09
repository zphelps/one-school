import type {FC} from 'react';
import {useCallback, useState} from 'react';
import {Box, Divider} from '@mui/material';
import {User} from "../../types/user";
import {paths} from "../../paths";
import {ConversationComposerRecipients} from "./conversation-composer-recipients";
import {ConversationMessageAdd} from "./conversation-message-add";
import {useDispatch} from "react-redux";
import {useRouter} from "../../hooks/use-router";
import {v4 as uuidv4} from "uuid";
import {addMessage} from "../../slices/conversations/conversations";
import {httpsCallable} from "firebase/functions";
import {functions} from "../../config";
import {useAuth} from "../../hooks/use-auth";

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

interface ConversationComposerProps {
}

export const ConversationComposer: FC<ConversationComposerProps> = (props) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const {handleRecipientAdd, handleRecipientRemove, recipients} = useRecipients();
    const auth = useAuth();

    const handleSend = useCallback(
        async (body: string, recipients: User[]): Promise<void> => {
            let participants = recipients.map((recipient) => {
                return {
                    id: recipient.id,
                    firstName: recipient.firstName,
                    lastName: recipient.lastName,
                    avatar: recipient.imageURL,
                    lastActivity: new Date().getTime(),
                }
            })

            participants.push({
                id: auth.user!.id,
                firstName: auth.user!.firstName,
                lastName: auth.user!.lastName,
                avatar: auth.user!.imageURL,
                lastActivity: new Date().getTime(),
            });

            const thread = {
                id: uuidv4(),
                participants: participants,
                participantIds: participants.map((recipient) => recipient.id),
                messages: [],
                type: recipients.length > 2 ? 'GROUP' : 'ONE_TO_ONE',
                unreadCount: 0,
            }

            try {
                const message = {
                    id: uuidv4(),
                    attachments: [],
                    body,
                    createdAt: new Date().getTime(),
                    contentType: 'text',
                    authorId: auth.user!.id,
                    sent: false,
                }
                await dispatch(addMessage({
                    threadId: thread.id,
                    message
                }));
                console.log(thread)
                const sendMessage = httpsCallable(functions, "sendMessage");
                await sendMessage({message: message, thread: thread, tenantID: auth.user?.tenantID});
                router.push(paths.conversations + `?threadKey=${thread.id}`);
            } catch (err) {
                console.error(err);
            }
        },
        [dispatch, auth]
    );

    // const handleSend = useCallback(
    //   async (body: string): Promise<void> => {
    //     const recipientIds = recipients.map((recipient) => recipient.id);
    //
    //     let threadId: string;
    //
    //     try {
    //       // Handle send message and redirect to the new thread
    //       threadId = await dispatch(addMessage({
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

    console.log(recipients)

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
            <Divider/>
            <Box sx={{flexGrow: 1}}/>
            <Divider/>
            <ConversationMessageAdd
                disabled={!canAddMessage}
                onSend={(body) => handleSend(body, recipients)}
            />
        </Box>
    );
};
