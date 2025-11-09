import type { ReservationStatus } from '@/constants/reservation-statuses';
import AwaitingDepositEditCard from './awaiting-deposit-edit-card';
import CancelledEditCard from './cancelled-edit-card';
import DeclinedEditCard from './declined-edit-card';
import PendingUpdateEditCard from './pending-update-edit-card';

export interface EditCardProps {
  // AWAITING_DEPOSIT
  reservationDate?: string;
  reservationTime?: string;
  courseAmount?: string;
  travelFee?: string;
  extraChefFee?: string;
  depositAmount?: string;
  totalAmount?: string;
  remainingAmount?: string;
  onReservationDateChange?: (value: string) => void;
  onReservationTimeChange?: (value: string) => void;
  onCourseAmountChange?: (value: string) => void;
  onTravelFeeChange?: (value: string) => void;
  onExtraChefFeeChange?: (value: string) => void;
  onDepositAmountChange?: (value: string) => void;
  formatTime?: (time: string) => string;

  // CANCELLED
  refundAmount?: string;
  onRefundAmountChange?: (value: string) => void;

  // PENDING_UPDATE
  reason?: string;
  changeProposal?: string;
  onReasonChange?: (value: string) => void;
  onChangeProposalChange?: (value: string) => void;

  // DECLINED
  declineReason?: string;
  onDeclineReasonChange?: (value: string) => void;
}

export function getEditCard(
  mailType: ReservationStatus | 'CUSTOM',
  props: EditCardProps
) {
  switch (mailType) {
    case 'AWAITING_DEPOSIT':
      if (
        props.reservationDate === undefined ||
        props.reservationTime === undefined ||
        props.courseAmount === undefined ||
        props.travelFee === undefined ||
        props.extraChefFee === undefined ||
        props.depositAmount === undefined ||
        props.totalAmount === undefined ||
        props.remainingAmount === undefined ||
        !props.onReservationDateChange ||
        !props.onReservationTimeChange ||
        !props.onCourseAmountChange ||
        !props.onTravelFeeChange ||
        !props.onExtraChefFeeChange ||
        !props.onDepositAmountChange ||
        !props.formatTime
      ) {
        return null;
      }
      return (
        <AwaitingDepositEditCard
          reservationDate={props.reservationDate}
          reservationTime={props.reservationTime}
          courseAmount={props.courseAmount}
          travelFee={props.travelFee}
          extraChefFee={props.extraChefFee}
          depositAmount={props.depositAmount}
          totalAmount={props.totalAmount}
          remainingAmount={props.remainingAmount}
          onReservationDateChange={props.onReservationDateChange}
          onReservationTimeChange={props.onReservationTimeChange}
          onCourseAmountChange={props.onCourseAmountChange}
          onTravelFeeChange={props.onTravelFeeChange}
          onExtraChefFeeChange={props.onExtraChefFeeChange}
          onDepositAmountChange={props.onDepositAmountChange}
          formatTime={props.formatTime}
        />
      );

    case 'CANCELLED':
      if (props.refundAmount === undefined || !props.onRefundAmountChange) {
        return null;
      }
      return (
        <CancelledEditCard
          refundAmount={props.refundAmount}
          onRefundAmountChange={props.onRefundAmountChange}
        />
      );

    case 'PENDING_UPDATE':
      if (
        props.reason === undefined ||
        props.changeProposal === undefined ||
        !props.onReasonChange ||
        !props.onChangeProposalChange
      ) {
        return null;
      }
      return (
        <PendingUpdateEditCard
          reason={props.reason}
          changeProposal={props.changeProposal}
          onReasonChange={props.onReasonChange}
          onChangeProposalChange={props.onChangeProposalChange}
        />
      );

    case 'DECLINED':
      if (props.declineReason === undefined || !props.onDeclineReasonChange) {
        return null;
      }
      return (
        <DeclinedEditCard
          declineReason={props.declineReason}
          onDeclineReasonChange={props.onDeclineReasonChange}
        />
      );

    default:
      return null;
  }
}
