
import Express from 'express';
import * as userController from '../controller/user';
import * as authMiddleware from '../middleware/auth';
const Router = Express.Router();

// 유저 위치 갱신
Router.put('/:id/location', authMiddleware.verifyUser, userController.putUserLocation);
Router.put('/:id/token', authMiddleware.verifyUser, userController.putUserToken);

export default Router;
