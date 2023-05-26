import { STATUS } from './types';

interface IData {
  timestamp: number;
  stream: boolean;
  completion: any;
}

export function generateResponse(data: IData, status: STATUS = STATUS.STOP) {
  const { stream, completion, timestamp } = data;
  const completionTokens = completion.split(' ').length;
  const object = stream ? 'chat.completion.chunk' : 'chat.completion';
  const finish_reason = status === STATUS.CONTINUE ? null : 'stop';
  const message = {
    role: 'assistant',
    content: completion,
  };

  const choice = stream
    ? {
        delta: message,
      }
    : {
        message,
      };

  return {
    id: `chatcmpl-${timestamp}`,
    object,
    created: timestamp,
    model: 'gpt-3.5-turbo',
    usage: {
      prompt_tokens: 0,
      completion_tokens: completionTokens,
      total_tokens: completionTokens,
    },
    choices: [
      {
        ...choice,
        finish_reason,
        index: 0,
      },
    ],
  };
}
