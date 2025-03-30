import React from "react";
import type { ChatInfo } from "../types";
import { useCredentials } from "../context/CredentialsContext";
import { POLL_INTERVAL } from "../utils";

export function usePollingChats(pollInterval = POLL_INTERVAL) {
    const [chats, setChats] = React.useState<ChatInfo[]>([]);
    const [selectedChat, setSelectedChat] = React.useState<ChatInfo | null>(
        null,
    );
    const { isAuthenticated, apiClient, activePhoneNumber } = useCredentials();

    React.useEffect(() => {
        if (!isAuthenticated || !apiClient) return;

        const fetchChats = async () => {
            try {
                const chatsData = await apiClient.getChats(activePhoneNumber);

                setChats((prevChats) => {
                    const currentChatsMap = new Map(
                        prevChats.map((chat) => [chat.chatId, chat]),
                    );

                    const hasChanges = chatsData.some((newChat) => {
                        const existingChat = currentChatsMap.get(
                            newChat.chatId,
                        );
                        return (
                            !existingChat ||
                            newChat.recentMsgId !== existingChat.recentMsgId
                        );
                    });

                    if (hasChanges) {
                        console.log("Updating chats:", chatsData);
                        return chatsData;
                    }

                    return prevChats;
                });
            } catch (error) {
                console.error("Failed to fetch chats:", error);
            }
        };

        fetchChats(); // Initial fetch

        const intervalId = setInterval(fetchChats, pollInterval);
        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [isAuthenticated, apiClient, activePhoneNumber, pollInterval]);

    return { chats, setChats, selectedChat, setSelectedChat };
}
