import express, {Application} from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import config from './config';
import mongoose from 'mongoose';
import usersRouter from './routers/usersRouter';
import {incomingMessage} from "./types.Db";
import { WebSocket } from 'ws';
import User from "./models/Users";
import Messages from "./models/Messages";
import dayjs from 'dayjs';


const app: Application = express();
expressWs(app);

const port = 8000;

app.use(cors());
app.use(express.json());

const chatRouter = express.Router();
const connectedClients:{ ws: WebSocket, username: string }[]= [];
let userName = "Anonymous";

chatRouter.ws('/chat', async (ws) => {
    console.log('client connected');
    connectedClients.push({ ws, username: '' });
    const lastMessages = await Messages.find().sort({ createdAt: -1 }).limit(30).exec();

    const formattedMessages = lastMessages.map(message => ({
        username: message.username,
        text: message.text,
        createdAt: dayjs(message.createdAt).format('HH:mm')
    }));

    ws.send(JSON.stringify({
        type: 'LAST_MESSAGES',
        payload: formattedMessages,
    }));


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
                    const clientIndex = connectedClients.findIndex(client => client.ws === ws);
                    if (clientIndex !== -1) {
                        connectedClients[clientIndex].username = userName;
                    }
                } else {
                    ws.send(JSON.stringify({ type: 'ERROR', payload: 'Invalid token' }));
                    ws.close();
                    return;
                }
            }

            if (decodedMessage.type === "SET_MESSAGE") {
                const newMessage = new Messages({
                    username: userName,
                    text: decodedMessage.payload,
                    createdAt: new Date(),
                });
                await newMessage.save();
                const formattedTime = dayjs(newMessage.createdAt).format('HH:mm');

                connectedClients.forEach(client => {
                    client.ws.send(JSON.stringify({
                        type:"NEW_MESSAGE",
                        payload: {
                            username: userName,
                            text:decodedMessage.payload,
                            createdAt:formattedTime,
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
        const index = connectedClients.findIndex(client => client.ws === ws);

        if (index !== -1) {
            connectedClients.splice(index, 1);
        }
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