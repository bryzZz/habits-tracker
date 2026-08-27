import { type TouchEvent, useRef } from "react";

const SWIPE_THRESHOLD_PX = 50;

/** Detects a discrete horizontal swipe (not a real-time drag-follow) and
 * reports its direction once the gesture completes. */
export const useSwipeNavigate = (onSwipe: (direction: -1 | 1) => void) => {
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: TouchEvent<HTMLElement>) => {
    const touch = e.touches[0];
    startRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (e: TouchEvent<HTMLElement>) => {
    const start = startRef.current;
    startRef.current = null;
    if (!start) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (
      Math.abs(deltaX) < SWIPE_THRESHOLD_PX ||
      Math.abs(deltaX) < Math.abs(deltaY)
    ) {
      return;
    }

    onSwipe(deltaX < 0 ? 1 : -1);
  };

  return { onTouchStart, onTouchEnd };
};
