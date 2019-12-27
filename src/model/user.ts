import mongoose from 'mongoose';
import { ObjectId } from 'bson';

interface LocationInfo {
  location: [number, number]; // 경도 위도 (x, y)
  updatedAt: string;
}

export interface User extends mongoose.Document {
  nickname: string;
  loginId: string;
  password: string;
  locationInfo: LocationInfo;
  token: any;
}

const schema = new mongoose.Schema({
  nickname: {
    required: true,
    type: String
  },
  loginId: {
    required: true,
    type: String
  },
  password: {
    required: true,
    type: String
  },
  locationInfo: {
    type: mongoose.SchemaTypes.Mixed
  },
  token: {
    type: mongoose.SchemaTypes.Mixed
  }
}, {
  timestamps: true
});

export const UserModel = mongoose.model<User>('User', schema);
