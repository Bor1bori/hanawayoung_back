import Express from 'express';
import * as restroomController from '../controller/restroom';
import * as authMiddleware from '../middleware/auth';
const Router = Express.Router();

// wgs84 경도, 위도를 입력받아 근처 1km 이내의 화장실 정보를 제공
Router.get('/', restroomController.getNearRestrooms);


// 화장실 정보 추가


// 리뷰 작성
Router.post('/:id/reviews', authMiddleware.verifyLogin, restroomController.postReview);

// 리뷰 삭제
Router.delete('/:id/reviews');

export default Router;
