interface CancelledEditCardProps {
  refundAmount: string;
  onRefundAmountChange: (value: string) => void;
}

export default function CancelledEditCard({
  refundAmount,
  onRefundAmountChange,
}: CancelledEditCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">메일 수정</h2>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">환불 정보</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            환불 금액 ($)
          </label>
          <input
            type="number"
            value={refundAmount}
            onChange={(e) => onRefundAmountChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="0"
          />
          <p className="text-xs text-gray-500 mt-1">
            환불 정책에 따라 자동 계산되며, 직접 수정 가능합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
