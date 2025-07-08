import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SubscriptionPlans from '../components/payment/SubscriptionPlans';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSubscriptionPlans, setShowSubscriptionPlans] = useState(false);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    
    try {
      await register(name, email, password);
      setShowSubscriptionPlans(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    }
  };

  const handlePlanSelect = (planId: string) => {
    // Navigate to dashboard after plan selection
    navigate('/dashboard');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (showSubscriptionPlans) {
    return (
      <div className="pt-20 pb-16 min-h-screen bg-secondary-50">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-900 mb-4">
              Welcome to AutoMarket!
            </h1>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Your account has been created successfully. Choose a plan to get started with selling your cars.
            </p>
          </div>
          <SubscriptionPlans onPlanSelect={handlePlanSelect} />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 min-h-screen flex items-center justify-center bg-secondary-50">
      <div className="container-custom max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-900 mb-2">Create an Account</h1>
            <p className="text-secondary-600">Join AutoMarket to start selling your vehicles</p>
          </div>
          
          {errorMessage && (
            <div className="bg-error-50 border border-error-200 text-error-800 px-4 py-3 rounded mb-6">
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                required
                className="input"
                placeholder="John Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  required
                  className="input pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-secondary-500">
                Must be at least 8 characters long
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                required
                className="input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                  required
                />
                <span className="ml-2 text-sm text-secondary-700">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-800">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-800">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <UserPlus size={18} className="mr-2" />
                  Create Account
                </span>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-secondary-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-800 font-medium">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;