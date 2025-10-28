import { supabase } from './supabase';

const TABLE_CLIENTS = import.meta.env.VITE_TABLE_CLIENTS ?? 'clients';

export interface Client {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  id_number: string;
  id_type: string;
}

export const clientsService = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLE_CLIENTS)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from(TABLE_CLIENTS)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(client: Omit<Client, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from(TABLE_CLIENTS)
      .insert([client])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, client: Partial<Client>) {
    const { data, error } = await supabase
      .from(TABLE_CLIENTS)
      .update(client)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from(TABLE_CLIENTS)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};