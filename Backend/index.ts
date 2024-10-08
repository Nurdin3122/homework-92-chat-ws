import express, {Application} from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import config from './config';
import mongoose from 'mongoose';
import usersRouter from './routers/usersRouter';
import {incomingMessage} from "./types.Db";
import { WebSocket } from 'ws';
import User from "./models/Users";


const app: Application = express();
expressWs(app);

const port = 8000;

app.use(cors());
app.use(express.json());

const chatRouter = express.Router();
const connectedClients:{ ws: WebSocket, username: string }[]= [];
let userName = "Anonymous";

chatRouter.ws('/chat', (ws) => {

    console.log('client connected');

    ws.on("message",async (msg) => {
        try {
            const decodedMessage = JSON.parse(msg.toString()) as incomingMessage;

            if (decodedMessage.type === 'LOGIN') {
                if (decodedMessage.type !== "LOGIN") {
                    ws.send(JSON.stringify({type:"ERROR",payload:"Wrong token"}));
                    ws.close();
                    return;
                }
                const token = decodedMessage.payload;
                const user = await User.findOne({ token });

                if (user) {
                    userName = user.username;
                    connectedClients.push({ ws, username: userName });
                } else {
                    ws.send(JSON.stringify({ type: 'ERROR', payload: 'Invalid token' }));
                    ws.close();
                    return;
                }
            }

            if (decodedMessage.type === "SET_MESSAGE") {
                connectedClients.forEach(client => {
                    client.ws.send(JSON.stringify({
                        type:"NEW_MESSAGE",
                        payload: {
                            username: userName,
                            text:decodedMessage.payload
                        }
                    }));
                })
            }
        } catch (e) {
            ws.send(JSON.stringify({type:"ERROR",payload:"invalid message"}));
        }
    });

    ws.on('close', () => {
        console.log('client disconnected');
    });
});

app.use(chatRouter);
app.use('/users', usersRouter);

const run = async () => {
    await mongoose.connect(config.db);
    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });

    process.on('exit', () => {
        mongoose.disconnect();
    });
};

run().catch(console.error);