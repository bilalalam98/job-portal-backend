import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/jobs', cors: { origin: '*' } })
export class EventsGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    server;
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }
  handleJobStatusUpdate(clientId: string, status: string, data: any): void {
    console.log('Emitting jobStatusUpdate', data);
    this.server.to(clientId).emit('jobStatusUpdate', { status, data });
  }
}
