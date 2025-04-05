import { MessagesService } from "./services/messages.service";
import { ContactsService } from "./services/contacts.service";
import { PhoneNumbersService } from "./services/phone-numbers.service";
import TwilioClient from "./services/twilio-client";

import type { ChatInfo, PlainMessage } from "./types";

class ApiClient {
    axiosInstance: TwilioClient;
    sid: string;
    authToken: string;

    private static instance: ApiClient | undefined;
    private messagesService: MessagesService;
    private contactsService: ContactsService;
    private phoneNumbersService: PhoneNumbersService;

    private constructor(sid: string, token: string) {
        this.sid = sid;
        this.authToken = token;
        this.axiosInstance = new TwilioClient(sid, token);

        this.messagesService = new MessagesService(this.axiosInstance);
        this.contactsService = new ContactsService(this.axiosInstance);
        this.phoneNumbersService = new PhoneNumbersService(this.axiosInstance);
    }

    static async getInstance(sid: string, token: string) {
        if (
            !ApiClient.instance ||
            sid !== ApiClient.instance.sid ||
            token !== ApiClient.instance.authToken
        ) {
            const client = new ApiClient(sid, token);
            // Test connection
            await client.getPhoneNumbers();
            ApiClient.instance = client;
        }

        return ApiClient.instance;
    }

    async getPhoneNumbers() {
        return this.phoneNumbersService.getPhoneNumbers();
    }

    async getChats(activeNumber: string): Promise<ChatInfo[]> {
        return this.contactsService.getChats(activeNumber);
    }

    async getMessages(
        activeNumber: string,
        contactNumber: string,
    ): Promise<PlainMessage[]> {
        return this.messagesService.getMessages(activeNumber, contactNumber);
    }

    async sendMessage(activeNumber: string, to: string, body: string) {
        return this.messagesService.sendMessage(activeNumber, to, body);
    }

    updateMostRecentlySeenMessage(chatId: string, messageId: string) {
        return this.contactsService.updateMostRecentlySeenMessageId(
            chatId,
            messageId,
        );
    }
}

export default ApiClient;
