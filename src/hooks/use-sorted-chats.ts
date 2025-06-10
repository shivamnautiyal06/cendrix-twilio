import { useState } from "react";
import type { ChatInfo } from "../types";

function sortChats(chats: ChatInfo[]) {
    return chats.sort((a, b) => {
        // Primary sort: isFlagged
        if (a.isFlagged && !b.isFlagged) {
            return -1;
        } else if (!a.isFlagged && b.isFlagged) {
            return 1;
        }

        // Secondary sort: recentMsgDate (descending)
        return b.recentMsgDate.getTime() - a.recentMsgDate.getTime();
    });
}

export function useSortedChats(initialChats: ChatInfo[]) {
    const [chats, setChats] = useState(() => sortChats(initialChats));

    const setSortedChats = (
        updater: ((prevChats: ChatInfo[]) => ChatInfo[]) | ChatInfo[],
    ) => {
        setChats((prev) => {
            const updated =
                typeof updater === "function" ? updater(prev) : updater;
            return sortChats(updated);
        });
    };

    return [chats, setSortedChats] as const;
}
