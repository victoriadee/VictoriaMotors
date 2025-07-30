import connectToDatabase from '../config/database';
import Subscription, { ISubscription } from '../models/Subscription';

export class SubscriptionService {
  async createSubscription(subscriptionData: {
    userId: string;
    planId: string;
    paymentMethod: 'mpesa' | 'free';
    mpesaTransactionId?: string;
    amount?: number;
  }): Promise<ISubscription> {
    await connectToDatabase();
    
    // Cancel any existing active subscriptions for this user
    await Subscription.updateMany(
      { userId: subscriptionData.userId, status: 'active' },
      { status: 'cancelled', updatedAt: new Date() }
    );
    
    // Calculate end date (30 days from now for premium, no end date for free)
    const endDate = subscriptionData.planId === 'premium' 
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year for free plan
    
    const subscription = new Subscription({
      ...subscriptionData,
      endDate,
      status: 'active',
    });
    
    await subscription.save();
    return subscription.toObject();
  }

  async getUserSubscription(userId: string): Promise<ISubscription | null> {
    await connectToDatabase();
    
    const subscription = await Subscription.findOne({
      userId,
      status: 'active',
      endDate: { $gt: new Date() }
    }).lean();
    
    return subscription;
  }

  async updateSubscription(id: string, updateData: Partial<ISubscription>): Promise<ISubscription | null> {
    await connectToDatabase();
    
    const subscription = await Subscription.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).lean();
    
    return subscription;
  }

  async cancelSubscription(userId: string): Promise<boolean> {
    await connectToDatabase();
    
    const result = await Subscription.updateMany(
      { userId, status: 'active' },
      { 
        status: 'cancelled',
        autoRenew: false,
        updatedAt: new Date()
      }
    );
    
    return result.modifiedCount > 0;
  }

  async getExpiredSubscriptions(): Promise<ISubscription[]> {
    await connectToDatabase();
    
    const expiredSubscriptions = await Subscription.find({
      status: 'active',
      endDate: { $lt: new Date() }
    }).lean();
    
    return expiredSubscriptions;
  }

  async renewSubscription(subscriptionId: string): Promise<ISubscription | null> {
    await connectToDatabase();
    
    const newEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    const subscription = await Subscription.findByIdAndUpdate(
      subscriptionId,
      { 
        endDate: newEndDate,
        status: 'active',
        updatedAt: new Date()
      },
      { new: true }
    ).lean();
    
    return subscription;
  }
}

export const subscriptionService = new SubscriptionService();