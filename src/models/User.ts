// Browser-compatible model definition
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  location?: string;
  userType: 'private' | 'dealer';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Only define Mongoose schema in Node.js environment
let UserModel: any = null;

if (typeof window === 'undefined') {
  try {
    const mongoose = require('mongoose');
    const { Schema } = mongoose;

    const UserSchema = new Schema<IUser>({
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
        minlength: 6,
      },
      phone: {
        type: String,
        trim: true,
      },
      location: {
        type: String,
        trim: true,
      },
      userType: {
        type: String,
        enum: ['private', 'dealer'],
        default: 'private',
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
    }, {
      timestamps: true,
    });

    // Index for faster queries
    UserSchema.index({ email: 1 });
    UserSchema.index({ createdAt: -1 });

    UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
  } catch (error) {
    console.warn('Mongoose not available for User model');
  }
}

export default UserModel;