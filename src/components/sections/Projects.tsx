'use client';

import { useState, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { easeOutQuint } from '@/lib/motion-variants';
import { useIsMobile } from '@/lib/useIsMobile';
import { projects } from '@/data/projects';
import type { Project } from '@/types/project';
import { ProjectCard } from './projects/ProjectCard';
import { MobileProjectCarousel } from './projects/MobileProjectCarousel';
import { ProjectModal } from './projects/ProjectModal';

// Custom smooth scroll with configurable duration and easing
const smoothScrollTo = (
  targetY: number,
  duration: number = 1200
): Promise<void> => {
  return new Promise(resolve => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuint(progress);

      window.scrollTo({
        top: startY + distance * easedProgress,
        behavior: 'instant',
      });

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(animateScroll);
  });
};

const INITIAL_PROJECTS_COUNT = 3;

export default function Projects() {
  const [showAll, setShowAll] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [justClosed, setJustClosed] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const openProject = (project: Project) => {
    setActiveProject(project);
    setModalOpen(true);
  };

  const displayedProjects =
    showAll || isClosing ? projects : projects.slice(0, INITIAL_PROJECTS_COUNT);

  const handleToggle = () => {
    if (showAll) {
      // Closing: animate out, then hide and scroll (desktop only)
      setIsClosing(true);
      setJustClosed(true);
      setTimeout(() => {
        setShowAll(false);
        setIsClosing(false);
        // Scroll to section heading with padding for header
        if (headingRef.current) {
          const headingRect = headingRef.current.getBoundingClientRect();
          const header = document.querySelector('header');
          const headerHeight = header?.getBoundingClientRect().height ?? 0;
          const isMobileViewport = window.innerWidth < 768;

          // Mobile: heading right beneath header with minimal margin
          // Desktop: more breathing room
          const scrollMargin = isMobileViewport ? 16 : 40;
          const targetY =
            window.scrollY + headingRect.top - headerHeight - scrollMargin;
          smoothScrollTo(Math.max(0, targetY), 1000);
        }
        // Reset justClosed after the delay animation completes
        setTimeout(() => setJustClosed(false), 400);
      }, 500); // stagger (200ms) + anim (300ms) = 500ms
    } else {
      setShowAll(true);
      // Scroll to show new projects only on desktop
      if (window.innerWidth >= 768) {
        requestAnimationFrame(() => {
          if (buttonRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            // Scroll so the button is near the bottom of the viewport
            const targetY =
              window.scrollY + buttonRect.bottom - viewportHeight + 60; // 60px padding from bottom
            smoothScrollTo(targetY, 1200);
          }
        });
      }
    }
  };

  return (
    <section id="projects" ref={sectionRef} className="bg-background/50">
      <div className="section-container">
        <motion.h2
          ref={headingRef}
          className="section-heading mb-8"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          Projects
        </motion.h2>
        <motion.p
          className="text-muted-foreground mb-8"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        >
          Here are some of the projects I&apos;ve worked on, showcasing my
          skills in various technologies and problem domains. Tap a project to
          dive into the full case study.
        </motion.p>

        {isMobile ? (
          <MobileProjectCarousel projects={projects} onOpen={openProject} />
        ) : (
          <>
            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {displayedProjects.map((project, index) => {
                const isExtraProject = index >= INITIAL_PROJECTS_COUNT;
                const extraProjectsCount =
                  projects.length - INITIAL_PROJECTS_COUNT;
                const openDelay = isExtraProject
                  ? `${(index - INITIAL_PROJECTS_COUNT) * 100}ms`
                  : undefined;
                // Reverse stagger for closing: last project animates first
                const closeDelayMs = isExtraProject
                  ? (extraProjectsCount - 1 - (index - INITIAL_PROJECTS_COUNT)) *
                    100
                  : 0;
                const closeDelay = `${closeDelayMs}ms`;

                // Initial projects: individual viewport triggers (motion wrapper).
                // Extra projects: CSS pop-in / pop-out for show/hide.
                const popClass = isExtraProject
                  ? showAll && !isClosing
                    ? 'animate-pop-in'
                    : isClosing
                      ? 'animate-pop-out'
                      : ''
                  : '';
                const innerStyle = isExtraProject
                  ? { animationDelay: isClosing ? closeDelay : openDelay }
                  : undefined;
                const imageClassName =
                  isExtraProject && isClosing ? 'animate-blur-out' : undefined;
                const imageStyle =
                  isExtraProject && isClosing
                    ? { animationDelay: closeDelay }
                    : undefined;

                const card = (
                  <ProjectCard
                    project={project}
                    onOpen={() => openProject(project)}
                    className={popClass}
                    innerStyle={innerStyle}
                    animateImage={!isExtraProject}
                    imageClassName={imageClassName}
                    imageStyle={imageStyle}
                  />
                );

                return isExtraProject ? (
                  <div key={project.id}>{card}</div>
                ) : (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{
                      type: 'spring',
                      stiffness: 80,
                      damping: 14,
                      delay: index * 0.1,
                    }}
                  >
                    {card}
                  </motion.div>
                );
              })}
            </div>

            {projects.length > INITIAL_PROJECTS_COUNT && (
              <div className="flex justify-center mt-12">
                <AnimatePresence mode="wait">
                  {!isClosing && (
                    <motion.div
                      key={showAll ? 'less' : 'more'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        duration: 0.2,
                        delay: justClosed && !showAll ? 0.35 : 0,
                      }}
                    >
                      <Button
                        ref={buttonRef}
                        variant="outline"
                        onClick={handleToggle}
                        className="group gap-2 hover:bg-accent hover:text-accent-foreground hover:border-primary/30 cursor-pointer"
                      >
                        {showAll ? (
                          <>
                            <span>Show Less</span>
                            <ChevronUp className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
                          </>
                        ) : (
                          <>
                            <span>Show More Projects</span>
                            <ChevronDown className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>

      <ProjectModal
        project={activeProject}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </section>
  );
}
