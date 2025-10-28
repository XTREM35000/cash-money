import { supabase } from './supabase';
import type { Transaction, TransactionsResponse } from '@/types';

const TABLE_TRANSACTIONS = 'transactions';

export const transactionsService = {
  async getAll(): Promise<TransactionsResponse> {
    const { data, error } = await supabase
      .from(TABLE_TRANSACTIONS)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Transaction> {
    const { data, error } = await supabase
      .from(TABLE_TRANSACTIONS)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    if (!data) throw new Error('Transaction not found');
    return data;
  },

  async getByClientId(clientId: string): Promise<TransactionsResponse> {
    const { data, error } = await supabase
      .from(TABLE_TRANSACTIONS)
      .select('*')
      .eq('client_id', clientId);
    if (error) throw error;
    return data || [];
  },

  async create(transaction: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction> {
    const { data, error } = await supabase
      .from(TABLE_TRANSACTIONS)
      .insert([transaction])
      .select()
      .single();
    if (error) throw error;
    if (!data) throw new Error('Failed to create transaction');
    return data;
  },

  async update(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
    const { data, error } = await supabase
      .from(TABLE_TRANSACTIONS)
      .update(transaction)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    if (!data) throw new Error('Failed to update transaction');
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE_TRANSACTIONS)
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};