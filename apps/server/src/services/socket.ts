import { Server } from "socket.io";
import Redis from "ioredis";
require("dotenv").config();

// TWO CONNECTIONS : PUBSUB model.
// 1) To publish the message.
// 2) To subscrbe the message.

const pub = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT),
  username: process.env.RESIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

const sub = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT),
  username: process.env.RESIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

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

    // SUBSCRIBING THE MESSAGES -
    sub.subscribe("MESSAGES");
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
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    sub.on("message", (channel, message) => {
      if (channel === "MESSAGES") {
        io.emit("message", message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
