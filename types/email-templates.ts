import type { Booking } from '@/lib/supabase';

export type EmailTemplateType =
  | 'AWAITING_DEPOSIT'
  | 'CONFIRMED'
  | 'PENDING_UPDATE'
  | 'DECLINED'
  | 'CANCELLED'
  | 'CUSTOM';

export interface EmailTemplateData {
  booking: Booking;
  courseAmount?: string;
  travelFee?: string;
  extraChefFee?: string;
  depositAmount?: string;
  totalAmount?: string;
  remainingAmount?: string;
  refundAmount?: string;
  reservationTime?: string;
  reservationDate?: string;
  reason?: string; // PENDING_UPDATE용: 변경 사유
  changeProposal?: string; // PENDING_UPDATE용: 변경 제안
  declineReason?: string; // DECLINED용: 거절 사유
}

export interface EmailTemplate {
  subject: string;
  content: string;
}
