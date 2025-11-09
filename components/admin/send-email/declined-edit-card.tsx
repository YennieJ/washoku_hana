interface DeclinedEditCardProps {
  declineReason: string;
  onDeclineReasonChange: (value: string) => void;
}

export default function DeclinedEditCard({
  declineReason,
  onDeclineReasonChange,
}: DeclinedEditCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex-1 overflow-y-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">메일 수정</h2>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">거절 사유</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            거절 이유
          </label>
          <textarea
            value={declineReason}
            onChange={(e) => onDeclineReasonChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            rows={3}
            placeholder="예: 일정상 불가능 / 이동 거리 문제 / 준비 시간 부족 등"
          />
        </div>
      </div>
    </div>
  );
}
