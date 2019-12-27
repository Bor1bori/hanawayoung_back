import express from 'express';
import * as userService from '../services/user';
import {wrapper} from '../utils/wrapper';
import validate from 'validate.js';
import {selectCopyObject} from '../utils/jsutil';
import {hash, jwtSign} from '../utils/auth';

export const registerUser = wrapper(async (req, res) => {
  const input = selectCopyObject(req.body, ['nickname', 'loginId', 'password']);
  const invalid = validate(input, {
    nickname: {
      presence: true,
      type: 'string'
    },
    loginId: {
      presence: true,
      type: 'string'
    },
    password: {
      presence: true,
      type: 'string'
    }
  });
  if (invalid) {
    return res.status(400).json({success: false, msg: invalid});
  }
  const hashedPassword = hash(input.password);
  const user = await userService.createUser(input.nickname, input.loginId, hashedPassword);
  if (!user) {
    return res.status(409).json({success: false, msg: '닉네임 혹은 ID 중복'});
  }
  res.status(200).json({success: true, _id: user._id});
});

export const loginUser = wrapper(async (req, res) => {
  const input = selectCopyObject(req.body, ['loginId', 'password']);
  const invalid = validate(input, {
    loginId: {
      presence: true,
      type: 'string'
    },
    password: {
      presence: true,
      type: 'string'
    }
  });
  if (invalid) {
    return res.status(400).json({success: false, msg: invalid});
  }
  const hashedPassword = hash(input.password);
  const user = await userService.loginUser(input.loginId, hashedPassword);
  if (!user) {
    return res.status(409).json({success: false, msg: '로그인 실패'});
  }
  const token = jwtSign({userId: user._id});
  res.cookie('X-Access-Token', token);
  return res.status(200).json({
    success: true,
    'X-Access-Token': token,
    user
  });
});

export const logout = wrapper(async (req, res) => {  
  res.clearCookie('X-Access-Token');
  return res.status(200).json({success: true});
});
