import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, payload: { from: string; to: string; content: string }) {
    const message = {
      id: Date.now().toString(),
      ...payload,
      timestamp: new Date(),
    };

    this.chatService.saveMessage(message);
    
    this.server.emit(`message:${payload.to}`, message);
    this.server.emit(`message:${payload.from}`, message);
    
    if (payload.to === 'admin') {
      this.server.emit('updateAdminChats', this.chatService.getUserChats('admin'));
    }
  }

  @SubscribeMessage('getMessageHistory')
  handleGetHistory(client: Socket, userId: string) {
    return this.chatService.getMessageHistory(userId);
  }

  @SubscribeMessage('getAdminChats')
  handleGetAdminChats() {
    return this.chatService.getUserChats('admin');
  }
}
