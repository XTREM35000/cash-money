export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          created_at: string
          first_name: string
          last_name: string
          email: string
          phone: string
          id_number?: string
          id_type?: string
          address?: string
        }
        Insert: Omit<Database["public"]["Tables"]["clients"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["clients"]["Row"]>
      }
      items: {
        Row: {
          id: string
          created_at: string
          client_id: string
          name: string
          description: string
          estimated_value: number
          status: 'stored' | 'returned' | 'sold'
          condition?: string
          category?: string
          images?: string[]
        }
        Insert: Omit<Database["public"]["Tables"]["items"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["items"]["Row"]>
      }
      transactions: {
        Row: {
          id: string
          created_at: string
          client_id: string
          item_id: string
          loan_amount: number
          interest_rate: number
          status: 'active' | 'completed' | 'defaulted'
          start_date: string
          due_date: string
        }
        Insert: Omit<Database["public"]["Tables"]["transactions"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["transactions"]["Row"]>
      }
      payments: {
        Row: {
          id: string
          created_at: string
          transaction_id: string
          amount: number
          payment_method: 'cash' | 'transfer' | 'mobile_money'
          status: 'completed' | 'pending' | 'failed'
          payment_date: string
        }
        Insert: Omit<Database["public"]["Tables"]["payments"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["payments"]["Row"]>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}