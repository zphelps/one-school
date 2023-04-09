
interface Attachment {
  id: string;
  url: string;
}

export interface Message {
  id: string;
  attachments: Attachment[];
  body: string;
  contentType: string;
  createdAt: number;
  authorId: string;
  sent: boolean;
}

export interface Participant {
  id: string;
  avatar: string | null;
  lastActivity?: number;
  firstName: string;
  lastName: string;
}

export interface Thread {
  id?: string;
  messages: Message[];
  participantIds: string[];
  participants?: Participant[];
  type: 'ONE_TO_ONE' | 'GROUP';
  unreadCount?: number;
}
