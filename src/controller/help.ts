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
    userId: req.user!._id,
    detail: req.body.detail,
  };
  input.x_wgs84 = parseFloat(req.body.x_wgs84);
  input.y_wgs84 = parseFloat(req.body.y_wgs84);

  Object.keys(input).forEach(key => !input[key] && delete input[key]);
  const invalid = validate(input, {
    x_wgs84: {
      presence: true,
      type: 'number'
    },
    y_wgs84: {
      presence: true,
      type: 'number'
    },
    detail: {
      type: 'string'
    }
  });
  if (invalid) {
    return res.status(400).json({success: false, msg: invalid});
  }

  const users = await userServices.userNear([input.x_wgs84, input.y_wgs84], 1);
  const pushTokens = [];
  for (let i = 0 ; i < users.length ; i++) {
    pushTokens.push(users[i].token);
  }
  const data = {
    location: [input.x_wgs84, input.y_wgs84],
    user: input.userId
  };
  await sendPushs(`근처에 위험에 처한 사람이 있습니다! 도와주세요... 제발`, data, pushTokens);

  return res.status(200).json({success: true});
});
