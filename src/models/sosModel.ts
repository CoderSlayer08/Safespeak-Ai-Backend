import { supabase } from '../config/supabase';

export interface SOSEvent {
  id?: string;
  user_id: string;
  incident_type: string;
  severity: string;
  people_involved: number | null;
  injury_reported: boolean;
  hazard_reported: boolean;
  ai_summary: string;
  recommended_action: string;
  latitude: number | null;
  longitude: number | null;
  location_accuracy: number | null;
  status?: string;
  created_at?: string;
}

export const sosModel = {
  async create(sosData: SOSEvent): Promise<SOSEvent> {
    const { data, error } = await supabase
      .from('sos_events')
      .insert([sosData])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async getByUser(user_id: string): Promise<SOSEvent[]> {
    const { data, error } = await supabase
      .from('sos_events')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return data || [];
  },
  
  async getById(id: string): Promise<SOSEvent> {
    const { data, error } = await supabase
      .from('sos_events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async updateStatus(id: string, status: string): Promise<SOSEvent> {
    const updateData: any = { status };
    if (status === 'RESOLVED') {
      updateData.resolved_at = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('sos_events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
};
