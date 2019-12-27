import {wrapper} from '../utils/wrapper';
import validate = require('validate.js');
import * as userServices from '../services/user';
import {sendPushs} from '../services/expo';
import {RestroomModel} from '../model/restroom';
import {HelpModel} from '../model/help';
import {ObjectId} from 'bson';

// 헬프 요청
export const postHelp = wrapper(async (req, res) => {
  const input: any = {
    restroomId: req.body.restroomId,
    userId: req.user!._id,
    detail: req.body.detail,
  };
  Object.keys(input).forEach(key => !input[key] && delete input[key]);
  const invalid = validate(input, {
    restroomId: {
      presence: true,
      objectid: true
    },
    detail: {
      type: 'string'
    }
  });
  if (invalid) {
    return res.status(400).json({success: false, msg: invalid});
  }

  const restroom = await RestroomModel.findById(new ObjectId(input.restroomId));
  if (!restroom) {
    return res.status(409).json({success: false, msg: 'wrong restroomId'});
  }
  const help = await HelpModel.create({
    restroom: input.restroomId,
    user: input.userId,
    detail: input.detail,
    state: 1
  });

  const users = await userServices.userNear(restroom.location, 1);
  const pushTokens = [];
  for (let i = 0 ; i < users.length ; i++) {
    pushTokens.push(users[i].token);
  }
  const data = {
    helpId: help._id
  };
  await sendPushs(`근처에 위험에 처한 사람이 있습니다! 도와주세요... 제발`, data, pushTokens);

  return res.status(200).json({success: true});
});
