import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Shield, Zap } from 'lucide-react';
import SubscriptionPlans from '../components/payment/SubscriptionPlans';
import { useSubscription } from '../contexts/SubscriptionContext';

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { userSubscription, cancelSubscription } = useSubscription();

  const handlePlanSelect = (planId: string) => {
    // Navigate to dashboard or appropriate page after plan selection
    navigate('/dashboard');
  };

  const handleCancelSubscription = () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      cancelSubscription();
    }
  };

  return (
    <div className="pt-20 pb-16 bg-secondary-50 min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-secondary-600" />
          </button>
          <h1 className="text-3xl font-bold text-primary-900">Subscription Plans</h1>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-primary-900 mb-4">
              Why Choose Premium?
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Unlock the full potential of AutoMarket with our premium features designed to help you sell your cars faster and more effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={32} className="text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                Featured Listings
              </h3>
              <p className="text-secondary-600">
                Get your cars featured at the top of search results and increase visibility by up to 5x.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                Unlimited Listings
              </h3>
              <p className="text-secondary-600">
                List as many cars as you want without any restrictions. Perfect for dealers and frequent sellers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                Priority Support
              </h3>
              <p className="text-secondary-600">
                Get dedicated support from our team to help you optimize your listings and sales strategy.
              </p>
            </div>
          </div>
        </div>

        {/* Current Subscription Status */}
        {userSubscription && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">
              Current Subscription
            </h3>
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <p className="text-secondary-700">
                  <span className="font-medium">Plan:</span> {userSubscription.planId === 'premium' ? 'Premium Plan' : 'Free Plan'}
                </p>
                <p className="text-secondary-700">
                  <span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    userSubscription.status === 'active' 
                      ? 'bg-success-100 text-success-800' 
                      : 'bg-warning-100 text-warning-800'
                  }`}>
                    {userSubscription.status.charAt(0).toUpperCase() + userSubscription.status.slice(1)}
                  </span>
                </p>
                {userSubscription.endDate && (
                  <p className="text-secondary-700">
                    <span className="font-medium">Next billing:</span> {new Date(userSubscription.endDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              {userSubscription.planId === 'premium' && userSubscription.status === 'active' && (
                <button
                  onClick={handleCancelSubscription}
                  className="btn btn-outline text-error-600 border-error-200 hover:bg-error-50 mt-4 md:mt-0"
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>
        )}

        {/* Subscription Plans */}
        <SubscriptionPlans onPlanSelect={handlePlanSelect} />

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mt-12">
          <h3 className="text-xl font-bold text-primary-900 mb-6 text-center">
            Frequently Asked Questions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-primary-800 mb-2">
                How does M-Pesa payment work?
              </h4>
              <p className="text-secondary-600 text-sm">
                Simply enter your M-Pesa registered phone number, and you'll receive an STK push notification. Enter your PIN to complete the payment securely.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-primary-800 mb-2">
                Can I cancel my subscription anytime?
              </h4>
              <p className="text-secondary-600 text-sm">
                Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-primary-800 mb-2">
                What happens to my listings if I downgrade?
              </h4>
              <p className="text-secondary-600 text-sm">
                Your existing listings will remain active, but you'll be limited to 2 active listings on the free plan. Additional listings will be paused.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-primary-800 mb-2">
                Is my payment information secure?
              </h4>
              <p className="text-secondary-600 text-sm">
                Yes, all payments are processed securely through Safaricom M-Pesa's encrypted payment gateway. We don't store your payment information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;