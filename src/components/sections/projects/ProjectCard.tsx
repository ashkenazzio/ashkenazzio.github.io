'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Images } from 'lucide-react';
import { HoverCardEffect } from '../../ui/HoverCardEffect';
import { ProjectLinks } from './ProjectLinks';
import { getImageSrcSet } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  onOpen: () => void;
  /** Outer HoverCardEffect className (controls show/hide pop animations from the grid). */
  className?: string;
  /** Style applied to the HoverCardEffect inner element (e.g. animation-delay). */
  innerStyle?: React.CSSProperties;
  /** When true, the thumbnail plays its blur-in entrance (desktop initial cards). */
  animateImage?: boolean;
  /** Extra class applied to the thumbnail img (e.g. blur-out on close). */
  imageClassName?: string;
  imageStyle?: React.CSSProperties;
}

/**
 * A single project card. The whole card is clickable (opens the case-study
 * modal via `onOpen`) through an absolutely-positioned button behind the
 * content; the footer links sit above it and stop propagation, so a visitor
 * who only wants the repo can click GitHub/Live and leave without opening the
 * modal.
 */
export function ProjectCard({
  project,
  onOpen,
  className,
  innerStyle,
  animateImage = false,
  imageClassName,
  imageStyle,
}: ProjectCardProps) {
  const galleryCount = project.gallery?.length ?? 0;
  const Placeholder = project.placeholder;

  // Card cover: a chosen gallery slide if there's a gallery, else the legacy
  // `image` thumbnail, else the placeholder icon.
  const coverImage = project.gallery?.[project.coverIndex ?? 0];
  const coverSrc = coverImage?.src ?? project.image ?? null;
  const coverAlt = coverImage?.alt ?? project.title;

  const handleKeyOpen = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <HoverCardEffect
      className={cn('group bg-card rounded-lg overflow-hidden h-full', className)}
      containerClassName="h-full rounded-lg"
      innerStyle={innerStyle}
    >
      {/* Full-card open trigger — sits behind the real interactive content. */}
      <button
        type="button"
        onClick={onOpen}
        onKeyDown={handleKeyOpen}
        aria-label={`View case study: ${project.title}`}
        className="absolute inset-0 z-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset rounded-lg"
      />

      <div className="relative z-10 flex flex-col h-full pointer-events-none">
        {/* Thumbnail */}
        <div className="h-48 bg-muted relative overflow-hidden flex-shrink-0">
          {coverSrc ? (
            animateImage ? (
              <motion.img
                {...getImageSrcSet(coverSrc)}
                alt={coverAlt}
                className={cn('w-full h-48 object-cover', imageClassName)}
                style={imageStyle}
                initial={{ filter: 'blur(16px)', opacity: 0 }}
                whileInView={{ filter: 'blur(0px)', opacity: 1 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{
                  opacity: { duration: 0.3, ease: 'easeOut' },
                  filter: { duration: 0.6, delay: 0.15, ease: 'easeOut' },
                }}
              />
            ) : (
              <img
                {...getImageSrcSet(coverSrc)}
                alt={coverAlt}
                className={cn('w-full h-48 object-cover', imageClassName)}
                style={imageStyle}
              />
            )
          ) : Placeholder ? (
            <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
              <Placeholder className="w-16 h-16 text-gray-400 dark:text-gray-600" />
            </div>
          ) : null}

          {/* WIP badge */}
          {project.wip && (
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500/90 text-white text-xs font-medium rounded-full backdrop-blur-sm shadow-sm">
              Work in Progress
            </div>
          )}

          {/* Multi-image hint */}
          {galleryCount > 1 && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/55 text-white text-xs font-medium rounded-full backdrop-blur-sm shadow-sm">
              <Images className="w-3.5 h-3.5" />
              <span>{galleryCount}</span>
            </div>
          )}

          {/* "View case study" affordance — appears on hover / touch-active */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-primary/5 to-transparent flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 [.touch-active_&]:opacity-100 transition-opacity duration-300">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 text-foreground text-sm font-medium shadow-sm backdrop-blur-sm translate-y-2 group-hover:translate-y-0 [.touch-active_&]:translate-y-0 transition-transform duration-300">
              View case study
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-foreground">{project.title}</h3>
          <p className="text-muted-foreground text-sm">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span key={tag} data-touch-hover className="project-tag">
                {tag}
              </span>
            ))}
          </div>
          {/* Footer links — re-enable pointer events and sit above the open button. */}
          <ProjectLinks
            project={project}
            className="pt-2 mt-auto pointer-events-auto"
          />
        </div>
      </div>
    </HoverCardEffect>
  );
}
