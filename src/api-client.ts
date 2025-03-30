import { MessagesService } from "./services/messages.service";
import { ContactsService } from "./services/contacts.service";
import { PhoneNumbersService } from "./services/phone-numbers.service";
import TwilioClient from "./services/twilio-client";

import type { ChatInfo, PlainMessage } from "./types";

class ApiClient {
    private axiosInstance: TwilioClient;
    private messagesService: MessagesService;
    private contactsService: ContactsService;
    private phoneNumbersService: PhoneNumbersService;

    constructor(sid: string, token: string) {
        this.axiosInstance = new TwilioClient(sid, token);

        this.messagesService = new MessagesService(this.axiosInstance);
        this.contactsService = new ContactsService(this.axiosInstance);
        this.phoneNumbersService = new PhoneNumbersService(this.axiosInstance);
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
