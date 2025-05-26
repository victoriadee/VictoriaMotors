import React from 'react';
import { Link } from 'react-router-dom';
import { Search, CreditCard, Truck, Shield, ChevronRight } from 'lucide-react';
import CarListingCard from '../components/car/CarListingCard';
import { mockListings } from '../data/mockData';

const HomePage: React.FC = () => {
  const featuredListings = mockListings.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center h-screen flex items-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://images.pexels.com/photos/919073/pexels-photo-919073.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)'
        }}
      >
        <div className="container-custom text-white">
          <div className="max-w-2xl animate-slide-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Find Your Perfect Car</h1>
            <p className="text-xl md:text-2xl mb-8 text-secondary-100">
              Browse thousands of quality vehicles from trusted sellers
            </p>
            
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
                  <input
                    type="text"
                    placeholder="Search by make, model, or keyword..."
                    className="input pl-10 w-full"
                  />
                </div>
                <Link to="/explore" className="btn btn-primary whitespace-nowrap">
                  Find Cars
                </Link>
              </div>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Link 
                to="/explore?bodyType=sedan" 
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors px-4 py-2 rounded-full text-white"
              >
                Sedans
              </Link>
              <Link 
                to="/explore?bodyType=suv" 
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors px-4 py-2 rounded-full text-white"
              >
                SUVs
              </Link>
              <Link 
                to="/explore?bodyType=truck" 
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors px-4 py-2 rounded-full text-white"
              >
                Trucks
              </Link>
              <Link 
                to="/explore?fuelType=electric" 
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors px-4 py-2 rounded-full text-white"
              >
                Electric
              </Link>
              <Link 
                to="/explore?price=budget" 
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors px-4 py-2 rounded-full text-white"
              >
                Budget-Friendly
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-primary-900 text-center mb-12">Why Choose AutoMarket?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-secondary-50 shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-700 rounded-full mb-4">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-3">Extensive Selection</h3>
              <p className="text-secondary-600">
                Browse thousands of vehicles from trusted dealers and private sellers across the country.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-secondary-50 shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-700 rounded-full mb-4">
                <CreditCard size={32} />
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-3">Secure Transactions</h3>
              <p className="text-secondary-600">
                Our secure payment system ensures that your transactions are protected every step of the way.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-secondary-50 shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-700 rounded-full mb-4">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-3">Verified Listings</h3>
              <p className="text-secondary-600">
                All our listings are verified to ensure accuracy and authenticity for a worry-free purchase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-16 bg-secondary-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-primary-900">Featured Listings</h2>
            <Link to="/explore" className="flex items-center text-primary-600 hover:text-primary-800 font-medium">
              View All
              <ChevronRight size={18} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map(listing => (
              <CarListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* Sell Your Car Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Sell Your Car?</h2>
              <p className="text-secondary-200 text-lg mb-6">
                List your vehicle on AutoMarket and reach thousands of potential buyers. Our simple process makes selling your car quick and hassle-free.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-primary-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">1</div>
                  <span>Create your free account</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-primary-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">2</div>
                  <span>Upload photos and details of your vehicle</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-primary-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">3</div>
                  <span>Pay a small listing fee</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-primary-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">4</div>
                  <span>Connect with interested buyers</span>
                </div>
              </div>
              <Link to="/sell" className="btn btn-accent mt-8 inline-block">
                List Your Car Now
              </Link>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.pexels.com/photos/7144219/pexels-photo-7144219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Sell your car" 
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-primary-900 text-center mb-12">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-secondary-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center text-primary-700 font-bold text-xl mr-4">
                  J
                </div>
                <div>
                  <h4 className="font-semibold text-primary-900">James Wilson</h4>
                  <p className="text-secondary-500 text-sm">Car Seller</p>
                </div>
              </div>
              <p className="text-secondary-600 mb-3">
                "I sold my BMW within days of listing it on AutoMarket. The process was seamless, and I got a great price. Highly recommended for anyone looking to sell their vehicle quickly!"
              </p>
              <div className="flex text-accent-500">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>
            
            <div className="bg-secondary-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center text-primary-700 font-bold text-xl mr-4">
                  M
                </div>
                <div>
                  <h4 className="font-semibold text-primary-900">Maria Johnson</h4>
                  <p className="text-secondary-500 text-sm">Car Buyer</p>
                </div>
              </div>
              <p className="text-secondary-600 mb-3">
                "AutoMarket made finding my dream car so easy. The detailed listings and filters helped me narrow down my search quickly. I found exactly what I was looking for at a great price!"
              </p>
              <div className="flex text-accent-500">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>
            
            <div className="bg-secondary-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center text-primary-700 font-bold text-xl mr-4">
                  R
                </div>
                <div>
                  <h4 className="font-semibold text-primary-900">Robert Chen</h4>
                  <p className="text-secondary-500 text-sm">Car Dealer</p>
                </div>
              </div>
              <p className="text-secondary-600 mb-3">
                "As a dealer, AutoMarket has been instrumental in helping us reach more customers. The platform is user-friendly, and the support team is always ready to assist. It's boosted our sales significantly."
              </p>
              <div className="flex text-accent-500">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary-900 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Perfect Car?</h2>
          <p className="text-secondary-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have found their dream cars on AutoMarket. Start your search today!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/explore" className="btn btn-primary text-base">
              Browse Cars
            </Link>
            <Link to="/sell" className="btn btn-outline border-white text-white hover:bg-white/10 text-base">
              Sell Your Car
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;