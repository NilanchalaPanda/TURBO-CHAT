import http from "http";
import SocketService from "./services/socket";

async function init() {
  const socketService = new SocketService();

  // SERVER CODE -
  const httpServer = http.createServer();
  const PORT = process.env.PORT || 8000;

  socketService.io.attach(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`HTTP Server started at ${PORT}`);
  });

  // New Listeners added -
  socketService.initListerners();
}

init();
