import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, BarChart3, Fuel, GitBranch } from 'lucide-react';
import { CarListing } from '../../types';
import { cn } from '../../utils/cn';

interface CarListingCardProps {
  listing: CarListing;
  className?: string;
}

const CarListingCard: React.FC<CarListingCardProps> = ({ listing, className }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage);
  };

  return (
    <div className={cn('listing-card group', className)}>
      <Link to={`/listing/${listing.id}`} className="block">
        <div className="relative overflow-hidden h-48">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3 bg-accent-500 text-white text-sm font-medium py-1 px-2 rounded">
            {listing.sellerType === 'dealer' ? 'Dealer' : 'Private Seller'}
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-primary-900 truncate">
              {listing.title}
            </h3>
          </div>
          
          <p className="text-2xl font-bold text-primary-800 mb-3">
            {formatPrice(listing.price)}
          </p>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center text-secondary-600">
              <Calendar size={16} className="mr-1" />
              <span className="text-sm">{listing.year}</span>
            </div>
            
            <div className="flex items-center text-secondary-600">
              <BarChart3 size={16} className="mr-1" />
              <span className="text-sm">{formatMileage(listing.mileage)} mi</span>
            </div>
            
            <div className="flex items-center text-secondary-600">
              <Fuel size={16} className="mr-1" />
              <span className="text-sm capitalize">{listing.fuelType.replace('_', ' ')}</span>
            </div>
            
            <div className="flex items-center text-secondary-600">
              <GitBranch size={16} className="mr-1" />
              <span className="text-sm capitalize">{listing.transmission}</span>
            </div>
          </div>
          
          <div className="flex items-center text-secondary-600 mb-1">
            <MapPin size={16} className="mr-1 flex-shrink-0" />
            <span className="text-sm truncate">{listing.location}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CarListingCard;