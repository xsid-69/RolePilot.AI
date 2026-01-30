import app from "./src/app.js"
import { configDotenv } from "dotenv";
import connectDB from "./src/db/db.js";
import initSocketServer from "./src/sockets/socket.server.js";
import http from "http";

configDotenv();

connectDB();

const server = http.createServer(app);

initSocketServer(server);

server.listen(3000,()=>{
    console.log("Server is running on port 3000");
    
})

