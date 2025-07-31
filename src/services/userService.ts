import connectToDatabase, { isDatabaseAvailable } from '../config/database';
import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';

// Mock users for demo mode
const mockUsers: any[] = [
  {
    _id: 'demo_user_1',
    name: 'Demo User',
    email: 'demo@example.com',
    password: '$2a$12$LQv3c1yqBw2uuKyh/LIx/O1s.DoA.fhO.BqHPXnvTpeoTtjVa1emm', // 'password'
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
      const hashedPassword = await bcrypt.hash(userData.password, 12);
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
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
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
      
      const hashedPassword = await bcrypt.hash(newPassword, 12);
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