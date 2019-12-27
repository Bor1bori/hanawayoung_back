import mongoose from 'mongoose';


export interface Image extends mongoose.Document {
  bucketName?: string; // aws에 저장되었을 경우 bucketName
  region?: string;  // aws에 저장되었을 경우 region
  key?: string;  // aws에 저장되었을 경우 객체 key
  url: string; // 파일 url
  isInAws: boolean;
}

const schema = new mongoose.Schema({
  bucketName: {
    type: String
  },
  isInAws: {
    type: Boolean,
    default: false
  },
  key: {
    type: String
  },
  region: {
    type: String
  },
  url: {
    type: String,
    required: true,
    unique: true
  }
});

export const ImageModel = mongoose.model<Image>('Image', schema);
