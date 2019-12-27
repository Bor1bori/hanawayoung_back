import {wrapper} from '../utils/wrapper';
import {jwtVerify, aesDecrypt} from '../utils/auth';
import validate = require('validate.js');
import {getUserByObjectId} from '../services/user';
import {ObjectId} from 'bson';

/**
 * @description 로그인이 필요한 routes에 다른 로직 처리에 앞서 넣으면 됨.
 * 이후 request handler에서 req.user로 접근, 로그인이 안되어있을 경우 status(403)을 보내기 때문에
 * 이후 request handler에 왔다면 req.user의 존재는 보장됨.(로그인이 확인됨)
 * 추후 CSRF 공격에 대한 보안 점검 필요
 */
export const verifyLogin = wrapper(async (req, res, next) => {
  const token = req.cookies['X-Access-Token'];
  if (!token) {
    return res.status(403).json({success: false, msg: 'no login token'});
  }
  let decoded: any;
  try {
    decoded = jwtVerify(token);
  } catch (err) {
    return res.status(403).json({success: false, msg: 'wrong token'});
  }
  const user = await getUserByObjectId(new ObjectId(decoded.userId));
  if (!user) {
    return res.status(403).json({success: false, msg: 'wrong token'});
  }

  req.user = user;
  next();
});

export const verifyUser = wrapper(async (req, res, next) => {
  const token = req.cookies['X-Access-Token'];
  if (!token) {
    return res.status(403).json({success: false, msg: 'no login token'});
  }
  let decoded: any;
  try {
    decoded = jwtVerify(token);
  } catch (err) {
    return res.status(403).json({success: false, msg: 'wrong token'});
  }
  const user = await getUserByObjectId(new ObjectId(decoded.userId));
  if (!user) {
    return res.status(403).json({success: false, msg: 'wrong token'});
  }
  if (user._id.toString() !== req.params.id.toString()) {
    return res.status(403).json({success: false, msg: 'wrong :id'});
  }

  req.user = user;
  next();
});