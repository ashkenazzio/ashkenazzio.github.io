'use client';

import { Github, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project } from '@/types/project';

/**
 * Shared outline-button link style (previously copy-pasted across the
 * card / mobile-carousel / hover-overlay markup).
 */
const linkClass =
  'justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/30 h-9 rounded-md px-3 flex gap-2 items-center cursor-pointer';

interface ProjectLinksProps {
  project: Pick<Project, 'title' | 'github' | 'live'>;
  className?: string;
  /**
   * When true (the default), clicks are stopped from bubbling so a link inside
   * a clickable card opens the URL without triggering the card's open handler.
   */
  stopPropagation?: boolean;
}

/**
 * Renders a project's GitHub repo link(s) and optional live-site link as a
 * group of outline buttons. Each link stops propagation by default so a
 * recruiter can jump straight to the repo from a clickable card.
 */
export function ProjectLinks({
  project,
  className,
  stopPropagation = true,
}: ProjectLinksProps) {
  const handleClick = stopPropagation
    ? (e: React.MouseEvent) => e.stopPropagation()
    : undefined;

  return (
    <div className={cn('flex gap-3 flex-wrap', className)}>
      {Array.isArray(project.github) ? (
        project.github.map(repo => (
          <a
            key={repo.label}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            aria-label={`View ${project.title} ${repo.label} on GitHub`}
            className={linkClass}
          >
            <Github />
            <span>{repo.label}</span>
          </a>
        ))
      ) : (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          aria-label={`View ${project.title} on GitHub`}
          className={linkClass}
        >
          <Github />
          <span>GitHub</span>
        </a>
      )}
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          aria-label={`View live demo of ${project.title}`}
          className={linkClass}
        >
          <ExternalLink />
          <span>Live Site</span>
        </a>
      )}
    </div>
  );
}
