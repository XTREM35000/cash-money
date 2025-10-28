import { supabase } from './supabase';
import type { Item, ItemsResponse } from '@/types';

const TABLE_ITEMS = 'items';

export const itemsService = {
  async getAll(): Promise<ItemsResponse> {
    const { data, error } = await supabase
      .from(TABLE_ITEMS)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Item> {
    const { data, error } = await supabase
      .from(TABLE_ITEMS)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    if (!data) throw new Error('Item not found');
    return data;
  },

  async getByClientId(clientId: string): Promise<ItemsResponse> {
    const { data, error } = await supabase
      .from(TABLE_ITEMS)
      .select('*')
      .eq('client_id', clientId);
    if (error) throw error;
    return data || [];
  },

  async create(item: Omit<Item, 'id' | 'created_at'>): Promise<Item> {
    const { data, error } = await supabase
      .from(TABLE_ITEMS)
      .insert([item])
      .select()
      .single();
    if (error) throw error;
    if (!data) throw new Error('Failed to create item');
    return data;
  },

  async update(id: string, item: Partial<Item>): Promise<Item> {
    const { data, error } = await supabase
      .from(TABLE_ITEMS)
      .update(item)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    if (!data) throw new Error('Failed to update item');
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE_ITEMS)
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};