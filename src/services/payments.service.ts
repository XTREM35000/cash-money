import { supabase } from './supabase';

export interface Payment {
  id: string;
  created_at: string;
  transaction_id: string;
  amount: number;
  payment_type: 'interest' | 'principal' | 'full';
  payment_method: 'cash' | 'card' | 'transfer';
  status: 'completed' | 'pending' | 'failed';
}

export const paymentsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        transactions (
          loan_amount,
          clients (first_name, last_name)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        transactions (
          loan_amount,
          clients (first_name, last_name)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getByTransactionId(transactionId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('transaction_id', transactionId);

    if (error) throw error;
    return data;
  },

  async create(payment: Omit<Payment, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('payments')
      .insert([payment])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, payment: Partial<Payment>) {
    const { data, error } = await supabase
      .from('payments')
      .update(payment)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};