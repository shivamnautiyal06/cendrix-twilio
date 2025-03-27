import TwilioClient from "./twilio-client.ts";

export class PhoneNumbersService {
    private client: TwilioClient;

    constructor(client: TwilioClient) {
        this.client = client;
    }

    async getPhoneNumbers(): Promise<string[]> {
        return this.client.getPhoneNumbers();
    }
}
