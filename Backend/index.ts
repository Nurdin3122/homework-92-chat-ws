import express, {Application} from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import config from './config';
import mongoose from 'mongoose';
import usersRouter from './routers/usersRouter';
import {incomingMessage} from "./types.Db";
import { WebSocket } from 'ws';


const app: Application = express();
expressWs(app);

const port = 8000;

app.use(cors());
app.use(express.json());

const chatRouter = express.Router();
const connectedClient:WebSocket[] = []
let username = "Anonymous";
chatRouter.ws('/chat', (ws) => {
    console.log('client connected');
    connectedClient.push(ws);

    ws.on("message",(msg) => {
        const decodedMessage = JSON.parse(msg.toString()) as incomingMessage;
        if (decodedMessage.type === "SET_MESSAGE") {
            connectedClient.forEach(client => {
                client.send(JSON.stringify({
                    type:"NEW_MESSAGE",
                    payload: {
                        username,
                        text:decodedMessage.payload
                    }
                }));
            })
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