import express from 'express';
import authRouter from './auth';

const Router = express.Router();

Router.use('/auth', authRouter);

export default Router;
