import connectToDatabase, { isDatabaseAvailable } from '../config/database';
import Subscription, { ISubscription } from '../models/Subscription';

// Mock subscriptions for demo mode
const mockSubscriptions: any[] = [];
export class SubscriptionService {
  async createSubscription(subscriptionData: {
    userId: string;
    planId: string;
    paymentMethod: 'mpesa' | 'free';
    mpesaTransactionId?: string;
    amount?: number;
  }): Promise<ISubscription> {
    if (!isDatabaseAvailable) {
      // Demo mode - simulate subscription creation
      const endDate = subscriptionData.planId === 'premium' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      
      const subscription = {
        _id: `demo_sub_${Date.now()}`,
        ...subscriptionData,
        endDate,
        startDate: new Date(),
        status: 'active',
        autoRenew: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Remove any existing active subscriptions for this user
      const existingIndex = mockSubscriptions.findIndex(s => s.userId === subscriptionData.userId && s.status === 'active');
      if (existingIndex !== -1) {
        mockSubscriptions[existingIndex].status = 'cancelled';
      }
      
      mockSubscriptions.push(subscription);
      return subscription as any;
    }

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
    if (!isDatabaseAvailable) {
      const subscription = mockSubscriptions.find(s => 
        s.userId === userId && 
        s.status === 'active' && 
        new Date(s.endDate) > new Date()
      );
      return subscription || null;
    }

    await connectToDatabase();
    
    const subscription = await Subscription.findOne({
      userId,
      status: 'active',
      endDate: { $gt: new Date() }
    }).lean();
    
    return subscription;
  }

  async updateSubscription(id: string, updateData: Partial<ISubscription>): Promise<ISubscription | null> {
    if (!isDatabaseAvailable) {
      const subscriptionIndex = mockSubscriptions.findIndex(s => s._id === id);
      if (subscriptionIndex === -1) return null;
      
      mockSubscriptions[subscriptionIndex] = { 
        ...mockSubscriptions[subscriptionIndex], 
        ...updateData, 
        updatedAt: new Date() 
      };
      return mockSubscriptions[subscriptionIndex];
    }

    await connectToDatabase();
    
    const subscription = await Subscription.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).lean();
    
    return subscription;
  }

  async cancelSubscription(userId: string): Promise<boolean> {
    if (!isDatabaseAvailable) {
      const subscriptionIndex = mockSubscriptions.findIndex(s => s.userId === userId && s.status === 'active');
      if (subscriptionIndex === -1) return false;
      
      mockSubscriptions[subscriptionIndex].status = 'cancelled';
      mockSubscriptions[subscriptionIndex].autoRenew = false;
      mockSubscriptions[subscriptionIndex].updatedAt = new Date();
      return true;
    }

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
    if (!isDatabaseAvailable) {
      return mockSubscriptions.filter(s => 
        s.status === 'active' && 
        new Date(s.endDate) < new Date()
      );
    }

    await connectToDatabase();
    
    const expiredSubscriptions = await Subscription.find({
      status: 'active',
      endDate: { $lt: new Date() }
    }).lean();
    
    return expiredSubscriptions;
  }

  async renewSubscription(subscriptionId: string): Promise<ISubscription | null> {
    if (!isDatabaseAvailable) {
      const subscriptionIndex = mockSubscriptions.findIndex(s => s._id === subscriptionId);
      if (subscriptionIndex === -1) return null;
      
      const newEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      mockSubscriptions[subscriptionIndex].endDate = newEndDate;
      mockSubscriptions[subscriptionIndex].status = 'active';
      mockSubscriptions[subscriptionIndex].updatedAt = new Date();
      return mockSubscriptions[subscriptionIndex];
    }

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