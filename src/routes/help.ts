import Express from 'express';
import * as authMiddleware from '../middleware/auth';
import * as helpController from '../controller/help';
import {UserModel} from '../model/user';
import {sendPushs} from '../services/expo';
const Router = Express.Router();

Router.post('/', authMiddleware.verifyLogin, helpController.postHelp);
Router.get('/test', helpController.postHelp, async (req, res) => {
  try {
    const users = await UserModel.find({token: {$exists: true}});
    const pushTokens = [];
    for (let i = 0 ; i < users.length ; i++) {
      pushTokens.push(users[i].token.value);
    }
    console.log('tokens: ', pushTokens);
    await sendPushs('testeset테스트중asdf', pushTokens);
  } catch(err){
    console.log(err);
  }
});

export default Router;
