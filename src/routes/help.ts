import Express from 'express';
import * as authMiddleware from '../middleware/auth';
import * as helpController from '../controller/help';
import {UserModel} from '../model/user';
import {sendPush} from '../services/expo';
const Router = Express.Router();

Router.post('/', authMiddleware.verifyLogin, helpController.postHelp);
Router.get('/test', helpController.postHelp, async (req, res) => {
  try {
    const users = await UserModel.find({token: {$exists: true}});
    for (let i = 0 ; i < users.length ; i++) {
      await sendPush('testeset테스트중asdf', users[i].token.value);
    }
  } catch(err){
    console.log(err);
  }
});

export default Router;
