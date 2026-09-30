import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/userModel';

export const authService = {
  async register(name: string, email: string, password: string) {
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      name,
      email,
      password_hash
    });

    const token = jwt.sign(
      { sub: newUser.id, userId: newUser.id, email: newUser.email, role: 'authenticated' },
      getSigningSecret(),
      { expiresIn: '30d' }
    );

    return {
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
      token
    };
  },

  async login(email: string, password: string) {
    const user = await userModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { sub: user.id, userId: user.id, email: user.email, role: 'authenticated' },
      getSigningSecret(),
      { expiresIn: '30d' }
    );

    return {
      user: { id: user.id, name: user.name, email: user.email },
      token
    };
  }
};

function getSigningSecret(): string {
  const secret = process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT secret is not configured');
  return secret;
}
