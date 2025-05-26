import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUpDown, MapPin } from 'lucide-react';
import SearchFilters from '../components/car/SearchFilters';
import CarListingCard from '../components/car/CarListingCard';
import { mockListings } from '../data/mockData';
import { CarListing, FilterOptions } from '../types';
import { cn } from '../utils/cn';

const ExplorePage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [filteredListings, setFilteredListings] = useState<CarListing[]>(mockListings);
  const [sortOrder, setSortOrder] = useState<'price-asc' | 'price-desc' | 'year-desc' | 'mileage-asc'>('price-desc');
  const [loading, setLoading] = useState(false);

  // Extract initial filters from URL params
  const getInitialFilters = (): FilterOptions => {
    const initialFilters: FilterOptions = {};
    
    if (queryParams.has('bodyType')) {
      initialFilters.bodyType = [queryParams.get('bodyType') as string];
    }
    
    if (queryParams.has('fuelType')) {
      initialFilters.fuelType = [queryParams.get('fuelType') as string];
    }
    
    if (queryParams.has('price')) {
      if (queryParams.get('price') === 'budget') {
        initialFilters.maxPrice = 25000;
      }
    }
    
    return initialFilters;
  };

  const [currentFilters, setCurrentFilters] = useState<FilterOptions>(getInitialFilters());

  const applyFilters = (filters: FilterOptions) => {
    setLoading(true);
    setCurrentFilters(filters);
    
    // Simulate API call delay
    setTimeout(() => {
      let results = [...mockListings];
      
      // Apply filters
      if (filters.minPrice) {
        results = results.filter(listing => listing.price >= filters.minPrice!);
      }
      
      if (filters.maxPrice) {
        results = results.filter(listing => listing.price <= filters.maxPrice!);
      }
      
      if (filters.minYear) {
        results = results.filter(listing => listing.year >= filters.minYear!);
      }
      
      if (filters.maxYear) {
        results = results.filter(listing => listing.year <= filters.maxYear!);
      }
      
      if (filters.make) {
        results = results.filter(listing => listing.make === filters.make);
      }
      
      if (filters.maxMileage) {
        results = results.filter(listing => listing.mileage <= filters.maxMileage!);
      }
      
      if (filters.bodyType && (filters.bodyType as string[]).length > 0) {
        results = results.filter(listing => 
          (filters.bodyType as string[]).includes(listing.bodyType)
        );
      }
      
      if (filters.fuelType && (filters.fuelType as string[]).length > 0) {
        results = results.filter(listing => 
          (filters.fuelType as string[]).includes(listing.fuelType)
        );
      }
      
      if (filters.transmission && (filters.transmission as string[]).length > 0) {
        results = results.filter(listing => 
          (filters.transmission as string[]).includes(listing.transmission)
        );
      }
      
      if (filters.sellerType && filters.sellerType !== 'both') {
        results = results.filter(listing => listing.sellerType === filters.sellerType);
      }
      
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        results = results.filter(listing => 
          listing.title.toLowerCase().includes(keyword) ||
          listing.make.toLowerCase().includes(keyword) ||
          listing.model.toLowerCase().includes(keyword) ||
          listing.description.toLowerCase().includes(keyword)
        );
      }
      
      // Apply sort
      applySorting(results);
      
      setLoading(false);
    }, 500);
  };

  const applySorting = (listings: CarListing[]) => {
    let sortedListings = [...listings];
    
    switch (sortOrder) {
      case 'price-asc':
        sortedListings.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedListings.sort((a, b) => b.price - a.price);
        break;
      case 'year-desc':
        sortedListings.sort((a, b) => b.year - a.year);
        break;
      case 'mileage-asc':
        sortedListings.sort((a, b) => a.mileage - b.mileage);
        break;
      default:
        break;
    }
    
    setFilteredListings(sortedListings);
  };

  const handleSortChange = (newSortOrder: typeof sortOrder) => {
    setSortOrder(newSortOrder);
    applySorting(filteredListings);
  };

  // Apply initial filters
  useEffect(() => {
    applyFilters(getInitialFilters());
  }, [location.search]);

  return (
    <div className="pt-20 pb-16">
      <div className="bg-primary-800 py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold text-white mb-6">Find Your Perfect Car</h1>
          <SearchFilters onFilter={applyFilters} />
        </div>
      </div>
      
      <div className="container-custom mt-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content */}
          <div className="w-full">
            {/* Results header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-primary-900">
                  {filteredListings.length} {filteredListings.length === 1 ? 'Car' : 'Cars'} Found
                </h2>
                {Object.keys(currentFilters).length > 0 && (
                  <p className="text-sm text-secondary-500">Filtered results based on your criteria</p>
                )}
              </div>
              
              <div className="flex items-center">
                <span className="text-sm text-secondary-600 mr-2">Sort by:</span>
                <div className="relative group">
                  <button className="btn btn-outline py-1 flex items-center gap-1">
                    {sortOrder === 'price-asc' && 'Price: Low to High'}
                    {sortOrder === 'price-desc' && 'Price: High to Low'}
                    {sortOrder === 'year-desc' && 'Newest First'}
                    {sortOrder === 'mileage-asc' && 'Lowest Mileage'}
                    <ArrowUpDown size={14} />
                  </button>
                  
                  <div className="absolute right-0 mt-1 bg-white border border-secondary-200 rounded-md shadow-lg overflow-hidden z-10 w-48 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <button 
                      className={cn(
                        "block w-full text-left px-4 py-2 text-sm hover:bg-secondary-100",
                        sortOrder === 'price-asc' && "bg-primary-50 text-primary-700"
                      )}
                      onClick={() => handleSortChange('price-asc')}
                    >
                      Price: Low to High
                    </button>
                    <button 
                      className={cn(
                        "block w-full text-left px-4 py-2 text-sm hover:bg-secondary-100",
                        sortOrder === 'price-desc' && "bg-primary-50 text-primary-700"
                      )}
                      onClick={() => handleSortChange('price-desc')}
                    >
                      Price: High to Low
                    </button>
                    <button 
                      className={cn(
                        "block w-full text-left px-4 py-2 text-sm hover:bg-secondary-100",
                        sortOrder === 'year-desc' && "bg-primary-50 text-primary-700"
                      )}
                      onClick={() => handleSortChange('year-desc')}
                    >
                      Newest First
                    </button>
                    <button 
                      className={cn(
                        "block w-full text-left px-4 py-2 text-sm hover:bg-secondary-100",
                        sortOrder === 'mileage-asc' && "bg-primary-50 text-primary-700"
                      )}
                      onClick={() => handleSortChange('mileage-asc')}
                    >
                      Lowest Mileage
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Car listings */}
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block w-12 h-12 border-4 border-primary-300 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                <p className="text-secondary-600">Searching for cars...</p>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-primary-900 mb-2">No cars found</h3>
                <p className="text-secondary-600 mb-6">
                  We couldn't find any cars matching your search criteria. Try adjusting your filters.
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => applyFilters({})}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map(listing => (
                  <CarListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;