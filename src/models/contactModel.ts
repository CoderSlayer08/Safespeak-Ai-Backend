import { createUserScopedClient } from '../config/supabase';

export interface Contact {
  id?: string;
  user_id: string;
  name: string;
  phone: string;
  email: string;
}

export const contactModel = {
  async getByUser(accessToken: string, user_id: string): Promise<Contact[]> {
    const { data, error } = await createUserScopedClient(accessToken)
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', user_id);
    if (error) throw new Error(error.message);
    return data || [];
  },
  
  async create(accessToken: string, contact: Contact): Promise<Contact> {
    const { data, error } = await createUserScopedClient(accessToken)
      .from('emergency_contacts')
      .insert([contact])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async delete(accessToken: string, id: string, user_id: string): Promise<boolean> {
    const { data, error } = await createUserScopedClient(accessToken)
      .from('emergency_contacts')
      .delete()
      .eq('id', id)
      .eq('user_id', user_id)
      .select('id');
    if (error) throw new Error(error.message);
    return (data?.length || 0) > 0;
  }
};
