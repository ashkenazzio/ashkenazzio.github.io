'use client';

/**
 * Shared guard so the gallery lightbox never dismisses the project modal
 * underneath it.
 *
 * The lightbox is portaled to <body>, so Radix's Dialog treats every pointer
 * event in it (and the residual synthetic mouse event a browser fires ~300ms
 * after a touchend) as an "interact outside" and would close the modal. We
 * expose a live "is the lightbox active?" check the modal consults before
 * allowing dismissal: true while the lightbox is mounted, and for a short
 * window after it closes to absorb those trailing synthetic events.
 */
let openCount = 0;
let closedAt = 0;

/** Mark the lightbox as mounted/active. */
export const lightboxOpened = () => {
  openCount += 1;
};

/** Mark the lightbox as unmounted; starts the post-close grace window. */
export const lightboxClosed = () => {
  openCount = Math.max(0, openCount - 1);
  closedAt = Date.now();
};

/**
 * True while a lightbox is open, or closed within the last `windowMs`.
 * The modal uses this to ignore outside-interactions that really belong to
 * the lightbox.
 */
export const lightboxActive = (windowMs = 700) =>
  openCount > 0 || Date.now() - closedAt < windowMs;
