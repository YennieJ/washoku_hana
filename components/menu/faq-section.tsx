'use client';

import { useState } from 'react';
import { faqItems } from '@/constants/faq-items';

export default function FAQSection() {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const toggleItem = (index: number) => {
    setOpenIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // 검색어가 있으면 필터링, 없으면 전체 항목
  const filteredItems = faqItems
    .map((faq, originalIndex) => ({ ...faq, originalIndex }))
    .filter((faq) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        faq.question.toLowerCase().includes(searchLower) ||
        faq.answer.toLowerCase().includes(searchLower)
      );
    });

  // 검색어가 있으면 모든 필터된 항목을 자동으로 열기
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value) {
      const indices = new Set(filteredItems.map((item) => item.originalIndex));
      setOpenIndices(indices);
    } else {
      setOpenIndices(new Set());
    }
  };

  return (
    <section className="relative py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* FAQ 제목과 검색 필드 */}
        <div className="flex items-center gap-10 mb-12">
          <h3 className="text-4xl lg:text-4xl font-light">FAQ</h3>
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full md:w-2/5 bg-white/5 border border-primary/20 px-6 py-3 text-white placeholder:text-gray-400 focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        <div className="mx-auto space-y-2">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No results found.</p>
            </div>
          ) : (
            filteredItems.map((faq) => {
              const originalIndex = faq.originalIndex;
              return (
                <div
                  key={originalIndex}
                  className="border-b border-primary/20 last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(originalIndex)}
                    className="w-full text-left px-6 py-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors group"
                  >
                    <h4
                      className={`text-lg lg:text-xl pr-4 font-medium transition-colors ${
                        openIndices.has(originalIndex)
                          ? 'text-primary'
                          : 'text-white'
                      }`}
                    >
                      {faq.question}
                    </h4>
                    <svg
                      className={`w-5 h-5 flex-shrink-0 transition-transform ${
                        openIndices.has(originalIndex)
                          ? 'rotate-180 text-primary'
                          : 'text-gray-400 group-hover:text-primary'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {openIndices.has(originalIndex) && (
                    <div className="px-6 pt-2 pb-6">
                      <p className="text-gray-400 text-base lg:text-lg leading-relaxed pl-0">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
