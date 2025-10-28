import { supabase } from './supabase';
import type { Payment, PaymentsResponse } from '@/types';

const TABLE_PAYMENTS = 'payments';

export const paymentsService = {
  async getAll(): Promise<PaymentsResponse> {
    const { data, error } = await supabase
      .from(TABLE_PAYMENTS)
      .select(`
        *,
        transactions (
          loan_amount,
          clients (
            first_name,
            last_name
          )
        )
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Payment> {
    const { data, error } = await supabase
      .from(TABLE_PAYMENTS)
      .select(`
        *,
        transactions (
          loan_amount,
          clients (
            first_name,
            last_name
          )
        )
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    if (!data) throw new Error('Payment not found');
    return data;
  },

  async getByTransactionId(transactionId: string): Promise<PaymentsResponse> {
    const { data, error } = await supabase
      .from(TABLE_PAYMENTS)
      .select('*')
      .eq('transaction_id', transactionId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(payment: Omit<Payment, 'id' | 'created_at'>): Promise<Payment> {
    const { data, error } = await supabase
      .from(TABLE_PAYMENTS)
      .insert([payment])
      .select()
      .single();
    if (error) throw error;
    if (!data) throw new Error('Failed to create payment');
    return data;
  },

  async update(id: string, payment: Partial<Payment>): Promise<Payment> {
    const { data, error } = await supabase
      .from(TABLE_PAYMENTS)
      .update(payment)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    if (!data) throw new Error('Failed to update payment');
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE_PAYMENTS)
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};