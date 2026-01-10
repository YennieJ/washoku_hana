export interface MenuItem {
  id: number;
  image: string;
  alt: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  imageFit?: 'cover' | 'contain';
  minGuests: number;
  maxGuests: number;
  inquiryRequired?: number; // 이 인원 이상일 때 문의 필요
}

export const menuItems: MenuItem[] = [
  {
    id: 1,
    image: '/Premium Omakase.jpeg',
    alt: 'Premium Sushi Omakase',
    title: 'Premium Sushi Omakase',
    subtitle: 'The True Essence of Sushi.',
    description: `Experience an authentic Kyoto-style omakase restaurant in the comfort of your home. A 17-course journey begins with refined appetizers and sashimi, followed by perfectly balanced nigiri sushi and a delicate dessert. Every moment is crafted by the hands of a master, bringing the full spirit of traditional Japanese omakase sushi to your table.`,
    price: '$189 per person',
    minGuests: 3,
    maxGuests: 5,
    inquiryRequired: 6, // 6명 이상일 때 문의 필요
  },
  {
    id: 2,
    image: '/Kaiseki Kappo Cuisine.jpeg',
    alt: 'Kaiseki Kappo Cuisine',
    title: 'Kaiseki Kappo Cuisine',
    subtitle: 'A Journey Through the Seasons.',
    description: `Discover the elegance of Kaiseki Kappo, crafted with traditional Japanese techniques. Each course reflects the beauty of the season—ingredients, colors, tableware, and even the chopsticks are thoughtfully chosen to express harmony with nature. From the opening zensai to the highlight of the Kaiseki course, hassun, every dish celebrates the spirit of the season. Sashimi, grilled, fried, simmered, and steamed dishes are prepared with precision to bring out the most delicate flavors and presentation. And the best part—you can experience this exquisite Kaiseki journey in the comfort of your own home.`,
    price: '$239 per person',
    minGuests: 2, // 2명부터 예약 가능
    maxGuests: 8,
  },
  {
    id: 3,
    image: '/winter-special.jpg',
    alt: 'Winter Special Catering Service',
    title: 'Winter Special Catering Service',
    subtitle: 'Elevate Your Event to Pure Luxury.',
    description:
      'This is the ultimate way to elevate your party with a fully immersive dining experience. Our on-site catering features three distinct live food stations, each staffed by a professional Japanese chef who prepares and serves dishes live throughout your event. Guests can move freely between a chef-attended live oyster bar with freshly shucked oysters, an authentic Japanese oden station, and a nigiri sushi station serving 10 pieces of premium sushi per guest—all crafted and presented in real time, creating an unforgettable blend of flavor, artistry, and atmosphere.',
    price: '$119 per person',
    minGuests: 15,
    maxGuests: 30,
    inquiryRequired: 31, // 31명 이상일 때 문의 필요
  },
];
