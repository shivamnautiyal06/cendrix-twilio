import { useState } from "react";
import type { ChatInfo } from "../types";

function shallowEqualChats(a: ChatInfo[], b: ChatInfo[]) {
    return (
        a.length === b.length &&
        a.every((c, i) => c.chatId === b[i].chatId) &&
        a.every((c, i) => c.isFlagged === b[i].isFlagged)
    );
}

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
            const sorted = sortChats(updated);
            return shallowEqualChats(prev, sorted) ? prev : sorted;
        });
    };

    return [chats, setSortedChats] as const;
}
