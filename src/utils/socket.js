import { io } from "socket.io-client";
const SOCKET_URL = "https://echo-eyes-backend.onrender.com";
const socket = io(SOCKET_URL, { transports: ["websocket"] });
export default socket;
