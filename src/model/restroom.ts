import mongoose from 'mongoose';
import { ObjectId } from 'bson';
import { Image } from './image';

interface Review {
  _id?: ObjectId;
  writer: ObjectId;
  rating: number;
  content: string;
  images: [ObjectId] | [] | [Image];
}

export interface Restroom extends mongoose.Document {
  name: string;
  description?: string;
  location: [number, number]; // 경도 위도 (x, y)
  insertdate: number;
  updatedate: number;
  reviews: [Review];
  images: [ObjectId];
}
const ReviewSchema = new mongoose.Schema({
  writer: {
    type: String,
    ref: 'User'
  },
  rating: {
    type: Number
  },
  content: {
    type: String
  },
  images: {
    default: [],
    type: [{
      ref: 'Image',
      type: ObjectId
    }]
  },
});

const schema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  location: {
    type: Array
  },
  insertdate: {
    type: Number,

  },
  updatedate: {
    type: Number,
  },
  images: {
    default: [],
    type: [{
      ref: 'Image',
      type: ObjectId
    }]
  },
  reviews: {
    default: [],
    type: [ReviewSchema]
  }
}, {
  timestamps: true
});

export const RestroomModel = mongoose.model<Restroom>('Restroom', schema);
