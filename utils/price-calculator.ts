import { menuItems, type PriceTier } from '@/constants/menu-items';

/**
 * 메뉴의 가격 티어 조회
 */
export function getPriceTier(
  menuTitle: string,
  guestCount: number
): PriceTier | null {
  const menu = menuItems.find((m) => m.title === menuTitle);
  if (!menu?.priceTiers) return null;

  const tier = menu.priceTiers.find(
    (t) => guestCount >= t.minGuests && guestCount <= t.maxGuests
  );

  return tier ?? null;
}

/**
 * 메뉴와 인원 수에 따른 인당 가격 계산
 */
export function getPricePerPerson(
  menuTitle: string,
  guestCount: number
): number {
  const menu = menuItems.find((m) => m.title === menuTitle);
  if (!menu) return 0;

  // priceTiers가 있으면 티어에서 찾기
  if (menu.priceTiers) {
    const tier = getPriceTier(menuTitle, guestCount);
    return tier?.price ?? 0;
  }

  // 없으면 기존 로직 (price 문자열에서 숫자 추출)
  const priceMatch = menu.price.match(/\$?(\d+)/);
  return priceMatch ? parseFloat(priceMatch[1]) : 0;
}

/**
 * 메뉴의 총 금액 계산 (인원 수 × 인당 가격)
 */
export function calculateCourseAmount(
  menuTitle: string,
  guestCount: number
): number {
  const pricePerPerson = getPricePerPerson(menuTitle, guestCount);
  return pricePerPerson * guestCount;
}

/**
 * 가격 티어 안내 텍스트 생성 (UI용)
 * 예: "4-5: $180 / 6-20: $149"
 */
export function getPriceTierNotice(menuTitle: string): string | null {
  const menu = menuItems.find((m) => m.title === menuTitle);
  if (!menu?.priceTiers || menu.priceTiers.length <= 1) return null;

  return menu.priceTiers
    .map((t) => `${t.minGuests}-${t.maxGuests}: $${t.price}`)
    .join(' / ');
}

/**
 * 인당 가격 표시 텍스트 생성
 * 예: "$180 per person" 또는 "From $149 per person"
 */
export function getPriceDisplayText(
  menuTitle: string,
  guestCount?: number
): string {
  const menu = menuItems.find((m) => m.title === menuTitle);
  if (!menu) return '';

  // 인원 수가 지정되면 해당 인원의 가격 반환
  if (guestCount !== undefined) {
    const price = getPricePerPerson(menuTitle, guestCount);
    return price > 0 ? `$${price} per person` : '';
  }

  // 인원 수가 없으면 기본 표시 가격 반환
  return menu.price;
}
