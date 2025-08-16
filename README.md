# VictoriaMotors - Car Marketplace Platform

## Features
A modern car marketplace platform built with React, TypeScript, and MongoDB Atlas.
- **Car Listings**: Browse and search through thousands of car listings
- **User Authentication**: Secure user registration and login
- **Subscription Plans**: Free and Premium plans with M-Pesa payment integration
- **Advanced Filtering**: Filter cars by make, model, price, year, and more
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **MongoDB Integration**: Scalable database with MongoDB Atlas
## Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: bcryptjs for password hashing
- **Payment**: M-Pesa integration for subscriptions
- **Icons**: Lucide React
- **Build Tool**: Vite
## Getting Started
### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- npm or yarn
### Installation
1. Clone the repository:
```bash
git clone <repository-url>
cd victoriamotors
```
2. Install dependencies:
```bash
npm install
```
3. Set up MongoDB Atlas:
   - Create a MongoDB Atlas account at https://www.mongodb.com/atlas
   - Create a new cluster
   - Get your connection string
   - Create a database user with read/write permissions
4. Configure environment variables:
   - Copy the `.env` file and update the MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/victoriamotors?retryWrites=true&w=majority
   DB_NAME=victoriamotors
   ```
5. Start the development server:
```bash
npm run dev
```
## Database Setup
The application will automatically create the necessary collections and indexes when you first run it. The main collections are:
- **users**: User accounts and profiles
- **carlistings**: Car listing data
- **subscriptions**: User subscription information
## MongoDB Atlas Configuration
1. **Create a Cluster**: 
   - Go to MongoDB Atlas and create a new cluster
   - Choose your preferred cloud provider and region
   - Select the free tier (M0) for development
2. **Database Access**:
   - Create a database user with read/write permissions
   - Note down the username and password
3. **Network Access**:
   - Add your IP address to the IP Access List
   - For development, you can use 0.0.0.0/0 (not recommended for production)
4. **Connect**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string and update your `.env` file
## Environment Variables
Create a `.env` file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
DB_NAME=victoriamotors
VITE_API_BASE_URL=http://localhost:5173/api
```
## Project Structure
```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts for state management
├── hooks/              # Custom React hooks
├── models/             # MongoDB/Mongoose models
├── pages/              # Page components
├── services/           # API services and business logic
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── config/             # Configuration files
```
## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
## License
This project is licensed under the MIT License.