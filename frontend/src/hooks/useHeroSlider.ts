// hooks/useHeroSlider.ts
import { useState, useEffect, useCallback } from "react";

export const useHeroSlider = (length: number, intervalTime = 8000) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1: Prev, 1: Next

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % length);
  }, [length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + length) % length);
  }, [length]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Auto-play logic
  useEffect(() => {
    if (length <= 1) return;
    const interval = setInterval(nextSlide, intervalTime);
    return () => clearInterval(interval);
  }, [length, nextSlide, intervalTime]);

  return { currentIndex, direction, nextSlide, prevSlide, goToSlide };
};
