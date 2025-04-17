import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profilePic?: {
    data: Buffer,
    contentType: string
  };
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true, // This will automatically convert email to lowercase
    trim: true // This will remove any leading/trailing whitespace
  },
  password: { type: String, required: true },
  profilePic: {
    data: Buffer,
    contentType: String
  }
});

// Create a case-insensitive index on the email field
UserSchema.index({ email: 1 }, { 
  unique: true,
  collation: { locale: 'en', strength: 2 }
});

export default mongoose.model<IUser>('User', UserSchema);