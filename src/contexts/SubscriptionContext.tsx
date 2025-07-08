import React, { createContext, useContext, useState, useEffect } from 'react';
import { SubscriptionPlan, UserSubscription } from '../types/payment';

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
    // Load user subscription from localStorage
    const storedSubscription = localStorage.getItem('userSubscription');
    if (storedSubscription) {
      const subscription = JSON.parse(storedSubscription);
      // Check if subscription is still valid
      if (new Date(subscription.endDate) > new Date()) {
        setUserSubscription(subscription);
      } else {
        // Subscription expired, remove it
        localStorage.removeItem('userSubscription');
      }
    }
  }, []);

  const updateSubscription = (subscription: UserSubscription) => {
    setUserSubscription(subscription);
    localStorage.setItem('userSubscription', JSON.stringify(subscription));
  };

  const cancelSubscription = () => {
    if (userSubscription) {
      const cancelledSubscription = {
        ...userSubscription,
        status: 'cancelled' as const,
        autoRenew: false
      };
      setUserSubscription(cancelledSubscription);
      localStorage.setItem('userSubscription', JSON.stringify(cancelledSubscription));
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