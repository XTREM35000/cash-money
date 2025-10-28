import { supabase } from './supabase';

export interface Transaction {
  id: string;
  created_at: string;
  item_id: string;
  client_id: string;
  loan_amount: number;
  interest_rate: number;
  loan_duration: number; // in days
  due_date: string;
  status: 'active' | 'paid' | 'defaulted' | 'extended';
  total_amount_due: number;
}

export const transactionsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        items (name, estimated_value),
        clients (first_name, last_name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        items (name, estimated_value),
        clients (first_name, last_name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getByClientId(clientId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        items (name, estimated_value)
      `)
      .eq('client_id', clientId);

    if (error) throw error;
    return data;
  },

  async create(transaction: Omit<Transaction, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, transaction: Partial<Transaction>) {
    const { data, error } = await supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};