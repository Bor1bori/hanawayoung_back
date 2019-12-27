import mongoose from 'mongoose';
import { ObjectId } from 'bson';

export interface Help extends mongoose.Document {
  restroom: ObjectId;
  user: ObjectId;
  detail: string;
  state: 0 | 1; // 0이면 비활성화, 1이면 활성화
}

const schema = new mongoose.Schema({
  restroom: {
    ref: 'Restroom',
    type: ObjectId
  },
  user: {
    ref: 'User',
    type: ObjectId
  },
  detail: {
    type: String
  },
  state: {
    type: Number
  }
}, {
  timestamps: true
});

export const HelpModel = mongoose.model<Help>('Help', schema);
