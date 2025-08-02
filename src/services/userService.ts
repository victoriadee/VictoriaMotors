import connectToDatabase, { isDatabaseAvailable } from '../config/database';
import User, { IUser } from '../models/User';

// Dynamic import for bcrypt to avoid browser issues
let bcrypt: any = null;
if (typeof window === 'undefined') {
  try {
    bcrypt = require('bcryptjs');
  } catch (error) {
    console.warn('bcryptjs not available, using mock hashing');
  }
}

// Mock hash function for browser environment
const mockHash = async (password: string): Promise<string> => {
  return `mock_hash_${password}`;
};

const mockCompare = async (password: string, hash: string): Promise<boolean> => {
  return hash === `mock_hash_${password}`;
};

// Mock users for demo mode
const mockUsers: any[] = [
  {
    _id: 'demo_user_1',
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'mock_hash_password',
    userType: 'private',
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

export class UserService {
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    location?: string;
    userType?: 'private' | 'dealer';
  }): Promise<IUser> {
    if (!isDatabaseAvailable) {
      // Demo mode - simulate user creation
      const hashFunction = bcrypt ? bcrypt.hash : mockHash;
      const hashedPassword = await hashFunction(userData.password, 12);
      const newUser = {
        _id: `demo_user_${Date.now()}`,
        ...userData,
        password: hashedPassword,
        userType: userData.userType || 'private',
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUsers.push(newUser);
      
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword as IUser;
    }

    await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    
    const user = new User({
      ...userData,
      password: hashedPassword,
    });
    
    await user.save();
    
    // Return user without password
    const userObject = user.toObject();
    delete userObject.password;
    
    return userObject;
  }

  async authenticateUser(email: string, password: string): Promise<IUser | null> {
    if (!isDatabaseAvailable) {
      // Demo mode - check mock users
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) return null;
      
      const compareFunction = bcrypt ? bcrypt.compare : mockCompare;
      const isPasswordValid = await compareFunction(password, user.password);
      if (!isPasswordValid) return null;
      
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as IUser;
    }

    await connectToDatabase();
    
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return null;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    
    // Return user without password
    const userObject = user.toObject();
    delete userObject.password;
    
    return userObject;
  }

  async getUserById(id: string): Promise<IUser | null> {
    if (!isDatabaseAvailable) {
      const user = mockUsers.find(u => u._id === id);
      if (!user) return null;
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as IUser;
    }

    await connectToDatabase();
    
    const user = await User.findById(id).select('-password').lean();
    return user;
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    if (!isDatabaseAvailable) {
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) return null;
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as IUser;
    }

    await connectToDatabase();
    
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('-password')
      .lean();
    
    return user;
  }

  async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    if (!isDatabaseAvailable) {
      const userIndex = mockUsers.findIndex(u => u._id === id);
      if (userIndex === -1) return null;
      
      const { password, ...safeUpdateData } = updateData;
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...safeUpdateData, updatedAt: new Date() };
      
      const { password: _, ...userWithoutPassword } = mockUsers[userIndex];
      return userWithoutPassword as IUser;
    }

    await connectToDatabase();
    
    // Remove password from update data if present
    const { password, ...safeUpdateData } = updateData;
    
    const user = await User.findByIdAndUpdate(
      id,
      { ...safeUpdateData, updatedAt: new Date() },
      { new: true }
    ).select('-password').lean();
    
    return user;
  }

  async updatePassword(id: string, newPassword: string): Promise<boolean> {
    if (!isDatabaseAvailable) {
      const userIndex = mockUsers.findIndex(u => u._id === id);
      if (userIndex === -1) return false;
      
      const hashFunction = bcrypt ? bcrypt.hash : mockHash;
      const hashedPassword = await hashFunction(newPassword, 12);
      mockUsers[userIndex].password = hashedPassword;
      mockUsers[userIndex].updatedAt = new Date();
      return true;
    }

    await connectToDatabase();
    
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    const result = await User.findByIdAndUpdate(id, {
      password: hashedPassword,
      updatedAt: new Date(),
    });
    
    return !!result;
  }

  async deleteUser(id: string): Promise<boolean> {
    if (!isDatabaseAvailable) {
      const userIndex = mockUsers.findIndex(u => u._id === id);
      if (userIndex === -1) return false;
      mockUsers.splice(userIndex, 1);
      return true;
    }

    await connectToDatabase();
    
    const result = await User.findByIdAndDelete(id);
    return !!result;
  }
}

export const userService = new UserService();