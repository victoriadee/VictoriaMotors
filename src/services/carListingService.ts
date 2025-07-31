import connectToDatabase, { isDatabaseAvailable } from '../config/database';
import CarListing, { ICarListing } from '../models/CarListing';
import { FilterOptions } from '../types';
import { mockListings } from '../data/mockData';

export class CarListingService {
  async getAllListings(filters?: FilterOptions): Promise<ICarListing[]> {
    if (!isDatabaseAvailable) {
      // Demo mode - use mock data with filtering
      let results = [...mockListings];
      
      if (filters) {
        if (filters.minPrice) results = results.filter(listing => listing.price >= filters.minPrice!);
        if (filters.maxPrice) results = results.filter(listing => listing.price <= filters.maxPrice!);
        if (filters.minYear) results = results.filter(listing => listing.year >= filters.minYear!);
        if (filters.maxYear) results = results.filter(listing => listing.year <= filters.maxYear!);
        if (filters.make) results = results.filter(listing => listing.make.toLowerCase().includes(filters.make!.toLowerCase()));
        if (filters.model) results = results.filter(listing => listing.model.toLowerCase().includes(filters.model!.toLowerCase()));
        if (filters.maxMileage) results = results.filter(listing => listing.mileage <= filters.maxMileage!);
        if (filters.bodyType && filters.bodyType.length > 0) {
          results = results.filter(listing => (filters.bodyType as string[]).includes(listing.bodyType));
        }
        if (filters.fuelType && filters.fuelType.length > 0) {
          results = results.filter(listing => (filters.fuelType as string[]).includes(listing.fuelType));
        }
        if (filters.transmission && filters.transmission.length > 0) {
          results = results.filter(listing => (filters.transmission as string[]).includes(listing.transmission));
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
      }
      
      return results as any[];
    }

    await connectToDatabase();
    
    let query: any = { status: 'active' };
    
    // Apply filters
    if (filters) {
      if (filters.minPrice) query.price = { ...query.price, $gte: filters.minPrice };
      if (filters.maxPrice) query.price = { ...query.price, $lte: filters.maxPrice };
      if (filters.minYear) query.year = { ...query.year, $gte: filters.minYear };
      if (filters.maxYear) query.year = { ...query.year, $lte: filters.maxYear };
      if (filters.make) query.make = new RegExp(filters.make, 'i');
      if (filters.model) query.model = new RegExp(filters.model, 'i');
      if (filters.maxMileage) query.mileage = { $lte: filters.maxMileage };
      if (filters.bodyType && filters.bodyType.length > 0) {
        query.bodyType = { $in: filters.bodyType };
      }
      if (filters.fuelType && filters.fuelType.length > 0) {
        query.fuelType = { $in: filters.fuelType };
      }
      if (filters.transmission && filters.transmission.length > 0) {
        query.transmission = { $in: filters.transmission };
      }
      if (filters.sellerType && filters.sellerType !== 'both') {
        query.sellerType = filters.sellerType;
      }
      if (filters.location) {
        query.location = new RegExp(filters.location, 'i');
      }
      if (filters.keyword) {
        query.$text = { $search: filters.keyword };
      }
    }
    
    const listings = await CarListing.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .lean();
    
    return listings;
  }

  async getListingById(id: string): Promise<ICarListing | null> {
    if (!isDatabaseAvailable) {
      return mockListings.find(listing => listing.id === id) as any || null;
    }

    await connectToDatabase();
    
    const listing = await CarListing.findById(id).lean();
    
    if (listing) {
      // Increment view count
      await CarListing.findByIdAndUpdate(id, { $inc: { views: 1 } });
    }
    
    return listing;
  }

  async getListingsBySeller(sellerId: string): Promise<ICarListing[]> {
    if (!isDatabaseAvailable) {
      return mockListings.filter(listing => listing.sellerId === sellerId) as any[];
    }

    await connectToDatabase();
    
    const listings = await CarListing.find({ sellerId })
      .sort({ createdAt: -1 })
      .lean();
    
    return listings;
  }

  async createListing(listingData: Partial<ICarListing>): Promise<ICarListing> {
    if (!isDatabaseAvailable) {
      // Demo mode - simulate creation
      const newListing = {
        ...listingData,
        id: `demo_listing_${Date.now()}`,
        _id: `demo_listing_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
        featured: false,
        status: 'active',
      };
      return newListing as any;
    }

    await connectToDatabase();
    
    const listing = new CarListing(listingData);
    await listing.save();
    
    return listing.toObject();
  }

  async updateListing(id: string, updateData: Partial<ICarListing>): Promise<ICarListing | null> {
    if (!isDatabaseAvailable) {
      // Demo mode - simulate update
      const listing = mockListings.find(l => l.id === id);
      if (!listing) return null;
      return { ...listing, ...updateData, updatedAt: new Date() } as any;
    }

    await connectToDatabase();
    
    const listing = await CarListing.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).lean();
    
    return listing;
  }

  async deleteListing(id: string): Promise<boolean> {
    if (!isDatabaseAvailable) {
      // Demo mode - simulate deletion
      return true;
    }

    await connectToDatabase();
    
    const result = await CarListing.findByIdAndDelete(id);
    return !!result;
  }

  async getFeaturedListings(limit: number = 6): Promise<ICarListing[]> {
    if (!isDatabaseAvailable) {
      return mockListings.slice(0, limit) as any[];
    }

    await connectToDatabase();
    
    const listings = await CarListing.find({ 
      status: 'active',
      featured: true 
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    return listings;
  }

  async searchListings(searchTerm: string): Promise<ICarListing[]> {
    if (!isDatabaseAvailable) {
      const keyword = searchTerm.toLowerCase();
      return mockListings.filter(listing => 
        listing.title.toLowerCase().includes(keyword) ||
        listing.make.toLowerCase().includes(keyword) ||
        listing.model.toLowerCase().includes(keyword) ||
        listing.description.toLowerCase().includes(keyword)
      ) as any[];
    }

    await connectToDatabase();
    
    const listings = await CarListing.find({
      status: 'active',
      $text: { $search: searchTerm }
    })
      .sort({ score: { $meta: 'textScore' } })
      .lean();
    
    return listings;
  }
}

export const carListingService = new CarListingService();