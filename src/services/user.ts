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

// 유저 위치 갱신
export const renewUserLocation = async (userId: ObjectId, location: [number, number]) => {
  return await UserModel.findByIdAndUpdate(userId, {
    locationInfo: {
      location,
      updatedAt: new Date()
    }
  });
};
// 유저 expo push 토큰 갱신
export const renewUserToken = async (userId: ObjectId, token: any) => {
  return await UserModel.findByIdAndUpdate(userId, {
    token
  });
};

// location 주고 근처에 있는 users 리스트 가져오기
/**
 * @description wgs84 경도, 위도를 입력받아 근처 1km 이내의 유저 정보를 제공
 * @param location WGS84 [경도, 위도]
 * @param distance 거리 (km 단위)
 */
export const userNear = async (location: [number, number], distance: number) => {
  return await UserModel.find({
    'locationInfo.location': {
      $geoWithin: {
        $centerSphere: [location, distance / 6378.1]
      }
    }
  });
};