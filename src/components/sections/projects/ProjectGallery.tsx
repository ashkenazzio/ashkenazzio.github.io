'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { useCarousel } from '@/lib/useCarousel';
import { getImageSrcSet, MODAL_IMAGE_SIZES } from '@/lib/images';
import { cn } from '@/lib/utils';
import { GalleryLightbox } from './GalleryLightbox';
import type { LucideIcon } from 'lucide-react';
import type { ProjectImage } from '@/types/project';

interface ProjectGalleryProps {
  images: ProjectImage[];
  /** Shown when there are no images (e.g. a project with only a placeholder icon). */
  placeholder?: LucideIcon;
}

/** Preload an image so the next swipe shows instantly. */
const preload = (image: ProjectImage | undefined) => {
  if (!image || typeof window === 'undefined') return;
  const { src } = getImageSrcSet(image.src, { sizes: MODAL_IMAGE_SIZES });
  const img = new window.Image();
  img.src = src;
};

/**
 * In-modal image carousel. Slides horizontally with drag / arrow buttons /
 * keyboard ←→. Hides navigation when there's a single image. Falls back to a
 * placeholder icon when a project has no gallery.
 */
export function ProjectGallery({ images, placeholder: Placeholder }: ProjectGalleryProps) {
  const hasImages = images.length > 0;
  const multiple = images.length > 1;
  const [zoomed, setZoomed] = useState(false);
  const { index, direction, paginate, goTo, canPrev, canNext, dragHandlers } =
    useCarousel(images.length);

  const current = images[index];

  // Preload neighbours for snappy paging.
  useEffect(() => {
    preload(images[index + 1]);
    preload(images[index - 1]);
  }, [index, images]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiple) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      paginate(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      paginate(-1);
    }
  };

  if (!hasImages) {
    return (
      <div className="relative w-full aspect-video bg-gray-200 dark:bg-gray-800 flex items-center justify-center rounded-lg">
        {Placeholder ? (
          <Placeholder className="w-20 h-20 text-gray-400 dark:text-gray-600" />
        ) : null}
      </div>
    );
  }

  return (
    <div
      className="relative w-full select-none focus:outline-none"
      tabIndex={multiple ? 0 : -1}
      onKeyDown={handleKeyDown}
      role="group"
      aria-roledescription="carousel"
      aria-label="Project screenshots"
    >
      <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-muted">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            variants={{
              enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: 'spring',
              stiffness: 180,
              damping: 24,
              opacity: { duration: 0.35 },
            }}
            {...(multiple ? dragHandlers : {})}
            className={cn(
              'absolute inset-0',
              multiple && 'cursor-grab active:cursor-grabbing'
            )}
          >
            <img
              {...getImageSrcSet(current.src, { sizes: MODAL_IMAGE_SIZES })}
              alt={current.alt}
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {multiple && (
          <>
            <button
              onClick={() => paginate(-1)}
              disabled={!canPrev}
              className="touch-target absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center rounded-full bg-background/80 border border-input backdrop-blur-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-background transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => paginate(1)}
              disabled={!canNext}
              className="touch-target absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center rounded-full bg-background/80 border border-input backdrop-blur-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-background transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/55 text-white text-xs font-medium backdrop-blur-sm">
              {index + 1} / {images.length}
            </div>
          </>
        )}

        {/* Zoom / expand button — available on every slide. */}
        <button
          type="button"
          onClick={() => setZoomed(true)}
          aria-label="Zoom image"
          className="touch-target absolute bottom-2 right-2 grid place-items-center rounded-full bg-black/55 text-white hover:bg-black/75 backdrop-blur-sm transition-colors"
        >
          <Expand className="h-4 w-4" />
        </button>
      </div>

      {zoomed && (
        <GalleryLightbox image={current} onClose={() => setZoomed(false)} />
      )}

      {/* Caption */}
      {current.caption && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {current.caption}
        </p>
      )}

      {/* Dots (≤4) or thumbnail strip (>4) */}
      {multiple &&
        (images.length <= 4 ? (
          <div className="flex justify-center gap-2 mt-4">
            {images.map((img, i) => (
              <button
                key={img.src}
                onClick={() => goTo(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === index
                    ? 'bg-primary w-6'
                    : 'w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        ) : (
          <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hidden py-1">
            {images.map((img, i) => (
              <button
                key={img.src}
                onClick={() => goTo(i)}
                aria-label={`Go to image ${i + 1}`}
                className={cn(
                  'relative flex-shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-colors',
                  i === index
                    ? 'border-primary'
                    : 'border-transparent opacity-60 hover:opacity-100'
                )}
              >
                <img
                  {...getImageSrcSet(img.src)}
                  alt=""
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        ))}
    </div>
  );
}
