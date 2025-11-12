import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { ReservationStatus } from '@/constants/reservation-statuses';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// 브라우저용 클라이언트 (클라이언트 컴포넌트에서 사용)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// 서버용 클라이언트 (API 라우트, 서버 컴포넌트에서 사용)
export function createSupabaseServerClient(cookieStore: any) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: Array<{ name: string; value: string; options?: any }>
      ) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        );
      },
    },
  });
}

// Service Role 클라이언트 (관리자 권한 - RLS 우회)
// 주의: 서버 측 API route에서만 사용해야 함!
export function createSupabaseAdminClient() {
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export type Booking = {
  id: string;
  booking_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  guest_count: number;
  menu: string;
  address: string;
  food_allergy: string;
  special_requests: string;
  travel_cost: number;
  deposit_amount: number;
  total_amount: number;
  status: ReservationStatus;
  is_read: boolean;
  admin_memo: string;
  created_at: string;
  updated_at: string;
  refund_amount: number;
  chef_additional_cost: number;
  calendar_event_id: string | null;
};
