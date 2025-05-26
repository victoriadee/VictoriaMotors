import { CarListing } from '../types';

export const mockListings: CarListing[] = [
  {
    id: '1',
    title: '2020 Tesla Model 3 Long Range',
    price: 41999,
    year: 2020,
    make: 'Tesla',
    model: 'Model 3',
    mileage: 28500,
    fuelType: 'electric',
    transmission: 'automatic',
    exteriorColor: 'White',
    interiorColor: 'Black',
    bodyType: 'sedan',
    description: 'This Tesla Model 3 Long Range is in excellent condition with low mileage. Features include Autopilot, premium sound system, and glass roof. Full service history available.',
    features: ['Autopilot', 'Premium Sound', 'Glass Roof', 'Heated Seats', 'Navigation'],
    images: [
      'https://images.pexels.com/photos/13467341/pexels-photo-13467341.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/12318571/pexels-photo-12318571.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/12318564/pexels-photo-12318564.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    location: 'San Francisco, CA',
    sellerId: 'user1',
    sellerName: 'Modern Motors',
    sellerType: 'dealer',
    createdAt: '2023-09-15T14:30:00Z',
    updatedAt: '2023-09-15T14:30:00Z'
  },
  {
    id: '2',
    title: '2019 BMW 5 Series 530i xDrive',
    price: 35800,
    year: 2019,
    make: 'BMW',
    model: '5 Series',
    mileage: 42000,
    fuelType: 'gasoline',
    transmission: 'automatic',
    exteriorColor: 'Black Sapphire',
    interiorColor: 'Cognac',
    bodyType: 'sedan',
    description: 'Immaculate BMW 5 Series with xDrive all-wheel drive. Loaded with premium features including heated leather seats, premium sound system, and advanced driver assistance package.',
    features: ['All-Wheel Drive', 'Leather Seats', 'Premium Sound', 'Navigation', 'Parking Sensors'],
    images: [
      'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/248687/pexels-photo-248687.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    location: 'Los Angeles, CA',
    sellerId: 'user2',
    sellerName: 'Executive Auto Group',
    sellerType: 'dealer',
    createdAt: '2023-09-10T11:15:00Z',
    updatedAt: '2023-09-12T09:30:00Z'
  },
  {
    id: '3',
    title: '2021 Jeep Wrangler Unlimited Rubicon',
    price: 49995,
    year: 2021,
    make: 'Jeep',
    model: 'Wrangler',
    mileage: 18750,
    fuelType: 'gasoline',
    transmission: 'automatic',
    exteriorColor: 'Firecracker Red',
    interiorColor: 'Black',
    bodyType: 'suv',
    description: 'Barely used Jeep Wrangler Unlimited Rubicon with premium off-road features. Includes hardtop, upgraded wheels, and technology package. Ready for adventure!',
    features: ['4x4', 'Removable Top', 'Navigation', 'Off-Road Package', 'Bluetooth'],
    images: [
      'https://images.pexels.com/photos/12041678/pexels-photo-12041678.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/2882234/pexels-photo-2882234.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/2882240/pexels-photo-2882240.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    location: 'Denver, CO',
    sellerId: 'user3',
    sellerName: 'John Smith',
    sellerType: 'private',
    createdAt: '2023-09-05T16:45:00Z',
    updatedAt: '2023-09-05T16:45:00Z'
  },
  {
    id: '4',
    title: '2018 Honda Accord EX-L',
    price: 25495,
    year: 2018,
    make: 'Honda',
    model: 'Accord',
    mileage: 45200,
    fuelType: 'gasoline',
    transmission: 'cvt',
    exteriorColor: 'Modern Steel',
    interiorColor: 'Black',
    bodyType: 'sedan',
    description: 'Well-maintained Honda Accord EX-L with leather interior and low mileage. Excellent fuel economy and reliability. Includes Honda Sensing safety features.',
    features: ['Leather Seats', 'Sunroof', 'Apple CarPlay', 'Backup Camera', 'Lane Assist'],
    images: [
      'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    location: 'Chicago, IL',
    sellerId: 'user4',
    sellerName: 'Sarah Johnson',
    sellerType: 'private',
    createdAt: '2023-08-28T13:20:00Z',
    updatedAt: '2023-08-30T09:15:00Z'
  },
  {
    id: '5',
    title: '2022 Ford F-150 Lariat SuperCrew',
    price: 55900,
    year: 2022,
    make: 'Ford',
    model: 'F-150',
    mileage: 12300,
    fuelType: 'gasoline',
    transmission: 'automatic',
    exteriorColor: 'Antimatter Blue',
    interiorColor: 'Medium Light Slate',
    bodyType: 'truck',
    description: 'Nearly new Ford F-150 Lariat with all the premium features. Includes 3.5L EcoBoost engine, leather seats, navigation, and towing package. Perfect for work or play.',
    features: ['Leather Seats', 'Navigation', 'Towing Package', 'Heated Seats', 'Apple CarPlay'],
    images: [
      'https://images.pexels.com/photos/2676097/pexels-photo-2676097.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    location: 'Dallas, TX',
    sellerId: 'user5',
    sellerName: 'Texas Trucks',
    sellerType: 'dealer',
    createdAt: '2023-09-18T10:00:00Z',
    updatedAt: '2023-09-18T10:00:00Z'
  },
  {
    id: '6',
    title: '2020 Audi Q5 Premium Plus',
    price: 39750,
    year: 2020,
    make: 'Audi',
    model: 'Q5',
    mileage: 31500,
    fuelType: 'gasoline',
    transmission: 'automatic',
    exteriorColor: 'Mythos Black',
    interiorColor: 'Rock Gray',
    bodyType: 'suv',
    description: 'Elegant Audi Q5 Premium Plus with Quattro all-wheel drive. Features include panoramic sunroof, virtual cockpit, and premium sound system. Clean history with regular maintenance.',
    features: ['Quattro AWD', 'Panoramic Sunroof', 'Virtual Cockpit', 'Premium Sound', 'Leather Seats'],
    images: [
      'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    location: 'Seattle, WA',
    sellerId: 'user6',
    sellerName: 'Luxury Auto Imports',
    sellerType: 'dealer',
    createdAt: '2023-09-01T15:30:00Z',
    updatedAt: '2023-09-03T12:45:00Z'
  }
];

export const carMakes = [
  'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Buick', 'Cadillac', 
  'Chevrolet', 'Chrysler', 'Dodge', 'Ferrari', 'Fiat', 'Ford', 'Genesis', 'GMC', 
  'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep', 'Kia', 'Lamborghini', 'Land Rover', 
  'Lexus', 'Lincoln', 'Maserati', 'Mazda', 'McLaren', 'Mercedes-Benz', 'MINI', 'Mitsubishi', 
  'Nissan', 'Porsche', 'Ram', 'Rolls-Royce', 'Subaru', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
];

export const popularBodyTypes = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'truck', label: 'Truck' },
  { value: 'coupe', label: 'Coupe' },
  { value: 'convertible', label: 'Convertible' },
  { value: 'wagon', label: 'Wagon' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'van', label: 'Van' },
  { value: 'minivan', label: 'Minivan' }
];

export const fuelTypes = [
  { value: 'gasoline', label: 'Gasoline' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'plugin_hybrid', label: 'Plug-in Hybrid' },
  { value: 'natural_gas', label: 'Natural Gas' },
  { value: 'other', label: 'Other' }
];

export const transmissionTypes = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' },
  { value: 'semi-automatic', label: 'Semi-Automatic' },
  { value: 'cvt', label: 'CVT' }
];