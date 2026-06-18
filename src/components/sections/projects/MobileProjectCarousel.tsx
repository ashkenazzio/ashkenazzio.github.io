'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { useCarousel } from '@/lib/useCarousel';
import type { Project } from '@/types/project';

interface MobileProjectCarouselProps {
  projects: Project[];
  onOpen: (project: Project) => void;
}

/**
 * The < 768px project view: a 3D-flip carousel that pages between projects via
 * drag / arrows / dots. Each slide is a ProjectCard; tapping a card (a gesture
 * that did not drag) opens its case-study modal.
 */
export function MobileProjectCarousel({
  projects,
  onOpen,
}: MobileProjectCarouselProps) {
  const { index, direction, paginate, goTo, canPrev, canNext, didDrag, dragHandlers } =
    useCarousel(projects.length);
  const project = projects[index];

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ type: 'spring', stiffness: 80, damping: 14 }}
    >
      <div className="relative h-[560px]" style={{ perspective: '1200px' }}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={{
              enter: (dir: number) => ({
                x: dir > 0 ? '60%' : '-60%',
                rotateY: dir > 0 ? -35 : 35,
                opacity: 0,
                scale: 0.9,
              }),
              center: { x: 0, rotateY: 0, opacity: 1, scale: 1 },
              exit: (dir: number) => ({
                x: dir > 0 ? '-60%' : '60%',
                rotateY: dir > 0 ? 35 : -35,
                opacity: 0,
                scale: 0.9,
              }),
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
            {...dragHandlers}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <ProjectCard
              project={project}
              onOpen={() => {
                // A drag that ended on this card shouldn't also open the modal.
                if (didDrag()) return;
                onOpen(project);
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => paginate(-1)}
          disabled={!canPrev}
          className="p-2 rounded-full bg-background border border-input disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent transition-colors"
          aria-label="Previous project"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex gap-2">
          {projects.map((p, i) => (
            <button
              key={p.id}
              onClick={() => goTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === index
                  ? 'bg-primary w-6'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to project ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => paginate(1)}
          disabled={!canNext}
          className="p-2 rounded-full bg-background border border-input disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent transition-colors"
          aria-label="Next project"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}
