import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { ReservationStatus } from '@/constants/reservation-statuses';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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
