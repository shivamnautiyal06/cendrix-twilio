import React from 'react';
import { useCredentials } from "../context/CredentialsContext";
import type { ChatInfo, PlainMessage } from '../types';
import { POLL_INTERVAL } from '../utils';

export function usePollingMessages(chat: ChatInfo, pollInterval = POLL_INTERVAL) {
  const [chatMessages, setChatMessages] = React.useState<PlainMessage[]>([]);
  const lastMessageIdRef = React.useRef<string | null>(null);
  const { apiClient, activePhoneNumber } = useCredentials();

  React.useEffect(() => {
    if (!apiClient || !chat) {
        return;
    }

    const fetchChatMessages = async () => {
      try {
        const chatMessagesData = await apiClient.getMessages(
          activePhoneNumber,
          chat.contactNumber
        );

        const mostRecentMessageId = chatMessagesData.at(-1)?.id;

        if (mostRecentMessageId && mostRecentMessageId !== lastMessageIdRef.current) {
          setChatMessages(chatMessagesData);
          lastMessageIdRef.current = mostRecentMessageId;
        }

        if (mostRecentMessageId) {
          apiClient.updateMostRecentlySeenMessage(chat.chatId, mostRecentMessageId);
        }
      } catch (error) {
        console.error('Failed to fetch chat messages:', error);
      }
    };

    fetchChatMessages();
    const intervalId = setInterval(fetchChatMessages, pollInterval);
    return () => clearInterval(intervalId);
}, [chat.chatId]);
//   }, [apiClient, chat?.chatId, chat?.contactNumber, activePhoneNumber, pollInterval]);

  return { chatMessages, setChatMessages };
}