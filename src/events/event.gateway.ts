// src/events/events.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
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

  @SubscribeMessage('jobStatusUpdate')
  handleJobStatusUpdate(client: any, job: any): void {
    console.log('Emitting jobStatusUpdate', job);
    this.server.emit('jobStatusUpdate', job);
  }
}
