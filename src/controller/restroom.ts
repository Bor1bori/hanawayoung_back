import {wrapper} from '../utils/wrapper';
import {selectCopyObject} from '../utils/jsutil';
import validate = require('validate.js');
import {restroomNear} from '../services/restroom';

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
  const restrooms = await restroomNear([input.x_wgs84, input.y_wgs84], 1);
  console.log(restrooms);
  return res.status(200).json({success: true, restrooms});
});

// 화장실 정보 추가

// 리뷰 작성

// 리뷰 삭제