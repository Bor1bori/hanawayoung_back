import {wrapper} from '../utils/wrapper';
import validate = require('validate.js');
import * as userServices from '../services/user';

// 헬프 요청
export const postHelp = wrapper(async (req, res) => {
  // user와 restroom, detail을 입력으로 받음
  // 근처에 있는 유저들 조회한 후에 알림 요청
  return res.status(200).json({success: true});
});
