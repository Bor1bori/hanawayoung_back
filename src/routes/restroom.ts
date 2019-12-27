import Express from 'express';
import * as restroomController from '../controller/restroom';

const Router = Express.Router();

// wgs84 경도, 위도를 입력받아 근처 1km 이내의 화장실 정보를 제공
Router.get('/', restroomController.getNearRestrooms);





// 화장실 정보 추가

// 리뷰 작성

// 리뷰 삭제
export default Router;
