'use client';

import { useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { ProjectGallery } from './ProjectGallery';
import { ProjectCaseStudy } from './ProjectCaseStudy';
import { ProjectLinks } from './ProjectLinks';
import { lightboxActive } from './lightboxGuard';
import type { Project, ProjectImage } from '@/types/project';

interface ProjectModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Derive the gallery: explicit gallery, else a single slide from the thumbnail, else empty. */
const deriveSlides = (project: Project): ProjectImage[] => {
  if (project.gallery && project.gallery.length > 0) return project.gallery;
  if (project.image) return [{ src: project.image, alt: project.title }];
  return [];
};

/**
 * True when a modal-dismiss attempt should be ignored because it really came
 * from the gallery lightbox (which is portaled to <body>, so Radix sees it as
 * "outside"). Covers the lightbox being open, its trailing synthetic events,
 * and any event whose target is still within the lightbox.
 */
const shouldIgnoreDismiss = (target: EventTarget | null) =>
  lightboxActive() ||
  (target instanceof Element && !!target.closest('[data-gallery-lightbox]'));

/**
 * Case-study lightbox for a project. Controlled via `open`/`onOpenChange`
 * (no per-card trigger). Built on Radix Dialog, animated with the same
 * CSS data-state mechanism as Sheet.tsx, so Radix natively handles focus
 * trap, ESC, scroll lock, and exit timing.
 *
 * Responsive layout: a bottom sheet on mobile, a centered panel on desktop.
 */
export function ProjectModal({ project, open, onOpenChange }: ProjectModalProps) {
  // Safety net: after the modal closes, if no Radix dialog remains open, make
  // sure the scroll-lock library didn't leave <body> non-interactive. Without
  // this, an interrupted close (e.g. a portaled child unmounting mid-close on
  // touch) can strand `pointer-events: none` on the body, making the whole page
  // untappable until reload.
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      if (!document.querySelector('[role="dialog"][data-state="open"]')) {
        if (document.body.style.pointerEvents === 'none') {
          document.body.style.pointerEvents = '';
        }
      }
    }, 350); // after the exit animation + Radix cleanup
    return () => clearTimeout(t);
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          onPointerDownOutside={e => {
            if (shouldIgnoreDismiss(e.target)) e.preventDefault();
          }}
          onInteractOutside={e => {
            if (shouldIgnoreDismiss(e.target)) e.preventDefault();
          }}
          onFocusOutside={e => {
            if (shouldIgnoreDismiss(e.target)) e.preventDefault();
          }}
          className="fixed z-50 bg-card text-card-foreground shadow-xl border border-border
            inset-x-0 bottom-0 max-h-[92vh] rounded-t-2xl
            sm:inset-0 sm:m-auto sm:h-fit sm:max-h-[88vh] sm:max-w-3xl lg:max-w-4xl sm:rounded-2xl
            flex flex-col overflow-hidden
            data-[state=open]:animate-in data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
            data-[state=closed]:duration-200 data-[state=open]:duration-300
            data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom
            sm:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=open]:slide-in-from-bottom-0
            sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95"
        >
          {project && (
            <>
              {/* Header */}
              <div className="flex items-start justify-between gap-4 p-5 sm:p-6 pb-3 sm:pb-4 border-b border-border">
                <div className="min-w-0 flex items-center gap-2.5">
                  <Dialog.Title className="text-xl sm:text-2xl font-bold text-foreground truncate">
                    {project.title}
                  </Dialog.Title>
                  {project.wip && (
                    <span className="flex-shrink-0 px-2 py-0.5 bg-amber-500/90 text-white text-xs font-medium rounded-full">
                      WIP
                    </span>
                  )}
                </div>
                <Dialog.Close
                  className="touch-target flex-shrink-0 grid place-items-center -mr-2 -mt-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </Dialog.Close>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto scrollbar-thin px-5 sm:px-6 py-5 space-y-6">
                <Dialog.Description className="sr-only">
                  {project.description}
                </Dialog.Description>

                <ProjectGallery
                  images={deriveSlides(project)}
                  placeholder={project.placeholder}
                />

                <ProjectCaseStudy project={project} />

                <ProjectLinks
                  project={project}
                  stopPropagation={false}
                  className="pt-2 border-t border-border"
                />
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
