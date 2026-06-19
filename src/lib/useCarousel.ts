'use client';

import { useState, useRef, useCallback } from 'react';
import type { PanInfo } from 'framer-motion';

const SWIPE_CONFIDENCE_THRESHOLD = 10000;
const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

export interface UseCarouselResult {
  /** Current slide index. */
  index: number;
  /** Direction of the last transition: 1 = forward, -1 = back. Feeds AnimatePresence `custom`. */
  direction: number;
  /** Step by `delta` (+1 / -1), clamped to range. */
  paginate: (delta: number) => void;
  /** Jump to an absolute index. */
  goTo: (target: number) => void;
  canPrev: boolean;
  canNext: boolean;
  /** Whether the last pointer gesture moved far enough to count as a drag (use to suppress a tap/click). */
  didDrag: () => boolean;
  /** Spread onto a draggable motion element to enable horizontal swipe paging. */
  dragHandlers: {
    drag: 'x';
    dragConstraints: { left: 0; right: 0 };
    dragElastic: number;
    onDragStart: () => void;
    onDragEnd: (
      e: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo
    ) => void;
  };
}

/**
 * Headless carousel state shared by the in-modal gallery and the mobile
 * project carousel: index tracking, directional paging, swipe handling, and a
 * tap-vs-drag flag.
 *
 * `lockMs` debounces rapid paging (matches the original 200ms release so a
 * fast swipe can't outrun the exit animation).
 */
export const useCarousel = (
  count: number,
  options: { lockMs?: number } = {}
): UseCarouselResult => {
  const { lockMs = 200 } = options;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const isAnimating = useRef(false);
  const dragged = useRef(false);

  const goTo = useCallback(
    (target: number) => {
      if (isAnimating.current) return;
      if (target < 0 || target >= count || target === index) return;
      isAnimating.current = true;
      setDirection(target > index ? 1 : -1);
      setIndex(target);
      setTimeout(() => {
        isAnimating.current = false;
      }, lockMs);
    },
    [count, index, lockMs]
  );

  const paginate = useCallback(
    (delta: number) => {
      goTo(index + delta);
    },
    [goTo, index]
  );

  const onDragStart = useCallback(() => {
    dragged.current = false;
  }, []);

  const onDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const power = swipePower(info.offset.x, info.velocity.x);
      if (Math.abs(info.offset.x) > 4) {
        dragged.current = true;
        // Clear on the next tick: this only needs to suppress the click that
        // immediately follows *this* drag. Leaving it set would poison every
        // later tap (the card would never open again after one swipe).
        setTimeout(() => {
          dragged.current = false;
        }, 0);
      }
      if (power < -SWIPE_CONFIDENCE_THRESHOLD) {
        paginate(1);
      } else if (power > SWIPE_CONFIDENCE_THRESHOLD) {
        paginate(-1);
      }
    },
    [paginate]
  );

  return {
    index,
    direction,
    paginate,
    goTo,
    canPrev: index > 0,
    canNext: index < count - 1,
    didDrag: () => dragged.current,
    dragHandlers: {
      drag: 'x',
      dragConstraints: { left: 0, right: 0 },
      dragElastic: 0.2,
      onDragStart,
      onDragEnd,
    },
  };
};
