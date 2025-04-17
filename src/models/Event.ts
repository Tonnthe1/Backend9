import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  address: string;
  date: Date;
  eventType: string;
  onlineSync: boolean;
  coverImage?: string;
  creator: mongoose.Types.ObjectId;
}

const EventSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  dateTime: { type: Date, required: true },
  eventType: { type: String, required: true },
  onlineSync: { type: Boolean, default: false },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverImage: { type: String }
});

export default mongoose.model<IEvent>('Event', EventSchema);