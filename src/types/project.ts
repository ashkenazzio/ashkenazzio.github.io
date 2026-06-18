import type { LucideIcon } from 'lucide-react';

/**
 * A single gallery image. `src` is the base filename in /public
 * (e.g. "TrapCheck.webp"), matching the getImageSrcSet contract which
 * derives the -400w / -800w responsive variants from it.
 */
export interface ProjectImage {
  src: string;
  alt: string;
  caption?: string;
}

/** A code repository link (used when a project has more than one repo). */
export interface ProjectRepo {
  label: string;
  url: string;
}

/**
 * Structured case study. Each field is optional so the modal can render
 * only the sections that exist and skip the empty ones.
 */
export interface ProjectCaseStudy {
  problem?: string;
  approach?: string;
  outcome?: string;
}

/** A single highlighted metric, e.g. { value: "99.47%", label: "classification accuracy" }. */
export interface ProjectMetric {
  value: string;
  label: string;
}

/** Technologies grouped by role, e.g. { category: "Backend", items: [...] }. */
export interface TechGroup {
  category: string;
  items: string[];
}

export interface Project {
  id: number;
  title: string;
  /** Short blurb — shown on the card and used as the modal fallback when no caseStudy exists. */
  description: string;

  // --- Card thumbnail ---
  /**
   * Fallback thumbnail filename in /public, used only when there is no
   * `gallery`. When a gallery exists, the card cover is drawn from it (see
   * `coverIndex`) so a project doesn't need a separate cover image.
   */
  image?: string | null;
  /** Icon fallback rendered when there is neither a gallery nor an image. */
  placeholder?: LucideIcon;

  // --- Links ---
  github: string | ProjectRepo[];
  live?: string | null;
  wip?: boolean;

  // --- Compact chips on the card ---
  tags: string[];

  // --- Modal-only content (all optional → graceful fallback) ---
  /** Multiple screenshots; if absent, the modal falls back to a single slide built from `image`. */
  gallery?: ProjectImage[];
  /** Which gallery image to use as the card cover (defaults to 0, the first slide). */
  coverIndex?: number;
  caseStudy?: ProjectCaseStudy;
  metrics?: ProjectMetric[];
  techStack?: TechGroup[];
}
