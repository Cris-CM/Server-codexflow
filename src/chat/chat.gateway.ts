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
  handleMessage(client: Socket, payload: { 
    from: string; 
    to: string; 
    content: string; 
    userName: string; 
  }) {
    // Guardar el nombre del usuario cuando envía un mensaje
    if (payload.from !== 'admin') {
      this.chatService.setUserName(payload.from, payload.userName);
    }

    const message = this.chatService.saveMessage({
      ...payload,
      id: Date.now().toString(),
      timestamp: new Date(),
    });

    this.server.emit(`message:${payload.to}`, message);
    
    if (payload.to === 'admin' || payload.from === 'admin') {
      this.server.emit('updateAdminChats', this.chatService.getUserChats('admin'));
    }
  }

  @SubscribeMessage('getMessageHistory')
  handleGetHistory(client: Socket, userId: string) {
    const history = this.chatService.getMessageHistory(userId);
    client.emit('messageHistory', history);
  }

  @SubscribeMessage('getAdminChats')
  handleGetAdminChats() {
    return this.chatService.getUserChats('admin');
  }
}
