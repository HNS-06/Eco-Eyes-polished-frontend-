import { io } from "socket.io-client";

const SOCKET_URL = "https://echo-eyes-backend.onrender.com";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnection: true,         // auto reconnect on disconnect
  reconnectionAttempts: 5,    // retry up to 5 times
  reconnectionDelay: 2000     // wait 2s before retry
});

export default socket;
