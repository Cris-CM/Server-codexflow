import { Injectable } from '@nestjs/common';
import { Message } from './models/message.model';

@Injectable()
export class ChatService {
  private messages: Message[] = [];
  private activeUsers: Map<string, string> = new Map();

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

  getMessageHistory(userId: string): Message[] {
    return this.messages.filter(
      msg => (msg.from === userId && msg.to === 'admin') || 
             (msg.from === 'admin' && msg.to === userId)
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  getUserChats(adminId: string) {
    const uniqueUsers = new Set(
      this.messages
        .filter(msg => msg.to === adminId || msg.from === adminId)
        .map(msg => msg.from === adminId ? msg.to : msg.from)
    );

    return Array.from(uniqueUsers)
      .filter(userId => userId !== 'admin')
      .map(userId => {
        const userMessages = this.messages.filter(
          msg => (msg.from === userId && msg.to === adminId) || 
                 (msg.from === adminId && msg.to === userId)
        );
        const lastMessage = userMessages[userMessages.length - 1];
        
        // Obtener el nombre real del usuario desde el último mensaje
        const userName = lastMessage?.userName || 
                        this.activeUsers.get(userId) || 
                        `Usuario ${userId}`;
        
        return {
          userId,
          userName,
          lastMessage
        };
      });
  }
}
