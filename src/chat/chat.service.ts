import { Injectable } from '@nestjs/common';
import { Message } from './models/message.model';

@Injectable()
export class ChatService {
  private messages: any[] = [];
  private activeUsers = new Map<string, string>();

  saveMessage(message: Message) {
    // Asegurarse de que el mensaje tenga un ID y timestamp
    const newMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    this.messages.push(newMessage);
    return newMessage;
  }

  setUserName(userId: string, userName: string) {
    this.activeUsers.set(userId, userName);
  }

  getUserName(userId: string): string {
    return this.activeUsers.get(userId) || `Usuario ${userId}`;
  }

  getMessageHistory(userId: string) {
    return this.messages.filter(
      msg => 
        (msg.from === userId && msg.to === 'admin') ||
        (msg.from === 'admin' && msg.to === userId)
    );
  }

  getUserChats(adminId: string) {
    const uniqueUsers = new Set(
      this.messages
        .filter(msg => msg.to === adminId || msg.from === adminId)
        .map(msg => msg.from === adminId ? msg.to : msg.from)
    );

    return Array.from(uniqueUsers)
      .filter(userId => userId !== 'admin')
      .map(userId => ({
        userId,
        userName: this.activeUsers.get(userId) || `Usuario ${userId}`,
        lastMessage: this.messages
          .filter(msg => 
            (msg.from === userId && msg.to === adminId) ||
            (msg.from === adminId && msg.to === userId)
          )
          .pop()
      }));
  }

  updateChats(message: any) {
    this.messages.push(message);
    
    if (message.from !== 'admin') {
      this.activeUsers.set(message.from, message.userName);
    }

    return this.getUserChats('admin');
  }
}
