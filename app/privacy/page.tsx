"use client"

import Navigation from "@/components/navigation"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-8">
          <h1 className="text-5xl font-light mb-16 text-center">개인정보보호정책</h1>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl text-yellow-400 mb-4">1. 개인정보 수집 목적</h2>
              <p>민호스시는 다음 목적을 위해 개인정보를 수집합니다:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>예약 처리 및 서비스 제공</li>
                <li>고객 연락 및 예약 확인</li>
                <li>서비스 개선 및 고객 만족도 향상</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl text-yellow-400 mb-4">2. 수집하는 개인정보</h2>
              <ul className="list-disc ml-6 space-y-1">
                <li>성명</li>
                <li>이메일 주소</li>
                <li>전화번호</li>
                <li>서비스 주소</li>
                <li>예약 관련 정보 (날짜, 인원수, 메뉴 선택)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl text-yellow-400 mb-4">3. 개인정보 보관 및 이용기간</h2>
              <p>수집된 개인정보는 서비스 제공 완료 후 1년간 보관되며, 이후 안전하게 삭제됩니다.</p>
            </section>

            <section>
              <h2 className="text-2xl text-yellow-400 mb-4">4. 개인정보 보안</h2>
              <p>고객의 개인정보는 암호화되어 안전하게 저장되며, 승인된 직원만 접근할 수 있습니다.</p>
            </section>

            <section>
              <h2 className="text-2xl text-yellow-400 mb-4">5. 고객 권리</h2>
              <p>고객은 언제든지 다음 권리를 행사할 수 있습니다:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>개인정보 열람 요청</li>
                <li>개인정보 수정 또는 삭제 요청</li>
                <li>개인정보 처리 동의 철회</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl text-yellow-400 mb-4">6. 문의처</h2>
              <p>개인정보 관련 문의사항은 다음으로 연락해주세요:</p>
              <p className="mt-2">이메일: privacy@minhosushi.com</p>
              <p>전화: 010-1234-5678</p>
            </section>

            <section>
              <h2 className="text-2xl text-yellow-400 mb-4">7. 정책 변경</h2>
              <p>
                본 개인정보보호정책은 법령 변경 또는 서비스 개선에 따라 변경될 수 있으며, 변경 시 웹사이트를 통해
                공지됩니다.
              </p>
            </section>

            <div className="mt-12 text-center text-gray-400">
              <p>최종 업데이트: 2024년 12월</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
