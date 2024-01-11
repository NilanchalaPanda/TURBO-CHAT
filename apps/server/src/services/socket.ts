import { Server } from "socket.io";
import Redis from 'ioredis'

// TWO CONNECTIONS FOR 

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Init Socket Service...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
  }

  //
  public initListerners() {
    const io = this.io;
    console.log("Init Socket Listeners...");

    io.on("connect", (socket) => {
      console.log("New Socket Connected", socket.id);

      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New message recieved..", message);

        // Publish this message to REDIS : lib : ioredis
      });
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
