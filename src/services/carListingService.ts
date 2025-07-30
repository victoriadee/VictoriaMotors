import connectToDatabase from '../config/database';
import CarListing, { ICarListing } from '../models/CarListing';
import { FilterOptions } from '../types';

export class CarListingService {
  async getAllListings(filters?: FilterOptions): Promise<ICarListing[]> {
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
    await connectToDatabase();
    
    const listing = await CarListing.findById(id).lean();
    
    if (listing) {
      // Increment view count
      await CarListing.findByIdAndUpdate(id, { $inc: { views: 1 } });
    }
    
    return listing;
  }

  async getListingsBySeller(sellerId: string): Promise<ICarListing[]> {
    await connectToDatabase();
    
    const listings = await CarListing.find({ sellerId })
      .sort({ createdAt: -1 })
      .lean();
    
    return listings;
  }

  async createListing(listingData: Partial<ICarListing>): Promise<ICarListing> {
    await connectToDatabase();
    
    const listing = new CarListing(listingData);
    await listing.save();
    
    return listing.toObject();
  }

  async updateListing(id: string, updateData: Partial<ICarListing>): Promise<ICarListing | null> {
    await connectToDatabase();
    
    const listing = await CarListing.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).lean();
    
    return listing;
  }

  async deleteListing(id: string): Promise<boolean> {
    await connectToDatabase();
    
    const result = await CarListing.findByIdAndDelete(id);
    return !!result;
  }

  async getFeaturedListings(limit: number = 6): Promise<ICarListing[]> {
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