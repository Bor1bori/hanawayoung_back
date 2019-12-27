import Express from 'express';
import * as authController from '../controller/auth';
import * as authMiddleware from '../middleware/auth';

const Router = Express.Router();

Router.post('/register', authController.registerUser);

Router.post('/login', authController.loginUser);

Router.get('/logout', authController.logout);

Router.get('/is-login', authMiddleware.verifyLogin, (req, res) => {
  res.status(200).json({logined: true, user: req.user});
});

export default Router;
