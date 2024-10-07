import express, { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import User from "../models/Users";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const usersRouter = express.Router();

usersRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password,
            token: randomUUID(),
        });

        await user.save();
        return res.send(user);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).send(error);
        }
        return next(error);
    }
});

usersRouter.post('/sessions', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).send({ error: 'Username not found' });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).send({ error: 'Password is wrong' });
        }

        user.token = randomUUID();
        await user.save({ validateModifiedOnly: true });
        return res.send(user);
    } catch (error) {
        return next(error);
    }
});

usersRouter.delete('/sessions', async (req, res, next) => {
    try {
        const header = req.get('Authorization');
        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).send({error: 'Token not provided!'});
        }
        const token = header.split(' ')[1];
        const success = {message: 'Success'};
        if (!token) return res.send(success);
        const user = await User.findOne({token});
        if (!user) return res.send(success);

        user.token = "";
        user.save();

        return res.send(success);
    } catch (e) {
        return next(e);
    }
});

export default usersRouter;
