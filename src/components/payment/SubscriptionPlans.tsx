import React, { useState } from 'react';
import { Check, Star, CreditCard } from 'lucide-react';
import { SubscriptionPlan } from '../../types/payment';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { cn } from '../../utils/cn';
import MpesaPayment from './MpesaPayment';

interface SubscriptionPlansProps {
  onPlanSelect?: (planId: string) => void;
  showPayment?: boolean;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ 
  onPlanSelect, 
  showPayment = true 
}) => {
  const { plans, userSubscription, isSubscribed } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showMpesaPayment, setShowMpesaPayment] = useState(false);

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    if (plan.id === 'free') {
      // Handle free plan selection
      onPlanSelect?.(plan.id);
    } else {
      // Show M-Pesa payment for premium plan
      setSelectedPlan(plan);
      setShowMpesaPayment(true);
    }
  };

  const handlePaymentSuccess = () => {
    setShowMpesaPayment(false);
    setSelectedPlan(null);
    onPlanSelect?.(selectedPlan?.id || '');
  };

  const handlePaymentCancel = () => {
    setShowMpesaPayment(false);
    setSelectedPlan(null);
  };

  if (showMpesaPayment && selectedPlan) {
    return (
      <MpesaPayment
        plan={selectedPlan}
        onSuccess={handlePaymentSuccess}
        onCancel={handlePaymentCancel}
      />
    );
  }

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-primary-900 mb-4">
          Choose Your Plan
        </h2>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          Select the plan that best fits your car selling needs. Upgrade or downgrade at any time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              'relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl',
              plan.popular 
                ? 'border-primary-500 ring-2 ring-primary-200' 
                : 'border-secondary-200 hover:border-primary-300',
              userSubscription?.planId === plan.id && 'ring-2 ring-success-200 border-success-400'
            )}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                  <Star size={14} className="mr-1" />
                  Most Popular
                </div>
              </div>
            )}

            {userSubscription?.planId === plan.id && (
              <div className="absolute -top-4 right-4">
                <div className="bg-success-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Current Plan
                </div>
              </div>
            )}

            <div className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-primary-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-4xl font-bold text-primary-800">
                    {plan.currency} {plan.price}
                  </span>
                  <span className="text-secondary-500 ml-2">
                    /{plan.interval}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check 
                      size={20} 
                      className={cn(
                        'mr-3 mt-0.5 flex-shrink-0',
                        plan.popular ? 'text-primary-600' : 'text-success-500'
                      )} 
                    />
                    <span className="text-secondary-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {showPayment && (
                <button
                  onClick={() => handlePlanSelect(plan)}
                  disabled={userSubscription?.planId === plan.id && userSubscription?.status === 'active'}
                  className={cn(
                    'w-full py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center',
                    plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-secondary-300'
                      : 'bg-secondary-100 text-secondary-800 hover:bg-secondary-200 disabled:bg-secondary-300',
                    userSubscription?.planId === plan.id && userSubscription?.status === 'active'
                      ? 'cursor-not-allowed'
                      : 'cursor-pointer'
                  )}
                >
                  {userSubscription?.planId === plan.id && userSubscription?.status === 'active' ? (
                    'Current Plan'
                  ) : plan.id === 'free' ? (
                    'Get Started Free'
                  ) : (
                    <>
                      <CreditCard size={18} className="mr-2" />
                      Pay with M-Pesa
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isSubscribed && (
        <div className="mt-12 text-center">
          <div className="bg-success-50 border border-success-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="flex items-center justify-center mb-2">
              <Check size={24} className="text-success-600 mr-2" />
              <span className="text-success-800 font-medium">Premium Active</span>
            </div>
            <p className="text-success-700 text-sm">
              Your premium subscription is active until{' '}
              {userSubscription?.endDate && 
                new Date(userSubscription.endDate).toLocaleDateString()
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;