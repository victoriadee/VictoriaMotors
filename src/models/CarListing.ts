// Browser-compatible model definition
export interface ICarListing {
  _id: string;
  title: string;
  price: number;
  year: number;
  make: string;
  model: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  exteriorColor: string;
  interiorColor: string;
  bodyType: string;
  description: string;
  features: string[];
  images: string[];
  location: string;
  sellerId: string;
  sellerName: string;
  sellerType: 'private' | 'dealer';
  status: 'active' | 'pending' | 'sold' | 'expired';
  views: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Only define Mongoose schema in Node.js environment
let CarListingModel: any = null;

if (typeof window === 'undefined') {
  try {
    const mongoose = require('mongoose');
    const { Schema } = mongoose;

    const CarListingSchema = new Schema<ICarListing>({
      title: {
        type: String,
        required: true,
        trim: true,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      year: {
        type: Number,
        required: true,
        min: 1900,
        max: new Date().getFullYear() + 1,
      },
      make: {
        type: String,
        required: true,
        trim: true,
      },
      model: {
        type: String,
        required: true,
        trim: true,
      },
      mileage: {
        type: Number,
        required: true,
        min: 0,
      },
      fuelType: {
        type: String,
        required: true,
        enum: ['gasoline', 'diesel', 'electric', 'hybrid', 'plugin_hybrid', 'natural_gas', 'other'],
      },
      transmission: {
        type: String,
        required: true,
        enum: ['automatic', 'manual', 'semi-automatic', 'cvt'],
      },
      exteriorColor: {
        type: String,
        trim: true,
      },
      interiorColor: {
        type: String,
        trim: true,
      },
      bodyType: {
        type: String,
        required: true,
        enum: ['sedan', 'suv', 'truck', 'coupe', 'convertible', 'wagon', 'hatchback', 'van', 'minivan'],
      },
      description: {
        type: String,
        required: true,
        trim: true,
      },
      features: [{
        type: String,
        trim: true,
      }],
      images: [{
        type: String,
        required: true,
      }],
      location: {
        type: String,
        required: true,
        trim: true,
      },
      sellerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      sellerName: {
        type: String,
        required: true,
        trim: true,
      },
      sellerType: {
        type: String,
        required: true,
        enum: ['private', 'dealer'],
      },
      status: {
        type: String,
        enum: ['active', 'pending', 'sold', 'expired'],
        default: 'active',
      },
      views: {
        type: Number,
        default: 0,
      },
      featured: {
        type: Boolean,
        default: false,
      },
    }, {
      timestamps: true,
    });

    // Indexes for better query performance
    CarListingSchema.index({ sellerId: 1 });
    CarListingSchema.index({ status: 1 });
    CarListingSchema.index({ make: 1, model: 1 });
    CarListingSchema.index({ price: 1 });
    CarListingSchema.index({ year: 1 });
    CarListingSchema.index({ bodyType: 1 });
    CarListingSchema.index({ fuelType: 1 });
    CarListingSchema.index({ location: 1 });
    CarListingSchema.index({ createdAt: -1 });
    CarListingSchema.index({ featured: -1, createdAt: -1 });

    // Text search index
    CarListingSchema.index({
      title: 'text',
      description: 'text',
      make: 'text',
      model: 'text',
    });

    CarListingModel = mongoose.models.CarListing || mongoose.model<ICarListing>('CarListing', CarListingSchema);
  } catch (error) {
    console.warn('Mongoose not available for CarListing model');
  }
}

export default CarListingModel;