import mongoose from 'mongoose';
import { ObjectId } from 'bson';

interface Review {
  writer: ObjectId;
  rating: number;
  content: string;
}

export interface Restroom extends mongoose.Document {
  name: string;
  description?: string;
  location: [number, number]; // 경도 위도 (x, y)
  insertdate: number;
  updatedate: number;
  reviews: Review;
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
  }
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
  reviews: {
    default: [],
    type: [ReviewSchema]
  }
}, {
  timestamps: true
});

export const RestroomModel = mongoose.model<Restroom>('Restroom', schema);
