import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, X, CreditCard, DollarSign, Check } from 'lucide-react';
import { carMakes, popularBodyTypes, fuelTypes, transmissionTypes } from '../data/mockData';
import { useSubscription } from '../contexts/SubscriptionContext';
import { Link } from 'react-router-dom';

interface FormData {
  title: string;
  price: string;
  year: string;
  make: string;
  model: string;
  mileage: string;
  fuelType: string;
  transmission: string;
  exteriorColor: string;
  interiorColor: string;
  bodyType: string;
  description: string;
  features: string[];
  images: File[];
  location: string;
}

interface PaymentStep {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
}

const SellCarPage: React.FC = () => {
  const navigate = useNavigate();
  const { isSubscribed, userSubscription } = useSubscription();
  
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    price: '',
    year: '',
    make: '',
    model: '',
    mileage: '',
    fuelType: '',
    transmission: '',
    exteriorColor: '',
    interiorColor: '',
    bodyType: '',
    description: '',
    features: [],
    images: [],
    location: '',
  });
  
  const [paymentData, setPaymentData] = useState<PaymentStep>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  });
  
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  // Check if user can list more cars (free plan limitation)
  const canListMoreCars = isSubscribed || true; // For demo, always allow
  const maxListingsReached = !isSubscribed && false; // For demo, set to false

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleFeatureToggle = (feature: string) => {
    const updatedFeatures = formData.features.includes(feature)
      ? formData.features.filter(f => f !== feature)
      : [...formData.features, feature];
    
    setFormData({
      ...formData,
      features: updatedFeatures,
    });
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = [...formData.images, ...filesArray].slice(0, 10); // Limit to 10 images
      
      setFormData({
        ...formData,
        images: newImages,
      });
      
      // Create URLs for preview
      const newImageURLs = newImages.map(file => URL.createObjectURL(file));
      
      // Revoke any old URLs to prevent memory leaks
      imageURLs.forEach(url => URL.revokeObjectURL(url));
      
      setImageURLs(newImageURLs);
    }
  };
  
  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    
    setFormData({
      ...formData,
      images: newImages,
    });
    
    // Update preview URLs
    URL.revokeObjectURL(imageURLs[index]);
    const newImageURLs = [...imageURLs];
    newImageURLs.splice(index, 1);
    setImageURLs(newImageURLs);
  };
  
  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      // Format card number with spaces
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setPaymentData({
        ...paymentData,
        [name]: formatted,
      });
    } else if (name === 'expiryDate') {
      // Format expiry date with slash
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;
      if (cleaned.length > 2) {
        formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
      }
      setPaymentData({
        ...paymentData,
        [name]: formatted,
      });
    } else {
      setPaymentData({
        ...paymentData,
        [name]: value,
      });
    }
  };
  
  const validateStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return (
          formData.title.trim() !== '' &&
          formData.price.trim() !== '' &&
          formData.year.trim() !== '' &&
          formData.make.trim() !== '' &&
          formData.model.trim() !== '' &&
          formData.mileage.trim() !== ''
        );
      case 2:
        return (
          formData.fuelType.trim() !== '' &&
          formData.transmission.trim() !== '' &&
          formData.bodyType.trim() !== '' &&
          formData.description.trim() !== ''
        );
      case 3:
        return formData.images.length > 0 && formData.location.trim() !== '';
      case 4:
        return (
          paymentData.cardNumber.replace(/\s/g, '').length === 16 &&
          paymentData.expiryDate.length === 5 &&
          paymentData.cvv.length >= 3 &&
          paymentData.nameOnCard.trim() !== ''
        );
      default:
        return false;
    }
  };
  
  const goToNextStep = () => {
    if (validateStep()) {
      setCurrentStep((currentStep + 1) as 1 | 2 | 3 | 4);
      window.scrollTo(0, 0);
    }
  };
  
  const goToPreviousStep = () => {
    setCurrentStep((currentStep - 1) as 1 | 2 | 3 | 4);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      setSubmitting(true);
      
      // Simulate API call for submission
      setTimeout(() => {
        setSubmitting(false);
        // Navigate to success or dashboard page
        navigate('/dashboard');
      }, 2000);
    }
  };
  
  const commonFeatures = [
    'Air Conditioning',
    'Power Steering',
    'Power Windows',
    'Power Locks',
    'Cruise Control',
    'AM/FM Stereo',
    'Bluetooth',
    'Navigation System',
    'Leather Seats',
    'Sunroof/Moonroof',
    'Heated Seats',
    'Backup Camera',
    'Parking Sensors',
    'Keyless Entry',
    'Keyless Start',
    'Alloy Wheels',
    'Third Row Seating',
    'Apple CarPlay/Android Auto',
    'Blind Spot Monitoring',
    'Lane Departure Warning',
  ];

  return (
    <div className="pt-20 pb-16 bg-secondary-50">
      <div className="container-custom max-w-4xl">
        {/* Subscription Notice for Free Users */}
        {!isSubscribed && (
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Upgrade to Premium</h3>
                <p className="text-primary-100 mb-4 md:mb-0">
                  Get unlimited listings, featured placement, and priority support for just KSH 100/month.
                </p>
              </div>
              <Link to="/subscription" className="btn bg-white text-primary-700 hover:bg-primary-50 whitespace-nowrap">
                Upgrade Now
              </Link>
            </div>
          </div>
        )}

        {maxListingsReached && (
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-warning-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-warning-800">
                  Listing Limit Reached
                </h3>
                <div className="mt-2 text-sm text-warning-700">
                  <p>
                    You've reached the maximum number of listings for the free plan (2 listings). 
                    Upgrade to Premium to list unlimited cars.
                  </p>
                </div>
                <div className="mt-4">
                  <Link to="/subscription" className="btn btn-warning text-sm">
                    Upgrade to Premium
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-900 mb-4">Sell Your Car</h1>
            
            {/* Progress Bar */}
            <div className="relative pt-8">
              <div className="flex mb-2 items-center justify-between">
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(currentStep / 4) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex text-xs justify-between -mt-2">
                <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-primary-700' : 'text-secondary-400'}`}>
                  <div className={`rounded-full h-6 w-6 flex items-center justify-center ${currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-secondary-200'}`}>
                    {currentStep > 1 ? <Check size={14} /> : '1'}
                  </div>
                  <span className="mt-1">Basic Info</span>
                </div>
                <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-primary-700' : 'text-secondary-400'}`}>
                  <div className={`rounded-full h-6 w-6 flex items-center justify-center ${currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-secondary-200'}`}>
                    {currentStep > 2 ? <Check size={14} /> : '2'}
                  </div>
                  <span className="mt-1">Details</span>
                </div>
                <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-primary-700' : 'text-secondary-400'}`}>
                  <div className={`rounded-full h-6 w-6 flex items-center justify-center ${currentStep >= 3 ? 'bg-primary-600 text-white' : 'bg-secondary-200'}`}>
                    {currentStep > 3 ? <Check size={14} /> : '3'}
                  </div>
                  <span className="mt-1">Photos</span>
                </div>
                <div className={`flex flex-col items-center ${currentStep >= 4 ? 'text-primary-700' : 'text-secondary-400'}`}>
                  <div className={`rounded-full h-6 w-6 flex items-center justify-center ${currentStep >= 4 ? 'bg-primary-600 text-white' : 'bg-secondary-200'}`}>
                    4
                  </div>
                  <span className="mt-1">Payment</span>
                </div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-semibold text-primary-900 mb-6">Basic Information</h2>
                
                <div className="mb-6">
                  <label htmlFor="title" className="block text-sm font-medium text-secondary-700 mb-2">
                    Listing Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="input"
                    placeholder="e.g., 2018 Honda Accord EX-L"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-secondary-700 mb-2">
                      Price ($) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <DollarSign size={16} className="text-secondary-400" />
                      </div>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        className="input pl-10"
                        placeholder="29,999"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-secondary-700 mb-2">
                      Year *
                    </label>
                    <input
                      type="number"
                      id="year"
                      name="year"
                      className="input"
                      placeholder="2020"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="make" className="block text-sm font-medium text-secondary-700 mb-2">
                      Make *
                    </label>
                    <select
                      id="make"
                      name="make"
                      className="input"
                      value={formData.make}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Make</option>
                      {carMakes.map(make => (
                        <option key={make} value={make}>{make}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="model" className="block text-sm font-medium text-secondary-700 mb-2">
                      Model *
                    </label>
                    <input
                      type="text"
                      id="model"
                      name="model"
                      className="input"
                      placeholder="e.g., Accord, F-150, Model 3"
                      value={formData.model}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="mileage" className="block text-sm font-medium text-secondary-700 mb-2">
                    Mileage *
                  </label>
                  <input
                    type="number"
                    id="mileage"
                    name="mileage"
                    className="input"
                    placeholder="e.g., 45000"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}
            
            {/* Step 2: Vehicle Details */}
            {currentStep === 2 && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-semibold text-primary-900 mb-6">Vehicle Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label htmlFor="fuelType" className="block text-sm font-medium text-secondary-700 mb-2">
                      Fuel Type *
                    </label>
                    <select
                      id="fuelType"
                      name="fuelType"
                      className="input"
                      value={formData.fuelType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Fuel Type</option>
                      {fuelTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="transmission" className="block text-sm font-medium text-secondary-700 mb-2">
                      Transmission *
                    </label>
                    <select
                      id="transmission"
                      name="transmission"
                      className="input"
                      value={formData.transmission}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Transmission</option>
                      {transmissionTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="bodyType" className="block text-sm font-medium text-secondary-700 mb-2">
                      Body Type *
                    </label>
                    <select
                      id="bodyType"
                      name="bodyType"
                      className="input"
                      value={formData.bodyType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Body Type</option>
                      {popularBodyTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="exteriorColor" className="block text-sm font-medium text-secondary-700 mb-2">
                      Exterior Color
                    </label>
                    <input
                      type="text"
                      id="exteriorColor"
                      name="exteriorColor"
                      className="input"
                      placeholder="e.g., White, Black, Silver"
                      value={formData.exteriorColor}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="interiorColor" className="block text-sm font-medium text-secondary-700 mb-2">
                      Interior Color
                    </label>
                    <input
                      type="text"
                      id="interiorColor"
                      name="interiorColor"
                      className="input"
                      placeholder="e.g., Black, Tan, Gray"
                      value={formData.interiorColor}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="description" className="block text-sm font-medium text-secondary-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    className="input"
                    placeholder="Describe your vehicle's condition, history, and any other relevant details..."
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Features
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {commonFeatures.map(feature => (
                      <label key={feature} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                          checked={formData.features.includes(feature)}
                          onChange={() => handleFeatureToggle(feature)}
                        />
                        <span className="ml-2 text-sm text-secondary-700">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Photos and Location */}
            {currentStep === 3 && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-semibold text-primary-900 mb-6">Photos and Location</h2>
                
                <div className="mb-8">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Upload Photos * (Up to 10 photos)
                  </label>
                  <p className="text-sm text-secondary-500 mb-4">
                    Add high-quality photos of your vehicle. Include exterior, interior, and any notable features or damage.
                  </p>
                  
                  {/* Image upload area */}
                  <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={formData.images.length >= 10}
                    />
                    <label
                      htmlFor="images"
                      className={`flex flex-col items-center justify-center cursor-pointer ${formData.images.length >= 10 ? 'opacity-50' : ''}`}
                    >
                      <Upload size={36} className="text-secondary-400 mb-2" />
                      <span className="text-secondary-700 font-medium">Click to upload images</span>
                      <span className="text-sm text-secondary-500 mt-1">
                        or drag and drop files here
                      </span>
                      <span className="text-xs text-secondary-400 mt-1">
                        PNG, JPG, JPEG up to 5MB each
                      </span>
                    </label>
                  </div>
                  
                  {/* Image previews */}
                  {imageURLs.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-secondary-700 mb-2">
                        Uploaded Photos ({imageURLs.length}/10)
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {imageURLs.map((url, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-w-16 aspect-h-12 rounded-md overflow-hidden bg-secondary-100">
                              <img
                                src={url}
                                alt={`Vehicle preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md opacity-80 hover:opacity-100"
                              onClick={() => removeImage(index)}
                            >
                              <X size={14} className="text-error-500" />
                            </button>
                          </div>
                        ))}
                        
                        {formData.images.length < 10 && (
                          <label
                            htmlFor="images"
                            className="aspect-w-16 aspect-h-12 rounded-md border-2 border-dashed border-secondary-300 flex items-center justify-center cursor-pointer"
                          >
                            <div className="flex flex-col items-center justify-center">
                              <Plus size={24} className="text-secondary-400" />
                              <span className="text-xs text-secondary-500 mt-1">Add More</span>
                            </div>
                          </label>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="location" className="block text-sm font-medium text-secondary-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="input"
                    placeholder="e.g., San Francisco, CA"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}
            
            {/* Step 4: Payment */}
            {currentStep === 4 && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-semibold text-primary-900 mb-6">Listing Payment</h2>
                
                <div className="bg-secondary-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-primary-800 mb-4">Listing Summary</h3>
                  
                  <div className="mb-4">
                    <p className="text-secondary-600">
                      You're about to list your <strong>{formData.year} {formData.make} {formData.model}</strong> for <strong>${formData.price}</strong>
                    </p>
                  </div>
                  
                  <div className="border-t border-secondary-200 pt-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-secondary-600">Standard Listing Fee</span>
                      <span className="font-medium">$19.99</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Tax</span>
                      <span className="font-medium">$1.60</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-secondary-200 pt-4">
                    <div className="flex justify-between">
                      <span className="font-medium text-lg">Total</span>
                      <span className="font-bold text-lg">$21.59</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-primary-800 mb-4">Payment Method</h3>
                  
                  <div className="mb-4">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-secondary-700 mb-2">
                      Card Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <CreditCard size={16} className="text-secondary-400" />
                      </div>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        className="input pl-10"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        value={paymentData.cardNumber}
                        onChange={handlePaymentInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-secondary-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        className="input"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={paymentData.expiryDate}
                        onChange={handlePaymentInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-secondary-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        className="input"
                        placeholder="123"
                        maxLength={4}
                        value={paymentData.cvv}
                        onChange={handlePaymentInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="nameOnCard" className="block text-sm font-medium text-secondary-700 mb-2">
                      Name on Card *
                    </label>
                    <input
                      type="text"
                      id="nameOnCard"
                      name="nameOnCard"
                      className="input"
                      placeholder="John Smith"
                      value={paymentData.nameOnCard}
                      onChange={handlePaymentInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                      required
                    />
                    <span className="ml-2 text-sm text-secondary-700">
                      I agree to the listing terms and confirm that all information provided is accurate.
                    </span>
                  </label>
                </div>
              </div>
            )}
            
            {/* Navigation buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-secondary-200">
              {currentStep > 1 ? (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={goToPreviousStep}
                >
                  Previous
                </button>
              ) : (
                <div></div>
              )}
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={goToNextStep}
                  disabled={!validateStep()}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting || !validateStep()}
                >
                  {submitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Payment...
                    </span>
                  ) : (
                    'Pay & List Your Car'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellCarPage;