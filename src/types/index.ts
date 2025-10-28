import { Database } from './supabase';

// Base types from Database
export type Tables = Database['public']['Tables'];
export type DBClient = Tables['clients']['Row'];
export type DBItem = Tables['items']['Row'];
export type DBTransaction = Tables['transactions']['Row'];
export type DBPayment = Tables['payments']['Row'];

// Entity Interfaces
export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  id_number?: string;
  id_type?: string;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  estimated_value: number;
  client_id: string;
  status: 'stored' | 'returned' | 'sold';
  condition?: string;
  category?: string;
  images?: string[];
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  client_id: string;
  item_id: string;
  loan_amount: number;
  interest_rate: number;
  status: 'active' | 'completed' | 'defaulted';
  start_date: string;
  due_date: string;
  loan_duration?: number; // in days
  total_amount_due?: number;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  transaction_id: string;
  amount: number;
  payment_type?: 'interest' | 'principal' | 'full';
  payment_method: 'cash' | 'transfer' | 'mobile_money';
  status: 'completed' | 'pending' | 'failed';
  payment_date: string;
  created_at: string;
  updated_at: string;
}

// Response types with relationships
export interface ClientWithRelations extends Client {
  items?: Item[];
  transactions?: Transaction[];
}

export interface ItemWithRelations extends Item {
  client?: Client;
  transactions?: Transaction[];
}

export interface TransactionWithRelations extends Transaction {
  client?: Client;
  item?: Item;
  payments?: Payment[];
}

export interface PaymentWithRelations extends Payment {
  transaction?: TransactionWithRelations;
}

// Service response types
export type ClientsResponse = ClientWithRelations[];
export type ItemsResponse = ItemWithRelations[];
export type TransactionsResponse = TransactionWithRelations[];
export type PaymentsResponse = PaymentWithRelations[];

// Create/Update types
export type CreateClient = Omit<Client, 'id' | 'created_at' | 'updated_at'>;
export type UpdateClient = Partial<CreateClient>;

export type CreateItem = Omit<Item, 'id' | 'created_at' | 'updated_at'>;
export type UpdateItem = Partial<CreateItem>;

export type CreateTransaction = Omit<Transaction, 'id' | 'created_at' | 'updated_at'>;
export type UpdateTransaction = Partial<CreateTransaction>;

export type CreatePayment = Omit<Payment, 'id' | 'created_at' | 'updated_at'>;
export type UpdatePayment = Partial<CreatePayment>;