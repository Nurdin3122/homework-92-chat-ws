import express, {Application} from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import config from './config';
import mongoose from 'mongoose';
import usersRouter from './routers/usersRouter';

const app: Application = express() as any;
expressWs(app);

const port = 8000;

app.use(cors());
app.use(express.json());

const chatRouter = express.Router();
chatRouter.ws('/chat', (ws, req) => {
    console.log('client connected');
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