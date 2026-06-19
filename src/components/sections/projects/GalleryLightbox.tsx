'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { getImageSrcSet } from '@/lib/images';
import { lightboxOpened, lightboxClosed } from './lightboxGuard';
import type { ProjectImage } from '@/types/project';

interface GalleryLightboxProps {
  image: ProjectImage;
  onClose: () => void;
}

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Fullscreen, zoomable view of a single gallery image. Supports:
 *  - pinch-to-zoom + drag-to-pan on touch (native Pointer Events)
 *  - wheel-to-zoom and double-click/tap-to-toggle-zoom on desktop
 *  - Escape / close button / backdrop-click (when not zoomed) to dismiss
 *
 * Rendered above the project modal; it stops propagation so the underlying
 * Radix dialog doesn't also react to its pointer/keyboard events.
 */
export function GalleryLightbox({ image, onClose }: GalleryLightboxProps) {
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);

  const overlayRef = useRef<HTMLDivElement>(null);

  // Active pointers (for pinch) and the in-progress gesture baseline.
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const gesture = useRef<{
    startDist: number;
    startScale: number;
    startTx: number;
    startTy: number;
    panId: number | null;
    lastX: number;
    lastY: number;
  }>({ startDist: 0, startScale: 1, startTx: 0, startTy: 0, panId: null, lastX: 0, lastY: 0 });

  // Mark the lightbox active for its whole lifetime (plus a grace window after
  // unmount) so the modal underneath never treats lightbox interactions — or
  // the residual synthetic mouse event after a touch — as an outside click.
  useEffect(() => {
    lightboxOpened();
    return () => lightboxClosed();
  }, []);

  const close = useCallback(() => onClose(), [onClose]);

  const reset = useCallback(() => {
    setScale(1);
    setTx(0);
    setTy(0);
  }, []);

  // Escape closes; lock is already handled by the underlying Radix dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
      }
    };
    // capture phase so we intercept before Radix's own Escape handler
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [close]);

  // Block all scroll while the lightbox is open: wheel zooms (and is prevented
  // from reaching the modal body behind), touchmove is swallowed. Native
  // non-passive listeners are required for preventDefault to actually work.
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const onWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      setScale(prev => {
        const next = clamp(prev - e.deltaY * 0.0015 * prev, MIN_SCALE, MAX_SCALE);
        if (next <= MIN_SCALE + 0.01) {
          setTx(0);
          setTy(0);
        }
        return next;
      });
    };
    const onTouchMoveNative = (e: TouchEvent) => e.preventDefault();
    el.addEventListener('wheel', onWheelNative, { passive: false });
    el.addEventListener('touchmove', onTouchMoveNative, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheelNative);
      el.removeEventListener('touchmove', onTouchMoveNative);
    };
  }, []);

  const distance = () => {
    const pts = [...pointers.current.values()];
    if (pts.length < 2) return 0;
    return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2) {
      // begin pinch
      gesture.current.startDist = distance();
      gesture.current.startScale = scale;
      gesture.current.startTx = tx;
      gesture.current.startTy = ty;
      gesture.current.panId = null;
    } else if (pointers.current.size === 1 && scale > 1) {
      // begin pan
      gesture.current.panId = e.pointerId;
      gesture.current.lastX = e.clientX;
      gesture.current.lastY = e.clientY;
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size >= 2 && gesture.current.startDist > 0) {
      // pinch zoom
      const ratio = distance() / gesture.current.startDist;
      setScale(clamp(gesture.current.startScale * ratio, MIN_SCALE, MAX_SCALE));
    } else if (gesture.current.panId === e.pointerId && scale > 1) {
      // pan
      const dx = e.clientX - gesture.current.lastX;
      const dy = e.clientY - gesture.current.lastY;
      gesture.current.lastX = e.clientX;
      gesture.current.lastY = e.clientY;
      setTx(prev => prev + dx);
      setTy(prev => prev + dy);
    }
  };

  const endPointer = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) gesture.current.startDist = 0;
    if (gesture.current.panId === e.pointerId) gesture.current.panId = null;
    // Snap back when zoomed all the way out.
    if (scale <= MIN_SCALE + 0.01) {
      setTx(0);
      setTy(0);
    }
  };

  const onDoubleClick = () => {
    if (scale > 1) reset();
    else setScale(2.5);
  };

  const zoomed = scale > 1;

  return (
    <div
      ref={overlayRef}
      data-gallery-lightbox=""
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm touch-none select-none overscroll-contain"
      onClick={e => {
        e.stopPropagation();
        // Click on the backdrop (not the image) closes, but only when not zoomed in.
        if (!zoomed && e.target === e.currentTarget) close();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${image.alt} — zoomable view`}
    >
      {/* Controls */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            setScale(s => (s > 1 ? clamp(s - 1, MIN_SCALE, MAX_SCALE) : s));
            if (scale - 1 <= MIN_SCALE + 0.01) reset();
          }}
          disabled={!zoomed}
          aria-label="Zoom out"
          className="touch-target grid place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            setScale(s => clamp(s + 1, MIN_SCALE, MAX_SCALE));
          }}
          aria-label="Zoom in"
          className="touch-target grid place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            close();
          }}
          aria-label="Close zoom"
          className="touch-target grid place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Zoomable image */}
      <img
        {...getImageSrcSet(image.src, { sizes: '100vw' })}
        alt={image.alt}
        draggable={false}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onDoubleClick={onDoubleClick}
        onClick={e => e.stopPropagation()}
        className="max-h-[92vh] max-w-[92vw] object-contain will-change-transform"
        style={{
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
          cursor: zoomed ? 'grab' : 'zoom-in',
          transition: pointers.current.size ? 'none' : 'transform 0.18s ease-out',
          touchAction: 'none',
        }}
      />

      {/* Caption + hint */}
      <div className="absolute bottom-3 inset-x-0 text-center px-4 pointer-events-none">
        {image.caption && (
          <p className="text-white/90 text-sm">{image.caption}</p>
        )}
        <p className="text-white/40 text-xs mt-1">
          Pinch or scroll to zoom · double-tap to reset
        </p>
      </div>
    </div>
  );
}
