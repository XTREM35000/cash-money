import { supabase } from './supabase';
import type { Client, ClientsResponse } from '@/types';

const TABLE_CLIENTS = 'clients';

export const clientsService = {
  async getAll(): Promise<ClientsResponse> {
    const { data, error } = await supabase
      .from(TABLE_CLIENTS)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Client> {
    const { data, error } = await supabase
      .from(TABLE_CLIENTS)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    if (!data) throw new Error('Client not found');
    return data;
  },

  async create(client: Omit<Client, 'id' | 'created_at'>): Promise<Client> {
    const { data, error } = await supabase
      .from(TABLE_CLIENTS)
      .insert([client])
      .select()
      .single();
    if (error) throw error;
    if (!data) throw new Error('Failed to create client');
    return data;
  },

  async update(id: string, client: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
      .from(TABLE_CLIENTS)
      .update(client)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    if (!data) throw new Error('Failed to update client');
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE_CLIENTS)
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};