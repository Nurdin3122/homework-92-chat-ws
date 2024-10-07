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

export default usersRouter;
