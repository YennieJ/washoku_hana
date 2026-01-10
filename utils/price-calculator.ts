import { menuItems } from '@/constants/menu-items';

/**
 * Kaiseki Kappo Cuisine의 인원 수에 따른 인당 가격 계산
 * - 2-3명: $289 per person
 * - 4-8명: $239 per person
 */
export function getKaisekiPricePerPerson(guestCount: number): number {
  if (guestCount < 4) {
    return 289;
  }
  return 239;
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

  // Kaiseki Kappo Cuisine만 특별 처리
  if (menu.title === 'Kaiseki Kappo Cuisine') {
    return getKaisekiPricePerPerson(guestCount);
  }

  // 다른 메뉴는 기존 로직 (price 문자열에서 숫자 추출)
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
