import {wrapper} from '../utils/wrapper';
import {selectCopyObject} from '../utils/jsutil';
import validate = require('validate.js');
import * as restroomServices from '../services/restroom';

// wgs84 경도, 위도를 입력받아 근처 1km 이내의 화장실 정보를 제공
export const getNearRestrooms = wrapper(async (req, res) => {
  const input: any = {};
  input.x_wgs84 = parseFloat(req.query.x_wgs84);
  input.y_wgs84 = parseFloat(req.query.y_wgs84);
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
  const restrooms = await restroomServices.restroomNear([input.x_wgs84, input.y_wgs84], 1);
  return res.status(200).json({success: true, restrooms});
});

// 화장실 정보 추가

// 리뷰 작성
export const postReview = wrapper(async (req, res) => {
  const input: any = {
    writer: req.user!._id,
    restroom: req.params.id,
    rating: parseInt(req.body.rating),
    content: req.body.content
  };
  Object.keys(input).forEach(key => !input[key] && delete input[key]);
  const invalid = validate(input, {
    rating: {
      presence: true,
      numericality: {
        greaterThanOrEqualTo: 1,
        lessThanOrEqualTo: 5
      }
    },
    content: {
      presence: true,
      type: 'string'
    }
  });
  if (invalid) {
    return res.status(400).json({success: false, msg: invalid});
  }
  const review = await restroomServices.postReview(input.restroom, input.writer, input.rating, input.content);
  if (!review) {
    throw new Error(':id is not restroomid');
  }
  return res.status(200).json({_id: review._id});
});

// 리뷰 삭제