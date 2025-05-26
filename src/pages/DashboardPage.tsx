import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Edit, 
  Trash2, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  PlusCircle,
  LineChart,
  User,
  MessageCircle,
  Settings,
  LogOut,
  ChevronUp,
  ChevronDown,
  Heart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockListings } from '../data/mockData';
import { cn } from '../utils/cn';

type TabType = 'listings' | 'messages' | 'favorites' | 'account';
type ListingStatus = 'active' | 'pending' | 'sold' | 'expired';

interface UserMessage {
  id: string;
  sender: string;
  listing: string;
  message: string;
  date: string;
  read: boolean;
}

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('listings');
  const [statusFilter, setStatusFilter] = useState<ListingStatus | 'all'>('all');
  
  // Mock data
  const userListings = mockListings.slice(0, 3);
  const mockMessages: UserMessage[] = [
    {
      id: '1',
      sender: 'Jane Smith',
      listing: '2020 Tesla Model 3 Long Range',
      message: 'Hi, I\'m interested in your Tesla. Is it still available? I would like to schedule a test drive this weekend if possible.',
      date: '2023-09-20T14:30:00Z',
      read: false
    },
    {
      id: '2',
      sender: 'Robert Johnson',
      listing: '2020 Tesla Model 3 Long Range',
      message: 'Hello, does this car have a clean title? Any accidents or damage?',
      date: '2023-09-19T09:15:00Z',
      read: true
    },
    {
      id: '3',
      sender: 'Michael Brown',
      listing: '2019 BMW 5 Series 530i xDrive',
      message: 'What\'s the lowest price you\'d accept for this BMW? I\'m very interested but my budget is a bit tight.',
      date: '2023-09-18T17:45:00Z',
      read: true
    }
  ];
  const favoriteListings = mockListings.slice(3, 6);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
      return formatDate(dateString);
    }
  };
  
  const filteredListings = userListings.filter(listing => {
    if (statusFilter === 'all') return true;
    
    // For demo purposes, set the first listing as active, second as pending, third as sold
    if (listing.id === '1' && statusFilter === 'active') return true;
    if (listing.id === '2' && statusFilter === 'pending') return true;
    if (listing.id === '3' && statusFilter === 'sold') return true;
    
    return false;
  });
  
  const getListingStatus = (listingId: string): ListingStatus => {
    // For demo purposes
    if (listingId === '1') return 'active';
    if (listingId === '2') return 'pending';
    if (listingId === '3') return 'sold';
    return 'active';
  };
  
  const getStatusBadge = (status: ListingStatus) => {
    switch (status) {
      case 'active':
        return <span className="bg-success-100 text-success-800 text-xs font-medium px-2.5 py-0.5 rounded">Active</span>;
      case 'pending':
        return <span className="bg-warning-100 text-warning-800 text-xs font-medium px-2.5 py-0.5 rounded">Pending</span>;
      case 'sold':
        return <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded">Sold</span>;
      case 'expired':
        return <span className="bg-secondary-100 text-secondary-800 text-xs font-medium px-2.5 py-0.5 rounded">Expired</span>;
      default:
        return null;
    }
  };

  return (
    <div className="pt-20 pb-16 bg-secondary-50 min-h-screen">
      <div className="container-custom">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary-900 mb-2">Dashboard</h1>
              <p className="text-secondary-600">
                Welcome back, {user?.name || 'User'}!
              </p>
            </div>
            
            <div className="flex items-center mt-4 md:mt-0">
              <Link to="/sell" className="btn btn-primary flex items-center">
                <PlusCircle size={18} className="mr-2" />
                List a Car
              </Link>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-800">Active Listings</h3>
              <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                <LineChart size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-primary-900">1</p>
            <p className="text-sm text-secondary-500 mt-1">+0% from last month</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-800">Page Views</h3>
              <div className="p-2 bg-success-100 text-success-600 rounded-lg">
                <Eye size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-primary-900">243</p>
            <p className="text-sm text-success-600 mt-1">+12% from last month</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-800">Saved Cars</h3>
              <div className="p-2 bg-warning-100 text-warning-600 rounded-lg">
                <Heart size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-primary-900">3</p>
            <p className="text-sm text-secondary-500 mt-1">+0% from last month</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-800">Messages</h3>
              <div className="p-2 bg-accent-100 text-accent-600 rounded-lg">
                <MessageCircle size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-primary-900">3</p>
            <p className="text-sm text-accent-600 mt-1">+3 new messages</p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="border-b border-secondary-200">
            <nav className="flex -mb-px">
              <button 
                className={cn(
                  "py-4 px-6 font-medium text-sm border-b-2 whitespace-nowrap",
                  activeTab === 'listings' 
                    ? "border-primary-600 text-primary-600" 
                    : "border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300"
                )}
                onClick={() => setActiveTab('listings')}
              >
                My Listings
              </button>
              <button 
                className={cn(
                  "py-4 px-6 font-medium text-sm border-b-2 whitespace-nowrap",
                  activeTab === 'messages' 
                    ? "border-primary-600 text-primary-600" 
                    : "border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300"
                )}
                onClick={() => setActiveTab('messages')}
              >
                Messages
                <span className="ml-2 bg-accent-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  1
                </span>
              </button>
              <button 
                className={cn(
                  "py-4 px-6 font-medium text-sm border-b-2 whitespace-nowrap",
                  activeTab === 'favorites' 
                    ? "border-primary-600 text-primary-600" 
                    : "border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300"
                )}
                onClick={() => setActiveTab('favorites')}
              >
                Saved Cars
              </button>
              <button 
                className={cn(
                  "py-4 px-6 font-medium text-sm border-b-2 whitespace-nowrap",
                  activeTab === 'account' 
                    ? "border-primary-600 text-primary-600" 
                    : "border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300"
                )}
                onClick={() => setActiveTab('account')}
              >
                Account
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {/* My Listings Tab */}
            {activeTab === 'listings' && (
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-primary-900 mb-2 sm:mb-0">
                    My Listings
                  </h2>
                  
                  <div className="flex space-x-2">
                    <select
                      className="input py-1 text-sm"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as ListingStatus | 'all')}
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="sold">Sold</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>
                
                {filteredListings.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle size={48} className="text-secondary-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-secondary-900 mb-1">No listings found</h3>
                    <p className="text-secondary-500 mb-4">You don't have any listings matching the selected filter.</p>
                    <Link to="/sell" className="btn btn-primary">
                      List a Car
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-secondary-200">
                      <thead className="bg-secondary-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            Listing
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            Views
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            Date Listed
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-secondary-200">
                        {filteredListings.map((listing) => (
                          <tr key={listing.id} className="hover:bg-secondary-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-16 bg-secondary-200 rounded overflow-hidden flex-shrink-0">
                                  <img
                                    src={listing.images[0]}
                                    alt={listing.title}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-secondary-900">
                                    {listing.title}
                                  </div>
                                  <div className="text-xs text-secondary-500">
                                    {listing.year} • {listing.mileage.toLocaleString()} miles
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-secondary-900">
                                {formatPrice(listing.price)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-secondary-900">
                                {/* Random view count for demo */}
                                {Math.floor(Math.random() * 200) + 50}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(getListingStatus(listing.id))}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-secondary-500">
                                {formatDate(listing.createdAt)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <Link
                                  to={`/listing/${listing.id}`}
                                  className="text-primary-600 hover:text-primary-900 p-1"
                                  title="View"
                                >
                                  <Eye size={18} />
                                </Link>
                                <button
                                  className="text-secondary-600 hover:text-secondary-900 p-1"
                                  title="Edit"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  className="text-error-600 hover:text-error-900 p-1"
                                  title="Delete"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div>
                <h2 className="text-xl font-semibold text-primary-900 mb-6">
                  Messages
                </h2>
                
                {mockMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle size={48} className="text-secondary-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-secondary-900 mb-1">No messages yet</h3>
                    <p className="text-secondary-500">
                      When potential buyers message you about your listings, they'll appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mockMessages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "border rounded-lg p-4 transition-colors",
                          message.read ? "border-secondary-200" : "border-primary-200 bg-primary-50"
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-secondary-200 rounded-full flex items-center justify-center text-secondary-600 font-medium mr-3">
                              {message.sender.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-medium text-secondary-900">
                                {message.sender}
                                {!message.read && (
                                  <span className="ml-2 bg-accent-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    New
                                  </span>
                                )}
                              </h3>
                              <p className="text-xs text-secondary-500">
                                About: {message.listing}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-secondary-500">
                            {getTimeAgo(message.date)}
                          </p>
                        </div>
                        <p className="text-secondary-700 mb-3">
                          {message.message}
                        </p>
                        <div className="flex justify-end space-x-2">
                          <button className="btn btn-outline py-1 px-3 text-sm">
                            Mark as {message.read ? 'unread' : 'read'}
                          </button>
                          <button className="btn btn-primary py-1 px-3 text-sm">
                            Reply
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div>
                <h2 className="text-xl font-semibold text-primary-900 mb-6">
                  Saved Cars
                </h2>
                
                {favoriteListings.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart size={48} className="text-secondary-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-secondary-900 mb-1">No saved cars</h3>
                    <p className="text-secondary-500 mb-4">
                      When you save cars you're interested in, they'll appear here for easy access.
                    </p>
                    <Link to="/explore" className="btn btn-primary">
                      Browse Cars
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteListings.map((listing) => (
                      <div key={listing.id} className="bg-white border border-secondary-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative h-48">
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                          />
                          <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md">
                            <Heart size={16} className="text-accent-500 fill-accent-500" />
                          </button>
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                            {listing.title}
                          </h3>
                          <p className="text-xl font-bold text-primary-800 mb-2">
                            {formatPrice(listing.price)}
                          </p>
                          <div className="flex items-center text-secondary-500 text-sm mb-4">
                            <span>{listing.year}</span>
                            <span className="mx-2">•</span>
                            <span>{listing.mileage.toLocaleString()} miles</span>
                            <span className="mx-2">•</span>
                            <span>{listing.location}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Link to={`/listing/${listing.id}`} className="btn btn-primary py-1 flex-1 text-center">
                              View Details
                            </Link>
                            <button className="btn btn-outline py-1 px-3">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Account Tab */}
            {activeTab === 'account' && (
              <div>
                <h2 className="text-xl font-semibold text-primary-900 mb-6">
                  Account Settings
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <div className="bg-white border border-secondary-200 rounded-lg p-6 shadow-sm">
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
                          <User size={40} />
                        </div>
                        <h3 className="text-lg font-semibold text-secondary-900">
                          {user?.name || 'User'}
                        </h3>
                        <p className="text-secondary-500 mb-4">
                          {user?.email || 'user@example.com'}
                        </p>
                        <button className="btn btn-outline w-full mb-2">
                          Edit Profile
                        </button>
                        <button 
                          className="btn btn-outline text-error-600 border-error-200 hover:bg-error-50 w-full"
                          onClick={logout}
                        >
                          <LogOut size={16} className="mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="bg-white border border-secondary-200 rounded-lg overflow-hidden shadow-sm mb-6">
                      <div className="p-6 border-b border-secondary-200 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-secondary-900">
                          Personal Information
                        </h3>
                        <button className="text-primary-600 hover:text-primary-800 font-medium text-sm">
                          Edit
                        </button>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm text-secondary-500 mb-1">Full Name</p>
                            <p className="font-medium">{user?.name || 'Demo User'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-secondary-500 mb-1">Email Address</p>
                            <p className="font-medium">{user?.email || 'user@example.com'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-secondary-500 mb-1">Phone Number</p>
                            <p className="font-medium">+1 (555) 123-4567</p>
                          </div>
                          <div>
                            <p className="text-sm text-secondary-500 mb-1">Location</p>
                            <p className="font-medium">San Francisco, CA</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-secondary-200 rounded-lg overflow-hidden shadow-sm mb-6">
                      <div className="p-6 border-b border-secondary-200 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-secondary-900">
                          Password & Security
                        </h3>
                        <button className="text-primary-600 hover:text-primary-800 font-medium text-sm">
                          Change Password
                        </button>
                      </div>
                      <div className="p-6">
                        <p className="text-secondary-500 mb-4">
                          Last password change: <span className="font-medium">Never</span>
                        </p>
                        <p className="text-secondary-500">
                          We recommend changing your password regularly for increased security.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-secondary-200 rounded-lg overflow-hidden shadow-sm">
                      <div className="p-6 border-b border-secondary-200 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-secondary-900">
                          Notification Settings
                        </h3>
                        <button className="text-primary-600 hover:text-primary-800 font-medium text-sm">
                          Edit
                        </button>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-secondary-900">New Messages</p>
                              <p className="text-sm text-secondary-500">
                                Get notified when you receive new messages from potential buyers.
                              </p>
                            </div>
                            <div className="relative inline-block w-12 h-6 rounded-full bg-success-500">
                              <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm"></span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-secondary-900">Listing Activity</p>
                              <p className="text-sm text-secondary-500">
                                Get notified about views, favorites, and offers on your listings.
                              </p>
                            </div>
                            <div className="relative inline-block w-12 h-6 rounded-full bg-success-500">
                              <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm"></span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-secondary-900">Marketing Emails</p>
                              <p className="text-sm text-secondary-500">
                                Receive promotional offers, updates, and newsletters.
                              </p>
                            </div>
                            <div className="relative inline-block w-12 h-6 rounded-full bg-secondary-300">
                              <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;