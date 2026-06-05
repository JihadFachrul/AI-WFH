import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
import { RealtimeService, userRoom } from './realtime.service';

/** User minimal yang ditempelkan ke socket setelah token tervalidasi. */
interface SocketUser {
  id: string;
  email: string;
}

/**
 * RealtimeGateway HANYA mengurus lifecycle socket:
 * koneksi, autentikasi JWT, join room, tracking online, dan disconnect.
 * Semua logika emit/online ada di RealtimeService (tidak ada duplikasi).
 */
@WebSocketGateway({ cors: { origin: '*' } })
export class RealtimeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(RealtimeGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly realtime: RealtimeService,
  ) {}

  afterInit(server: Server): void {
    this.realtime.bindServer(server);
    this.logger.log('Realtime gateway siap');
  }

  /**
   * Validasi JWT saat koneksi. Socket tanpa token / token invalid ditolak
   * dan langsung di-disconnect (tidak ada anonymous socket).
   */
  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = this.extractToken(client);
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.config.get<string>('JWT_SECRET'),
      });

      const user: SocketUser = { id: payload.sub, email: payload.email };
      client.data.user = user;

      await client.join(userRoom(user.id));
      this.realtime.addOnline(user.id, client.id);

      this.logger.log(
        `Socket connect: ${client.id} (user ${user.id}) | online users: ${this.realtime.getOnlineCount()}`,
      );
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'unknown error';
      this.logger.warn(`Socket ditolak: ${client.id} | alasan: ${reason}`);
      // Beri tahu client lalu putuskan — tidak crash gateway.
      client.emit('auth:error', { message: 'Unauthorized' });
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket): void {
    const user = client.data?.user as SocketUser | undefined;
    if (user) {
      this.realtime.removeOnline(user.id, client.id);
    }
    this.logger.log(
      `Socket disconnect: ${client.id}${
        user ? ` (user ${user.id})` : ''
      } | online users: ${this.realtime.getOnlineCount()}`,
    );
  }

  /**
   * Ambil token dari (urut prioritas):
   * 1) handshake.auth.token  2) header Authorization  3) query ?token=
   */
  private extractToken(client: Socket): string | null {
    const fromAuth = client.handshake?.auth?.token as string | undefined;
    if (fromAuth) return this.stripBearer(fromAuth);

    const header = client.handshake?.headers?.authorization;
    if (typeof header === 'string') return this.stripBearer(header);

    const fromQuery = client.handshake?.query?.token;
    if (typeof fromQuery === 'string') return fromQuery;

    return null;
  }

  private stripBearer(value: string): string {
    return value.startsWith('Bearer ') ? value.slice(7) : value;
  }
}
