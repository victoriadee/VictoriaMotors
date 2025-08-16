import React, { useState } from 'react';
import { Search, ChevronDown, Filter, X } from 'lucide-react';
import { FilterOptions } from '../../types';
import { carMakes, popularBodyTypes, fuelTypes, transmissionTypes } from '../../data/mockData';
import { cn } from '../../utils/cn';

interface SearchFiltersProps {
  onFilter: (filters: FilterOptions) => void;
  className?: string;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onFilter, className }) => {
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [keyword, setKeyword] = useState('');

  const toggleAdvancedFilter = () => {
    setIsAdvancedFilterOpen(!isAdvancedFilterOpen);
  };

  const handleFilterChange = (name: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (name: keyof FilterOptions, value: string) => {
    setFilters(prev => {
      const currentValues = prev[name] as string[] || [];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [name]: currentValues.filter(v => v !== value)
        };
      } else {
        return {
          ...prev,
          [name]: [...currentValues, value]
        };
      }
    });
  };

  const clearFilters = () => {
    setFilters({});
    setKeyword('');
  };

  const applyFilters = () => {
    onFilter({ ...filters, keyword });
  };

  return (
    <div className={cn('bg-white rounded-lg shadow-md p-4', className)}>
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
          <input
            type="text"
            placeholder="Search by make, model, or keyword..."
            className="input pl-10"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <button 
            className="btn btn-primary flex-1 lg:flex-none" 
            onClick={applyFilters}
          >
            Search
          </button>
          
          <button 
            className={cn(
              "btn btn-outline flex items-center gap-1", 
              isAdvancedFilterOpen && "bg-secondary-100"
            )}
            onClick={toggleAdvancedFilter}
          >
            <Filter size={16} />
            <span className="hidden md:inline">Filters</span>
            <ChevronDown size={16} className={cn(
              "transition-transform",
              isAdvancedFilterOpen && "rotate-180"
            )} />
          </button>
        </div>
      </div>
      
      {isAdvancedFilterOpen && (
        <div className="border-t border-secondary-200 pt-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label htmlFor="make" className="block text-sm font-medium text-secondary-700 mb-1">
                Make
              </label>
              <select
                id="make"
                className="input"
                value={filters.make || ''}
                onChange={(e) => handleFilterChange('make', e.target.value)}
              >
                <option value="">Any Make</option>
                {carMakes.map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="minYear" className="block text-sm font-medium text-secondary-700 mb-1">
                Year Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  id="minYear"
                  placeholder="From"
                  className="input w-1/2"
                  value={filters.minYear || ''}
                  onChange={(e) => handleFilterChange('minYear', e.target.value ? parseInt(e.target.value) : undefined)}
                />
                <input
                  type="number"
                  id="maxYear"
                  placeholder="To"
                  className="input w-1/2"
                  value={filters.maxYear || ''}
                  onChange={(e) => handleFilterChange('maxYear', e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-secondary-700 mb-1">
                Price Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  id="minPrice"
                  placeholder="Min"
                  className="input w-1/2"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                />
                <input
                  type="number"
                  id="maxPrice"
                  placeholder="Max"
                  className="input w-1/2"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="maxMileage" className="block text-sm font-medium text-secondary-700 mb-1">
                Max Mileage
              </label>
              <input
                type="number"
                id="maxMileage"
                placeholder="Maximum miles"
                className="input"
                value={filters.maxMileage || ''}
                onChange={(e) => handleFilterChange('maxMileage', e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
            <div>
              <h4 className="text-sm font-medium text-secondary-700 mb-2">Body Type</h4>
              <div className="flex flex-wrap gap-2">
                {popularBodyTypes.map(type => (
                  <button
                    key={type.value}
                    className={cn(
                      "btn px-3 py-1 text-xs",
                      (filters.bodyType as string[])?.includes(type.value) 
                        ? "btn-primary" 
                        : "btn-outline"
                    )}
                    onClick={() => handleMultiSelectChange('bodyType', type.value)}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-secondary-700 mb-2">Fuel Type</h4>
              <div className="flex flex-wrap gap-2">
                {fuelTypes.map(type => (
                  <button
                    key={type.value}
                    className={cn(
                      "btn px-3 py-1 text-xs",
                      (filters.fuelType as string[])?.includes(type.value) 
                        ? "btn-primary" 
                        : "btn-outline"
                    )}
                    onClick={() => handleMultiSelectChange('fuelType', type.value)}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-secondary-700 mb-2">Transmission</h4>
              <div className="flex flex-wrap gap-2">
                {transmissionTypes.map(type => (
                  <button
                    key={type.value}
                    className={cn(
                      "btn px-3 py-1 text-xs",
                      (filters.transmission as string[])?.includes(type.value) 
                        ? "btn-primary" 
                        : "btn-outline"
                    )}
                    onClick={() => handleMultiSelectChange('transmission', type.value)}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mt-4 pt-4 border-t border-secondary-200">
            <button 
              className="btn btn-outline flex items-center gap-1" 
              onClick={clearFilters}
            >
              <X size={16} />
              Clear Filters
            </button>
            <button 
              className="btn btn-primary" 
              onClick={applyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;