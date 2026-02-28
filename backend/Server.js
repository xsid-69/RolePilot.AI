import "dotenv/config";
import app from "./src/app.js"
import connectDB from "./src/db/db.js";
import initSocketServer from "./src/sockets/socket.server.js";
import http from "http";

const PORT = process.env.PORT || 3000;

await connectDB();

const server = http.createServer(app);

initSocketServer(server);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
