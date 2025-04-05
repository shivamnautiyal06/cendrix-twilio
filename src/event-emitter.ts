import { POLL_INTERVAL } from "./utils";
import TwilioClient from "./services/twilio-client";

import type { PlainMessage, TwilioMsg } from "./types";

type Event = "new-message";
type CB = (msg: PlainMessage) => void;

export class EventEmitter {
    private static instance: EventEmitter | undefined;
    private twilioClient: TwilioClient;
    private callbacks: Record<Event, CB[]> = {
        "new-message": [],
    };
    private lastKnownMsgId = "";

    private constructor(twilioClient: TwilioClient) {
        this.twilioClient = twilioClient;
    }

    async init() {
        const msgs = await this.twilioClient.getMessages({ limit: 1 });
        this.lastKnownMsgId = msgs.items[0].sid;
        this.listenForNewMessage();
    }

    static async getInstance(twilioClient: TwilioClient) {
        if (
            !EventEmitter.instance ||
            twilioClient.sid !== EventEmitter.instance.twilioClient.sid ||
            twilioClient.authToken !==
                EventEmitter.instance.twilioClient.authToken
        ) {
            const ee = new EventEmitter(twilioClient);
            // Init and test connection
            await ee.init();
            EventEmitter.instance = ee;
        }

        return EventEmitter.instance;
    }

    on(event: Event, cb: CB) {
        this.callbacks[event].push(cb);
        return this.createId(event, this.callbacks[event].length - 1);
    }

    off(id: string) {
        const { event, index } = this.parseId(id);
        this.callbacks[event].splice(index, 1);
    }

    private createId(event: Event, index: number) {
        return `${event}:${index}`;
    }

    private parseId(id: string) {
        const [event, index] = id.split(":");
        return { event: event as Event, index: +index };
    }

    private listenForNewMessage() {
        setInterval(async () => {
            try {
                if (!this.twilioClient) return;
                const msgs = await this.twilioClient.getMessages({ limit: 1 });
                if (msgs.items[0].sid !== this.lastKnownMsgId) {
                    const interveningMsgs = await this.fetchInterveningMsgs();
                    this.emitNewMsgs(interveningMsgs);
                    this.lastKnownMsgId = msgs.items[0].sid;
                }
            } catch (err) {
                console.error("Failed to fetch chats:", err);
            }
        }, POLL_INTERVAL);
    }

    private async fetchInterveningMsgs() {
        const interveningMsgs: TwilioMsg[] = [];
        let found = false;

        let msgs: Awaited<ReturnType<typeof this.twilioClient.getMessages>>;
        do {
            msgs = await this.twilioClient.getMessages();
            const foundIndex = msgs.items.findIndex(
                (m) => m.sid === this.lastKnownMsgId,
            );
            if (foundIndex !== -1) {
                const newMsgs = msgs.items.slice(0, foundIndex);
                interveningMsgs.push(...newMsgs);
                found = true;
            } else {
                interveningMsgs.push(...msgs.items);
            }
        } while (!found || msgs.hasNextPage());

        return interveningMsgs;
    }

    private emitNewMsgs(msgs: TwilioMsg[]) {
        for (const cb of this.callbacks["new-message"]) {
            for (const msg of msgs) {
                cb({
                    content: msg.body,
                    timestamp: msg.dateSent.getTime(),
                    direction:
                        msg.direction === "inbound"
                            ? ("received" as "received")
                            : ("sent" as "sent"), // Explicitly type the direction
                    from: msg.from,
                    to: msg.to,
                    id: msg.sid,
                    status: msg.status,
                });
            }
        }
    }
}
