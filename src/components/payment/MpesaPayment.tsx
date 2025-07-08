import React, { useState } from 'react';
import { ArrowLeft, Smartphone, Shield, Clock, CheckCircle, XCircle } from 'lucide-react';
import { SubscriptionPlan, UserSubscription } from '../../types/payment';
import { mpesaService } from '../../services/mpesaService';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useAuth } from '../../contexts/AuthContext';

interface MpesaPaymentProps {
  plan: SubscriptionPlan;
  onSuccess: () => void;
  onCancel: () => void;
}

type PaymentStep = 'details' | 'processing' | 'success' | 'failed';

const MpesaPayment: React.FC<MpesaPaymentProps> = ({ plan, onSuccess, onCancel }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentStep, setCurrentStep] = useState<PaymentStep>('details');
  const [checkoutRequestID, setCheckoutRequestID] = useState('');
  const [error, setError] = useState('');
  const { updateSubscription } = useSubscription();
  const { user } = useAuth();

  const formatPhoneNumber = (phone: string) => {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as Kenyan number
    if (cleaned.startsWith('0')) {
      return `254${cleaned.slice(1)}`;
    } else if (cleaned.startsWith('254')) {
      return cleaned;
    } else if (cleaned.length === 9) {
      return `254${cleaned}`;
    }
    
    return cleaned;
  };

  const validatePhoneNumber = (phone: string) => {
    const formatted = formatPhoneNumber(phone);
    return formatted.length === 12 && formatted.startsWith('254');
  };

  const handlePayment = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid Kenyan phone number');
      return;
    }

    setError('');
    setCurrentStep('processing');

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      // Use demo service for development
      const response = await mpesaService.simulatePayment({
        phoneNumber: formattedPhone,
        amount: plan.price,
        accountReference: `SUB_${user?.id || 'demo'}_${Date.now()}`,
        transactionDesc: `${plan.name} Subscription - AutoMarket`,
      });

      setCheckoutRequestID(response.checkoutRequestID);

      // Simulate payment processing time
      setTimeout(async () => {
        try {
          const status = await mpesaService.simulatePaymentStatus(response.checkoutRequestID);
          
          if (status.resultCode === '0') {
            // Payment successful
            const subscription: UserSubscription = {
              id: `sub_${Date.now()}`,
              userId: user?.id || 'demo',
              planId: plan.id,
              status: 'active',
              startDate: new Date().toISOString(),
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
              autoRenew: true,
              paymentMethod: 'mpesa',
            };

            updateSubscription(subscription);
            setCurrentStep('success');
          } else {
            setCurrentStep('failed');
            setError('Payment was not completed. Please try again.');
          }
        } catch (err) {
          setCurrentStep('failed');
          setError('Failed to verify payment status. Please contact support.');
        }
      }, 3000);

    } catch (err) {
      setCurrentStep('failed');
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits, spaces, hyphens, and plus signs
    const cleaned = value.replace(/[^\d\s\-+]/g, '');
    setPhoneNumber(cleaned);
    setError('');
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
        <div className="flex items-center mb-4">
          <button
            onClick={onCancel}
            className="mr-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">M-Pesa Payment</h2>
        </div>
        <div className="flex items-center">
          <Smartphone size={24} className="mr-3" />
          <div>
            <p className="text-green-100">Pay with M-Pesa</p>
            <p className="text-sm text-green-200">Secure mobile payment</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {currentStep === 'details' && (
          <div className="space-y-6">
            {/* Plan Summary */}
            <div className="bg-secondary-50 rounded-lg p-4">
              <h3 className="font-semibold text-primary-900 mb-2">{plan.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-secondary-600">Monthly subscription</span>
                <span className="text-2xl font-bold text-primary-800">
                  KSH {plan.price}
                </span>
              </div>
            </div>

            {/* Phone Number Input */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-2">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="0712 345 678"
                className="input"
                maxLength={15}
              />
              <p className="text-xs text-secondary-500 mt-1">
                Enter your M-Pesa registered phone number
              </p>
              {error && (
                <p className="text-error-600 text-sm mt-1">{error}</p>
              )}
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Shield size={20} className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-blue-900 font-medium mb-1">Secure Payment</h4>
                  <p className="text-blue-700 text-sm">
                    Your payment is processed securely through Safaricom M-Pesa. 
                    You'll receive an STK push notification on your phone.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={!phoneNumber || !validatePhoneNumber(phoneNumber)}
              className="btn btn-primary w-full py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pay KSH {plan.price}
            </button>
          </div>
        )}

        {currentStep === 'processing' && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                Processing Payment
              </h3>
              <p className="text-secondary-600 mb-4">
                Please check your phone for the M-Pesa STK push notification and enter your PIN to complete the payment.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Clock size={20} className="text-yellow-600 mr-2" />
                  <span className="text-yellow-800 text-sm">
                    Waiting for payment confirmation...
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'success' && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center">
                <CheckCircle size={32} className="text-success-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-success-900 mb-2">
                Payment Successful!
              </h3>
              <p className="text-secondary-600 mb-4">
                Your {plan.name} subscription is now active. You can now enjoy all premium features.
              </p>
              <button
                onClick={onSuccess}
                className="btn btn-success w-full"
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        )}

        {currentStep === 'failed' && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center">
                <XCircle size={32} className="text-error-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-error-900 mb-2">
                Payment Failed
              </h3>
              <p className="text-secondary-600 mb-4">
                {error || 'Something went wrong with your payment. Please try again.'}
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setCurrentStep('details')}
                  className="btn btn-primary w-full"
                >
                  Try Again
                </button>
                <button
                  onClick={onCancel}
                  className="btn btn-outline w-full"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MpesaPayment;