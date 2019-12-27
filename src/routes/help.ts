import Express from 'express';
import * as authMiddleware from '../middleware/auth';
import * as helpController from '../controller/help';

const Router = Express.Router();

Router.post('/', authMiddleware.verifyLogin, helpController.postHelp);

export default Router;
