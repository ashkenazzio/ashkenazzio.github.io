'use client';

import type { Project } from '@/types/project';

interface ProjectCaseStudyProps {
  project: Project;
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div className="space-y-1.5">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">
        {title}
      </h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

/**
 * The textual half of the modal: headline metrics, a structured
 * Problem/Approach/Outcome case study (falling back to the short description
 * when no case study exists), and grouped tech detail.
 */
export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const { caseStudy, metrics, techStack, tags, description } = project;
  const hasCaseStudy =
    !!caseStudy && (caseStudy.problem || caseStudy.approach || caseStudy.outcome);

  return (
    <div className="space-y-6">
      {/* Metrics */}
      {metrics && metrics.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {metrics.map(metric => (
            <div
              key={metric.label}
              className="flex-1 min-w-[120px] rounded-lg border border-border bg-muted/40 px-4 py-3"
            >
              <div className="text-2xl font-bold text-primary">{metric.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Case study (or fallback to description) */}
      {hasCaseStudy ? (
        <div className="space-y-5">
          {caseStudy!.problem && <Section title="Problem" body={caseStudy!.problem} />}
          {caseStudy!.approach && (
            <Section title="Approach" body={caseStudy!.approach} />
          )}
          {caseStudy!.outcome && <Section title="Outcome" body={caseStudy!.outcome} />}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}

      {/* Tech detail */}
      {techStack && techStack.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">
            Tech stack
          </h4>
          <div className="space-y-2.5">
            {techStack.map(group => (
              <div key={group.category} className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-foreground/70 w-20 flex-shrink-0">
                  {group.category}
                </span>
                <div className="flex flex-wrap gap-2">
                  {group.items.map(item => (
                    <span key={item} className="project-tag">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Fall back to the flat tag list when no grouped tech detail exists.
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span key={tag} className="project-tag">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
