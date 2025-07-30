import connectToDatabase from '../config/database';
import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';

export class UserService {
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    location?: string;
    userType?: 'private' | 'dealer';
  }): Promise<IUser> {
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
    await connectToDatabase();
    
    const user = await User.findById(id).select('-password').lean();
    return user;
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    await connectToDatabase();
    
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('-password')
      .lean();
    
    return user;
  }

  async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
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
    await connectToDatabase();
    
    const result = await User.findByIdAndDelete(id);
    return !!result;
  }
}

export const userService = new UserService();