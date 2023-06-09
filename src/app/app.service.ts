import { Injectable } from '@nestjs/common';
import { ICallback, IMessage, STATUS } from '../types/types';
import { HttpService } from '@nestjs/axios';
import { SlackClient } from '../clients/slack.client';
import { generateResponse } from '../utils/utils';

@Injectable()
export class AppService {
    constructor(
        private readonly httpService: HttpService,
        private readonly slackClient: SlackClient,
    ) { }
    getHello(): string {
        return `Hello World!`;
    }

    async transformMessage(messages: IMessage[]) {
        return messages[messages.length - 1].content
    }

    async getSlackChatCompletionStream(message: string, callback: ICallback) {
        await this.slackClient.openChannel();
        await this.slackClient.chat(message);
        const timestamp = Math.floor(Date.now() / 1000);
        await this.slackClient.getReply(null, (message, status) => {
            if (status === STATUS.CONTINUE && message === '') return;
            const completion = this.generateStreamResponse(
                timestamp,
                message,
                status,
            );
            callback(JSON.stringify(completion), status);
        });
    }

    async getSlackChatCompletion(message: string, mockStream = false) {
        await this.slackClient.openChannel();
        await this.slackClient.chat(message);
        const timestamp = Math.floor(Date.now() / 1000);
        const completion = await this.slackClient.getReply();
        if (mockStream) {
            return this.generateStreamResponse(timestamp, completion, STATUS.STOP);
        }
        return generateResponse({
            timestamp,
            stream: false,
            completion,
        });
    }

    private generateStreamResponse(
        timestamp: number,
        completion: string,
        status: STATUS,
    ) {
        return generateResponse(
            {
                timestamp,
                stream: true,
                completion,
            },
            status,
        );
    }
}
