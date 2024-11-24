import {
 WebSocketGateway, WebSocketServer, SubscribeMessage,OnGatewayConnection,OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: { origin: '*',
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
  handleMessage(
    client: Socket,
    payload: {from: string;to: string;content: string;userName: string;
    },
  ): void {
    const message = {
      ...payload,
      timestamp: new Date(),
    };

    // Emitir al destinatario
    this.server.emit(`message:${payload.to}`, message);

    // Actualizar lista de chats del admin
    const chats = this.chatService.updateChats(message);
    this.server.emit('updateAdminChats', chats);
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
