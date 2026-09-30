import { supabaseAdmin } from '../config/supabase';

export interface User {
  id?: string;
  name: string;
  email: string;
  password_hash: string;
  created_at?: string;
  updated_at?: string;
}

export const userModel = {
  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
      throw new Error(error.message);
    }
    return data;
  },

  async findById(id: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message);
    }
    return data;
  },

  async create(user: User): Promise<User> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([user])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
};
