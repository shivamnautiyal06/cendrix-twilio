// useWebSocketEvents.ts
import { useEffect } from "react";
import { useWebsocketContext } from "../context/WebsocketProvider";

export function useWebsocketEvents(
    eventName: string,
    onUpdate: (payload: any) => void,
) {
    const { lastJsonMessage } = useWebsocketContext();

    useEffect(() => {
        if (lastJsonMessage?.type === eventName) {
            onUpdate(lastJsonMessage.payload);
        }
    }, [lastJsonMessage]);
}
