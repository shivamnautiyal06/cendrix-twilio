import axios, { AxiosInstance } from "axios";

import type { RawMsg, RawNumber, TwilioMsg } from "../types";

function transform(rawMsg: RawMsg): TwilioMsg {
    return {
        accountSid: rawMsg.account_sid,
        apiVersion: rawMsg.api_version,
        body: rawMsg.body,
        dateCreated: new Date(rawMsg.date_created),
        dateSent: new Date(rawMsg.date_sent),
        dateUpdated: new Date(rawMsg.date_updated),
        direction: rawMsg.direction as any,
        errorCode: parseInt(rawMsg.error_code ?? "0"),
        errorMessage: rawMsg.error_message ?? "",
        from: rawMsg.from,
        messagingServiceSid: rawMsg.messaging_service_sid ?? "",
        numMedia: rawMsg.num_media,
        numSegments: rawMsg.num_segments,
        price: rawMsg.price,
        priceUnit: rawMsg.price_unit,
        sid: rawMsg.sid,
        status: rawMsg.status as any,
        to: rawMsg.to,
        uri: rawMsg.uri,
    };
}

class TwilioClient {
    private axiosInstance: AxiosInstance;

    constructor(sid: string, token: string) {
        this.axiosInstance = axios.create({
            baseURL: `https://api.twilio.com/2010-04-01/Accounts/${sid}`,
            auth: {
                username: sid,
                password: token,
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
    }

    async getPhoneNumbers() {
        const res = await this.axiosInstance.get<RawNumber>(
            "/IncomingPhoneNumbers.json",
        );
        return res.data.incoming_phone_numbers.map((e) => e.phone_number);
    }

    async getMessages(
        props: { from?: string; to?: string } = {},
    ): Promise<TwilioMsg[]> {
        const res = await this.axiosInstance.get("/Messages.json", {
            params: {
                From: props.from,
                To: props.to,
                PageSize: 1000,
            },
        });
        return res.data.messages.map(transform);
    }

    async sendMessage(
        activeNumber: string,
        to: string,
        body: string,
    ): Promise<void> {
        const params = new URLSearchParams();
        params.append("From", activeNumber);
        params.append("Body", body);
        params.append("To", to);
        const res = await this.axiosInstance.post("/Messages.json", params);
        return res.data;
    }
}

export default TwilioClient;
