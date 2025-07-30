import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  planId: string;
  status: 'active' | 'inactive' | 'cancelled' | 'pending';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethod: 'mpesa' | 'free';
  mpesaTransactionId?: string;
  amount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  planId: {
    type: String,
    required: true,
    enum: ['free', 'premium'],
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'cancelled', 'pending'],
    default: 'active',
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  autoRenew: {
    type: Boolean,
    default: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['mpesa', 'free'],
  },
  mpesaTransactionId: {
    type: String,
    sparse: true,
  },
  amount: {
    type: Number,
    min: 0,
  },
}, {
  timestamps: true,
});

// Indexes
SubscriptionSchema.index({ userId: 1 });
SubscriptionSchema.index({ status: 1 });
SubscriptionSchema.index({ endDate: 1 });

export default mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);