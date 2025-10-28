import { supabase } from './supabase';

const TABLE_TRANSACTIONS = import.meta.env.VITE_TABLE_TRANSACTIONS ?? 'transactions';
const TABLE_ITEMS = import.meta.env.VITE_TABLE_ITEMS ?? 'items';
const TABLE_CLIENTS = import.meta.env.VITE_TABLE_CLIENTS ?? 'clients';

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
      .from(TABLE_TRANSACTIONS)
      .select(`
        *,
        ${TABLE_ITEMS} (name, estimated_value),
        ${TABLE_CLIENTS} (first_name, last_name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from(TABLE_TRANSACTIONS)
      .select(`
        *,
        ${TABLE_ITEMS} (name, estimated_value),
        ${TABLE_CLIENTS} (first_name, last_name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getByClientId(clientId: string) {
    const { data, error } = await supabase
      .from(TABLE_TRANSACTIONS)
      .select(`
        *,
        ${TABLE_ITEMS} (name, estimated_value)
      `)
      .eq('client_id', clientId);

    if (error) throw error;
    return data;
  },

  async create(transaction: Omit<Transaction, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from(TABLE_TRANSACTIONS)
      .insert([transaction])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, transaction: Partial<Transaction>) {
    const { data, error } = await supabase
      .from(TABLE_TRANSACTIONS)
      .update(transaction)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from(TABLE_TRANSACTIONS)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};