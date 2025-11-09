interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
}

export default function SearchInput({
  searchQuery,
  setSearchQuery,
}: SearchInputProps) {
  return (
    <div className="w-full md:w-auto">
      <input
        type="text"
        placeholder="고객명, 예약번호, 이메일 검색 (기간 내 검색)"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full md:w-80 px-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
      />
    </div>
  );
}
