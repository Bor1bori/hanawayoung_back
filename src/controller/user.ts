import {wrapper} from '../utils/wrapper';
import validate = require('validate.js');
import * as userServices from '../services/user';

// 유저 위치 갱신
export const putUserLocation = wrapper(async (req, res) => {
  const input: any = {};
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
    }
  });
  if (invalid) {
    return res.status(400).json({success: false, msg: invalid});
  }
  const user = await userServices.renewUserLocation(req.user!._id, [input.x_wgs84, input.y_wgs84]);
  if (!user) {
    throw new Error('no Logined but verifyLogin middleware is passed');
  }
  return res.status(200).json({success: true});
});

