interface CancelledEditCardProps {
  refundAmount: string;
  onRefundAmountChange: (value: string) => void;
  cancellationType: 'admin' | 'customer' | 'customer_no_deposit';
  onCancellationTypeChange: (
    value: 'admin' | 'customer' | 'customer_no_deposit'
  ) => void;
}

export default function CancelledEditCard({
  refundAmount,
  onRefundAmountChange,
  cancellationType,
  onCancellationTypeChange,
}: CancelledEditCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">메일 수정</h2>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">취소 정보</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            취소 주체
          </label>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onCancellationTypeChange('admin')}
                className={`flex-1 px-4 py-2 rounded-md text-sm border transition-colors ${
                  cancellationType === 'admin'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                관리자 취소
              </button>
              <button
                type="button"
                onClick={() => onCancellationTypeChange('customer')}
                className={`flex-1 px-4 py-2 rounded-md text-sm border transition-colors ${
                  cancellationType === 'customer'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                고객 취소 (입금 후)
              </button>
            </div>
            <button
              type="button"
              onClick={() => onCancellationTypeChange('customer_no_deposit')}
              className={`w-full px-4 py-2 rounded-md text-sm border transition-colors ${
                cancellationType === 'customer_no_deposit'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              고객 취소 (입금 전)
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            취소 주체에 따라 메일 내용이 달라집니다.
          </p>
        </div>

        {cancellationType !== 'customer_no_deposit' && (
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
        )}
        {cancellationType === 'customer_no_deposit' && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              입금 전 취소이므로 환불 금액이 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
