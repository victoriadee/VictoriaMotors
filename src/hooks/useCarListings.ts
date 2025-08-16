import { useState, useEffect } from 'react';
import { carListingService } from '../services/carListingService';
import { ICarListing } from '../models/CarListing';
import { FilterOptions } from '../types';

export const useCarListings = (filters?: FilterOptions) => {
  const [listings, setListings] = useState<ICarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await carListingService.getAllListings(filters);
      setListings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [JSON.stringify(filters)]);

  return {
    listings,
    loading,
    error,
    refetch: fetchListings,
  };
};

export const useCarListing = (id: string) => {
  const [listing, setListing] = useState<ICarListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await carListingService.getListingById(id);
        setListing(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch listing');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  return {
    listing,
    loading,
    error,
  };
};

export const useUserListings = (userId: string) => {
  const [listings, setListings] = useState<ICarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await carListingService.getListingsBySeller(userId);
        setListings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user listings');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserListings();
    }
  }, [userId]);

  return {
    listings,
    loading,
    error,
  };
};