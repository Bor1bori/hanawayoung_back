import {UserModel} from '../model/user';
import { ObjectId } from 'bson';


export async function redundencyId(id: string) {
  const ans = await UserModel.find({
    loginId: id
  });
  return ans.length === 0 ? false : true;
}

export async function redundencyNickname(nickname: string) {
  const ans = await UserModel.find({
    nickname: nickname
  });
  return ans.length === 0 ? false: true;
}


export async function createUser(nickname: string, loginId: string, password: string) {
  if (await redundencyNickname(nickname) || await redundencyId(loginId)) {
    return null;
  }
  return await UserModel.create({
    nickname,
    loginId,
    password
  });
}

export async function loginUser(loginId: string, password: string) {
  const user = await UserModel.findOne({loginId, password}).select('-password');
  return user;
}

export async function getUserByObjectId(userId: ObjectId) {
  return await UserModel.findById(userId).select('-password');
}
