import { supabase } from './supabase';

export interface Item {
  id: string;
  created_at: string;
  client_id: string;
  name: string;
  description: string;
  category: string;
  estimated_value: number;
  condition: string;
  status: 'in_pawn' | 'redeemed' | 'for_sale' | 'sold';
  images?: string[];
}

export const itemsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('items')
      .select('*, clients(first_name, last_name)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('items')
      .select('*, clients(first_name, last_name)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getByClientId(clientId: string) {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('client_id', clientId);

    if (error) throw error;
    return data;
  },

  async create(item: Omit<Item, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('items')
      .insert([item])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, item: Partial<Item>) {
    const { data, error } = await supabase
      .from('items')
      .update(item)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};