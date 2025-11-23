interface AwaitingDepositEditCardProps {
  reservationDate: string;
  reservationTime: string;
  courseAmount: string;
  travelFee: string;
  extraChefFee: string;
  depositAmount: string;
  totalAmount: string;
  remainingAmount: string;
  onReservationDateChange: (value: string) => void;
  onReservationTimeChange: (value: string) => void;
  onCourseAmountChange: (value: string) => void;
  onTravelFeeChange: (value: string) => void;
  onExtraChefFeeChange: (value: string) => void;
  onDepositAmountChange: (value: string) => void;
  formatTime: (time: string) => string;
}

export default function AwaitingDepositEditCard({
  reservationDate,
  reservationTime,
  courseAmount,
  travelFee,
  extraChefFee,
  depositAmount,
  totalAmount,
  remainingAmount,
  onReservationDateChange,
  onReservationTimeChange,
  onCourseAmountChange,
  onTravelFeeChange,
  onExtraChefFeeChange,
  onDepositAmountChange,
  formatTime,
}: AwaitingDepositEditCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">메일 수정</h2>
      <>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">예약 정보</h3>
        {/* 날짜 입력 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            예약 날짜
          </label>
          <input
            type="date"
            value={reservationDate}
            onChange={(e) => onReservationDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        {/* 시간 입력 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            예약 시간
          </label>
          <input
            type="time"
            value={reservationTime}
            onChange={(e) => onReservationTimeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>
      </>
      <hr className="border-gray-200 mb-4" />

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">금액 정보</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              오마카세 코스 ($)
            </label>
            <input
              type="number"
              value={courseAmount}
              onChange={(e) => onCourseAmountChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              출장비 ($)
            </label>
            <input
              type="number"
              value={travelFee}
              onChange={(e) => onTravelFeeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              추가 셰프비 ($)
            </label>
            <input
              type="number"
              value={extraChefFee}
              onChange={(e) => onExtraChefFeeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              디파짓 ($)
            </label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => onDepositAmountChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="0"
            />
          </div>
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">총합계:</span>
            <span className="font-semibold text-gray-900">${totalAmount}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-700">잔금:</span>
            <span className="font-semibold text-gray-900">
              ${remainingAmount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
