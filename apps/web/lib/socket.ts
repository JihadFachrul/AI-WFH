import { io, type Socket } from "socket.io-client";

/**
 * Socket.IO client foundation — reusable singleton.
 * Auth via JWT pada handshake (auth.token), sesuai RealtimeGateway backend.
 * Hanya foundation: connect / getSocket / disconnect (tanpa event handler kompleks).
 */
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";

let socket: Socket | null = null;

export function connectSocket(token: string): Socket {
  if (socket?.connected) {
    return socket;
  }
  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    auth: { token },
    autoConnect: true,
    reconnection: true,
  });
  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}
