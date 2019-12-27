import Express from 'express';
import * as authController from '../controller/auth';

const Router = Express.Router();

Router.post('/register', authController.registerUser);

Router.post('/login', authController.loginUser);

Router.get('/logout', authController.logout);

export default Router;
