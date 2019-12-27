
import Express from 'express';
import * as userController from '../controller/user';
import * as authMiddleware from '../middleware/auth';
const Router = Express.Router();

Router.put('/:id/location', authMiddleware.verifyUser, userController.putUserLocation);

export default Router;
