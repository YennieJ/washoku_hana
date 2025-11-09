interface PendingUpdateEditCardProps {
  reason: string;
  changeProposal: string;
  onReasonChange: (value: string) => void;
  onChangeProposalChange: (value: string) => void;
}

export default function PendingUpdateEditCard({
  reason,
  changeProposal,
  onReasonChange,
  onChangeProposalChange,
}: PendingUpdateEditCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex-1 overflow-y-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">메일 수정</h2>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">변경 정보</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            변경 사유
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="예: 셰프 일정 / 이동 거리 / 준비 시간 등"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            변경 제안
          </label>
          <textarea
            value={changeProposal}
            onChange={(e) => onChangeProposalChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            rows={3}
            placeholder="예: 시간 7:30pm으로 조정 / 날짜를 12월 21일로 변경 / 인원 10명으로 조정 등"
          />
        </div>
      </div>
    </div>
  );
}
