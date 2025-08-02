import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  BarChart3, 
  Fuel, 
  GitBranch, 
  Car, 
  PaintBucket, 
  Palette, 
  MessageCircle, 
  ChevronLeft, 
  ChevronRight,
  Share2,
  Heart,
  AlertTriangle,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle2
} from 'lucide-react';
import { mockListings } from '../data/mockData';
import { CarListing } from '../types';
import { cn } from '../utils/cn';

const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<CarListing | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isContactFormVisible, setIsContactFormVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const foundListing = mockListings.find(item => item.id === id);
      setListing(foundListing || null);
      setLoading(false);
    }, 500);
  }, [id]);

  const handlePrevImage = () => {
    if (!listing) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? listing.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    if (!listing) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === listing.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleContactFormToggle = () => {
    setIsContactFormVisible(!isContactFormVisible);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the message to the seller
    alert('Your message has been sent to the seller!');
    setIsContactFormVisible(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage);
  };

  if (loading) {
    return (
      <div className="pt-20 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-300 border-t-primary-600 rounded-full animate-spin mb-4"></div>
          <p className="text-secondary-600">Loading car details...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="pt-20 pb-16 min-h-screen">
        <div className="container-custom">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <AlertTriangle size={48} className="text-warning-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-primary-900 mb-4">Listing Not Found</h1>
            <p className="text-secondary-600 mb-6">
              The car listing you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/explore" className="btn btn-primary">
              Browse Other Cars
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16">
      <div className="container-custom">
        {/* Navigation */}
        <div className="flex items-center text-sm text-secondary-500 mb-6">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/explore" className="hover:text-primary-600">Explore</Link>
          <span className="mx-2">/</span>
          <span className="text-secondary-700">{listing.make} {listing.model}</span>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Images and details */}
          <div className="lg:col-span-2">
            {/* Image gallery */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="relative h-[300px] md:h-[500px]">
                <img
                  src={listing.images[currentImageIndex]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-primary-800 rounded-full p-2 shadow-md transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-primary-800 rounded-full p-2 shadow-md transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 rounded-full px-3 py-1 text-sm font-medium">
                  {currentImageIndex + 1} / {listing.images.length}
                </div>
              </div>
              
              <div className="p-4 flex space-x-2 overflow-x-auto">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={cn(
                      "w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2",
                      currentImageIndex === index ? "border-primary-600" : "border-transparent"
                    )}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-primary-900 mb-6">Vehicle Details</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 mb-8">
                <div className="flex items-center">
                  <Calendar size={20} className="text-primary-600 mr-2" />
                  <div>
                    <p className="text-sm text-secondary-500">Year</p>
                    <p className="font-medium">{listing.year}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <BarChart3 size={20} className="text-primary-600 mr-2" />
                  <div>
                    <p className="text-sm text-secondary-500">Mileage</p>
                    <p className="font-medium">{formatMileage(listing.mileage)} mi</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Car size={20} className="text-primary-600 mr-2" />
                  <div>
                    <p className="text-sm text-secondary-500">Body Type</p>
                    <p className="font-medium capitalize">{listing.bodyType}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Fuel size={20} className="text-primary-600 mr-2" />
                  <div>
                    <p className="text-sm text-secondary-500">Fuel Type</p>
                    <p className="font-medium capitalize">{listing.fuelType.replace('_', ' ')}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <GitBranch size={20} className="text-primary-600 mr-2" />
                  <div>
                    <p className="text-sm text-secondary-500">Transmission</p>
                    <p className="font-medium capitalize">{listing.transmission}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <PaintBucket size={20} className="text-primary-600 mr-2" />
                  <div>
                    <p className="text-sm text-secondary-500">Exterior Color</p>
                    <p className="font-medium">{listing.exteriorColor}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Palette size={20} className="text-primary-600 mr-2" />
                  <div>
                    <p className="text-sm text-secondary-500">Interior Color</p>
                    <p className="font-medium">{listing.interiorColor}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin size={20} className="text-primary-600 mr-2" />
                  <div>
                    <p className="text-sm text-secondary-500">Location</p>
                    <p className="font-medium">{listing.location}</p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-3">Description</h3>
              <p className="text-secondary-700 mb-6 leading-relaxed">
                {listing.description}
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                {listing.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle2 size={16} className="text-success-500 mr-2" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Price and contact */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-24">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-primary-900">{listing.title}</h1>
                <button className="text-secondary-400 hover:text-secondary-600 transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
              
              <div className="flex items-center mb-6">
                <div className="bg-primary-900 text-white text-xs font-bold uppercase py-1 px-2 rounded mr-2">
                  {listing.sellerType === 'dealer' ? 'Dealer' : 'Private Seller'}
                </div>
                <p className="text-secondary-500 text-sm">Listed on {new Date(listing.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div className="text-3xl font-bold text-primary-800 mb-6">
                {formatPrice(listing.price)}
              </div>
              
              <div className="space-y-4 mb-8">
                <button
                  onClick={handleContactFormToggle}
                  className="btn btn-primary w-full"
                >
                  <MessageCircle size={18} className="mr-2" />
                  Contact Seller
                </button>
                
                <button className="btn btn-outline w-full">
                  <Heart size={18} className="mr-2" />
                  Save to Favorites
                </button>
              </div>
              
              {isContactFormVisible && (
                <div className="mt-6 border-t border-secondary-200 pt-6 animate-fade-in">
                  <h3 className="text-lg font-semibold mb-4">Contact Seller</h3>
                  
                  <form onSubmit={handleContactSubmit}>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="input"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="input"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-1">
                        Phone (optional)
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="input"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="message" className="block text-sm font-medium text-secondary-700 mb-1">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        required
                        className="input"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="I'm interested in this car. Please contact me with more information."
                      ></textarea>
                    </div>
                    
                    <button type="submit" className="btn btn-primary w-full">
                      Send Message
                    </button>
                  </form>
                </div>
              )}
              
              <div className="border-t border-secondary-200 pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
                
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 mr-4">
                    <User size={24} />
                  </div>
                  <div>
                    <h4 className="font-medium">{listing.sellerName}</h4>
                    <p className="text-sm text-secondary-500 capitalize">{listing.sellerType} Seller</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <MapPin size={16} className="text-secondary-500 mr-2" />
                    <span>{listing.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone size={16} className="text-secondary-500 mr-2" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center">
                    <Mail size={16} className="text-secondary-500 mr-2" />
                    <span>contact@{listing.sellerName.toLowerCase().replace(/\s+/g, '')}.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar listings */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-primary-900 mb-6">Similar Vehicles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockListings
              .filter(item => item.id !== listing.id && (item.make === listing.make || item.bodyType === listing.bodyType))
              .slice(0, 3)
              .map(item => (
                <Link to={`/listing/${item.id}`} key={item.id} className="block">
                  <div className="listing-card group">
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-primary-900 mb-2">
                        {item.title}
                      </h3>
                      
                      <p className="text-xl font-bold text-primary-800 mb-2">
                        {formatPrice(item.price)}
                      </p>
                      
                      <div className="flex items-center text-secondary-600 text-sm">
                        <span className="mr-3">{item.year}</span>
                        <span>{formatMileage(item.mileage)} mi</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;