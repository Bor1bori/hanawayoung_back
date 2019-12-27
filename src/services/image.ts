import {ImageModel} from '../model/image';
import AWS from 'aws-sdk';
import uuid from 'uuid';
import * as config from '../config';
import {ObjectId} from 'bson';
import fileType from 'file-type';

const bucketName = 'mypchef-image';

/**
 * @description buffer를 받아 aws s3에 등록하고 image 모델에 객체를 추가하는 함수
 * @param buffer 이미지 버퍼
 */
export async function addWithBuffer(buffer: Buffer) {
  const typeOfFile = fileType(buffer);
  const s3 = new AWS.S3({...config.getValue('awsConfig')});
  const objectParams = {Bucket: bucketName, Key: uuid.v1() + (typeOfFile ? '.' + typeOfFile.ext : ''), Body: buffer};
  await s3.putObject(objectParams).promise();
  const image = await ImageModel.create({
    bucketName,
    isInAws: true,
    key: objectParams.Key,
    region: config.getValue('awsConfig').region,
    url: `https://${bucketName}.s3.ap-northeast-2.amazonaws.com/` + objectParams.Key
  });
  return image;
}

/**
 * @description url을 입력받아 이미지 모델에 새 객체로 등록
 * @param url 이미지 url
 */
export async function addWithUrl(url: string) {
  try {
    const image = await ImageModel.create({
      isInAws: false,
      url
    });
    return image;
  } catch (err) {
    throw err;
  }
}

/**
 * @description image _id와 buffer를 입력받아 image를 수정하는 함수
 *  기존에 aws s3에 등록되어있으면 s3에서 해당 파일을 삭제하고 새로 등록한 후에 url 교체
 *  아닐 경우 새로 등록한 후에 url 교체
 * @param buffer 이미지 버퍼
 * @param id 이미지 objectId
 * @returns id가 잘못되었을 경우 null, 성공할 경우 image 객체 리턴
 */
export async function modifyWithBuffer(buffer: Buffer, id: ObjectId | string) {
  const typeOfFile = fileType(buffer);
  const s3 = new AWS.S3({...config.getValue('awsConfig')});
  const image = await ImageModel.findById(id);
  const key = uuid.v1() + (typeOfFile ? '.' + typeOfFile.ext : '');
  if (!image) {
    return null;
  } else if (image.isInAws) {
    await s3.deleteObject({Bucket: image.bucketName!, Key: image.key!}).promise();
    await s3.putObject(
      {Bucket: bucketName, Key: key, Body: buffer}
    ).promise();
  } else {
    await s3.putObject({
      Bucket: bucketName, Key: key, Body: buffer}
    ).promise();
  }
  image.bucketName = bucketName;
  image.isInAws = true;
  image.key = key;
  image.region = config.getValue('awsConfig').region;
  image.url = `https://${bucketName}.s3.ap-northeast-2.amazonaws.com/` + key;
  await image.save();
  return image;
}

/**
 * @description image _id와 url을 입력받아 image를 수정하는 함수
 *  기존에 aws s3에 등록되어있으면 s3에서 해당 파일을 삭제하고 입력받은 url로 교체
 *  아닐 경우 바로 url 교체
 * @param url 이미지 url
 * @param id 이미지 objectId
 * @returns id가 잘못되었을 경우 null, 성공할 경우 image 객체 리턴
 */
export async function modifyWithUrl(url: string, id: ObjectId | string) {
  const s3 = new AWS.S3({...config.getValue('awsConfig')});
  const image = await ImageModel.findById(id);
  if (!image) {
    return null;
  } else if (image.isInAws) {
    await s3.deleteObject({Bucket: image.bucketName!, Key: image.key!}).promise();
  }
  image.bucketName = '';
  image.isInAws = false;
  image.key = '';
  image.region = '';
  image.url = url;
  await image.save();
  return image;
}

/**
 * @description Image를 삭제합니다. S3에 저장되어있을 경우 s3에서 삭제하고 삭제합니다.
 * @param id ObjectId of Image
 */
export async function deleteImage(id: ObjectId) {
  const s3 = new AWS.S3({...config.getValue('awsConfig')});
  const image = await ImageModel.findById(id);
  if (!image) {
    return null;
  } else if (image.isInAws) {
    await s3.deleteObject({Bucket: image.bucketName!, Key: image.key!}).promise();
  }
  await image.remove();
  return image;
}
