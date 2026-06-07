import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          price: number;
          description: string;
          category: string;
          hero: string;
          skin_count: number;
          rank: string;
          server: string;
          status: 'ready' | 'sold';
          images: string[];
          benefits: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          product_id: string;
          customer_name: string;
          customer_whatsapp: string;
          notes: string;
          payment_method: string;
          payment_gateway: string;
          status: 'pending' | 'paid' | 'completed' | 'cancelled' | 'expired' | 'failed';
          total_amount: number;
          payment_url: string;
          order_id: string;
          created_at: string;
          updated_at: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          rating: number;
          comment: string;
          image_url: string;
          created_at: string;
        };
      };
      faqs: {
        Row: { id: string; question: string; answer: string; order: number; created_at: string };
      };
      banners: {
        Row: { id: string; title: string; image_url: string; link: string; active: boolean; created_at: string };
      };
      categories: {
        Row: { id: string; name: string; slug: string; description: string; price: number; features: string[]; created_at: string };
      };
      settings: {
        Row: { id: string; key: string; value: string; updated_at: string };
      };
      social_links: {
        Row: { id: string; platform: string; url: string; username: string };
      };
    };
  };
};
