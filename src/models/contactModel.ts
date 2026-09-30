import { supabase } from '../config/supabase';

export interface Contact {
  id?: string;
  user_id: string;
  name: string;
  phone: string;
  email: string;
}

export const contactModel = {
  async getByUser(user_id: string): Promise<Contact[]> {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', user_id);
    if (error) throw new Error(error.message);
    return data || [];
  },
  
  async create(contact: Contact): Promise<Contact> {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .insert([contact])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('emergency_contacts')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  }
};
