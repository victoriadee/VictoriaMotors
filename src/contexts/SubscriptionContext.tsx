import React, { createContext, useContext, useState, useEffect } from 'react';
import { SubscriptionPlan, UserSubscription } from '../types/payment';
import { subscriptionService } from '../services/subscriptionService';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  plans: SubscriptionPlan[];
  userSubscription: UserSubscription | null;
  isSubscribed: boolean;
  updateSubscription: (subscription: UserSubscription) => void;
  cancelSubscription: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: React.ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const { user } = useAuth();

  const plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Free Plan',
      price: 0,
      currency: 'KSH',
      interval: 'monthly',
      features: [
        'List up to 2 cars',
        'Basic listing features',
        'Standard support',
        'Basic analytics'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 100,
      currency: 'KSH',
      interval: 'monthly',
      features: [
        'Unlimited car listings',
        'Premium listing features',
        'Priority support',
        'Advanced analytics',
        'Featured listings',
        'Multiple photos per listing',
        'Social media promotion'
      ],
      popular: true
    }
  ];

  useEffect(() => {
    const fetchUserSubscription = async () => {
      if (user?.id) {
        try {
          const subscription = await subscriptionService.getUserSubscription(user.id);
          if (subscription) {
            const userSub: UserSubscription = {
              id: subscription._id,
              userId: subscription.userId.toString(),
              planId: subscription.planId,
              status: subscription.status,
              startDate: subscription.startDate.toISOString(),
              endDate: subscription.endDate.toISOString(),
              autoRenew: subscription.autoRenew,
              paymentMethod: subscription.paymentMethod,
            };
            setUserSubscription(userSub);
          }
        } catch (error) {
          console.error('Failed to fetch user subscription:', error);
        }
      }
    };

    fetchUserSubscription();
  }, [user?.id]);

  const updateSubscription = (subscription: UserSubscription) => {
    setUserSubscription(subscription);
  };

  const cancelSubscription = async () => {
    if (userSubscription && user?.id) {
      try {
        await subscriptionService.cancelSubscription(user.id);
        const cancelledSubscription = {
          ...userSubscription,
          status: 'cancelled' as const,
          autoRenew: false
        };
        setUserSubscription(cancelledSubscription);
      } catch (error) {
        console.error('Failed to cancel subscription:', error);
        throw error;
      }
    }
  };

  const isSubscribed = userSubscription?.status === 'active' && userSubscription?.planId === 'premium';

  const value = {
    plans,
    userSubscription,
    isSubscribed,
    updateSubscription,
    cancelSubscription,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};