import express from 'express';
import authRouter from './auth';
import restroomRouter from './restroom';
import userRouter from './user';
import helpRouter from './help';

const Router = express.Router();

Router.use('/auth', authRouter);
Router.use('/restrooms', restroomRouter);
Router.use('/users', userRouter);
Router.use('/help', helpRouter);

export default Router;
