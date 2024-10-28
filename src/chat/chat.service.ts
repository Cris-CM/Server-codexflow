import { Injectable } from '@nestjs/common';
import { Message } from './models/message.model';

@Injectable()
export class ChatService {
  private messages: Message[] = [];
  private activeUsers: Map<string, string> = new Map();

  saveMessage(message: Message) {
    this.messages.push(message);
    return message;
  }

  getMessageHistory(userId: string): Message[] {
    return this.messages.filter(
      msg => msg.from === userId || msg.to === userId
    );
  }

  getUserChats(adminId: string): { userId: string, lastMessage: Message }[] {
    const uniqueUsers = new Set(
      this.messages
        .filter(msg => msg.to === adminId || msg.from === adminId)
        .map(msg => msg.from === adminId ? msg.to : msg.from)
    );

    return Array.from(uniqueUsers).map(userId => {
      const userMessages = this.messages.filter(
        msg => (msg.from === userId && msg.to === adminId) || 
               (msg.from === adminId && msg.to === userId)
      );
      return {
        userId,
        lastMessage: userMessages[userMessages.length - 1]
      };
    });
  }
}
