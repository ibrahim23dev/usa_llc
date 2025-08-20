// import { SocketIOServer } from 'socket.io';
/* eslint-disable @typescript-eslint/consistent-type-definitions */
declare global {
  namespace NodeJS {
    interface Global {
      io: any; // Assuming SocketIOServer is the correct type
    }
  }
}
