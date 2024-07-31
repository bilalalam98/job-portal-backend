// src/events/events.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  //   SubscribeMessage,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: '/jobs', cors: { origin: '*' } })
export class EventsGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    server;
    console.log('WebSocket server initialized');
  }

  //   @SubscribeMessage('jobStatusUpdate')
  handleJobStatusUpdate(clientId: string, status: string, data: any): void {
    console.log('Emitting jobStatusUpdate', data);
    this.server.to(clientId).emit('jobStatusUpdate', { status, data });
  }
}
