'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

interface EventImage {
  src: string;
  alt: string;
}

interface EventPortfolioCarouselProps {
  images: EventImage[];
}

export default function EventPortfolioCarousel({
  images,
}: EventPortfolioCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // 이미지 클릭 시 해당 이미지를 중앙으로 이동
  const handleImageClick = (index: number) => {
    if (!isDragging) {
      setCurrentIndex(index);
    }
  };

  // 드래그 시작
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  // 드래그 중
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  // 스크롤 위치에서 현재 중앙 인덱스 계산
  const updateCurrentIndex = () => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const items = container.querySelectorAll('.carousel-item');

      let closestIndex = 0;
      let minDistance = Infinity;

      items.forEach((item, index) => {
        const itemElement = item as HTMLElement;
        const itemLeft = itemElement.offsetLeft;
        const itemWidth = itemElement.offsetWidth;
        const itemCenter = itemLeft + itemWidth / 2;
        const containerCenter = scrollLeft + containerWidth / 2;
        const distance = Math.abs(itemCenter - containerCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setCurrentIndex(closestIndex);
    }
  };

  // 드래그 종료 시 가장 가까운 이미지로 스냅
  const handleDragEnd = () => {
    setIsDragging(false);
    updateCurrentIndex();
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // 현재 인덱스 변경 시 스크롤 조정
  useEffect(() => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const items = container.querySelectorAll('.carousel-item');
      if (items[currentIndex]) {
        const item = items[currentIndex] as HTMLElement;
        const itemLeft = item.offsetLeft;
        const itemWidth = item.offsetWidth;
        const containerWidth = container.clientWidth;
        const scrollPosition = itemLeft - (containerWidth - itemWidth) / 2;

        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth',
        });
      }
    }
  }, [currentIndex]);

  // 스크롤 이벤트 리스너 추가
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      // 스크롤이 멈춘 후에만 인덱스 업데이트
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (!isDragging && container) {
          const scrollLeft = container.scrollLeft;
          const containerWidth = container.clientWidth;
          const items = container.querySelectorAll('.carousel-item');

          let closestIndex = 0;
          let minDistance = Infinity;

          items.forEach((item, index) => {
            const itemElement = item as HTMLElement;
            const itemLeft = itemElement.offsetLeft;
            const itemWidth = itemElement.offsetWidth;
            const itemCenter = itemLeft + itemWidth / 2;
            const containerCenter = scrollLeft + containerWidth / 2;
            const distance = Math.abs(itemCenter - containerCenter);

            if (distance < minDistance) {
              minDistance = distance;
              closestIndex = index;
            }
          });

          setCurrentIndex(closestIndex);
        }
      }, 150);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isDragging]);

  // 이미지와 중앙 인덱스 간의 거리를 계산하여 스케일 결정
  const getScale = (index: number) => {
    const distance = Math.abs(currentIndex - index);
    if (distance === 0) return 1.0;
    if (distance === 1) return 0.85;
    if (distance === 2) return 0.7;
    return 0.6;
  };

  return (
    <section>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* 섹션 제목 */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-light text-white mb-2">
            Our Best Moments
          </h2>
        </div>

        <div
          ref={carouselRef}
          className="overflow-x-auto overflow-y-visible scrollbar-hide cursor-grab active:cursor-grabbing py-8"
          style={{
            scrollSnapType: 'x mandatory',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex gap-6 sm:gap-8 md:gap-8 lg:gap-6">
            {/* 왼쪽 spacer - 첫 번째 이미지를 중앙에 배치하기 위함 */}
            <div
              className="flex-shrink-0 left-spacer"
              style={{ scrollSnapAlign: 'start' }}
            />

            {images.map((image, index) => {
              const scale = getScale(index);
              const isCenter = index === currentIndex;

              return (
                <div
                  key={index}
                  className="carousel-item flex-shrink-0 transition-transform duration-500 ease-out"
                  style={{
                    transform: `scale(${scale})`,
                    scrollSnapAlign: 'center',
                  }}
                  onClick={() => handleImageClick(index)}
                >
                  <div
                    className={`relative rounded-lg overflow-hidden cursor-pointer
                      w-48 h-64
                      sm:w-56 sm:h-72
                      md:w-64 md:h-80
                      lg:w-72 lg:h-96
                      ${
                        isCenter
                          ? 'ring-2 ring-primary shadow-2xl shadow-primary/20'
                          : 'opacity-70 hover:opacity-90'
                      }
                      transition-all duration-500
                    `}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      draggable={false}
                    />
                  </div>
                </div>
              );
            })}

            {/* 오른쪽 spacer - 마지막 이미지를 중앙에 배치하기 위함 */}
            <div
              className="flex-shrink-0 right-spacer"
              style={{ scrollSnapAlign: 'end' }}
            />
          </div>
        </div>

        {/* 인디케이터 */}
        <div className="flex justify-center gap-2 mt-8">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-primary w-8'
                  : 'bg-gray-600 hover:bg-gray-400'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
