import express from 'express';
import authRouter from './auth';
import restroomRouter from './restroom';

const Router = express.Router();

Router.use('/auth', authRouter);
Router.use('/restrooms', restroomRouter);

export default Router;
