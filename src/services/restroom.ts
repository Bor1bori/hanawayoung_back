import {ObjectId} from 'bson';
import {RestroomModel} from '../model/restroom';

/**
 * @description wgs84 경도, 위도를 입력받아 근처 1km 이내의 화장실 정보를 제공
 * @param location WGS84 [경도, 위도]
 * @param distance 거리 (km 단위)
 */
export const restroomNear = async (location: [number, number], distance: number) => {
  return await RestroomModel.find({
    location: {
      $geoWithin: {
        $centerSphere: [location, distance / 6378.1]
      }
    }
  }).populate({
    path: 'reviews.writer',
    select: '-password'
  });
};

// 화장실 정보 추가

// 리뷰 작성
export const postReview = async (restroomId: ObjectId, writer: ObjectId, rating: number, content: string) => {
  const restroom =  await RestroomModel.findById(restroomId);
  if (!restroom) {
    return null;
  }
  restroom.reviews.push({writer, rating, content, images: []});
  const review = restroom.reviews[restroom.reviews.length - 1];
  await restroom.save();
  return review;
};
// 리뷰 삭제
