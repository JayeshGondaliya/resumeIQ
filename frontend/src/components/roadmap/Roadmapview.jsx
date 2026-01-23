import React from 'react';
import { Lock, CheckSquare, BookOpen, ExternalLink, Calendar } from 'lucide-react';

const AccordionItem = ({ title, children }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-5 py-4 text-left hover:bg-muted/50"
      >
        <span>{title}</span>
        <span>{open ? '−' : '+'}</span>
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
};

const RoadmapView = ({ roadmap, isUnlocked }) => {
  if (!isUnlocked) {
    return (
      <div className="glass-card p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          🧭 Interview Preparation Roadmap
        </h2>
        <div className="relative overflow-hidden rounded-2xl bg-muted/50 p-8 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background/80 backdrop-blur-sm" />
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
              <Lock className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Roadmap Locked</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Improve your resume to unlock the personalized interview
              preparation roadmap. Aim for an ATS score of 60 or higher.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
              <span>Required: 60% ATS Score</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 md:p-8">
      <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
        🧭 Interview Preparation Roadmap
      </h2>
      <p className="text-muted-foreground mb-6">
        A 4-week structured plan to ace your interviews
      </p>

      {roadmap.map((week) => (
        <AccordionItem key={week.week} title={`Week ${week.week}: ${week.title}`}>
          {week.topics.map((topic, i) => (
            <div key={i} className="border-l-2 border-accent/30 pl-4 mb-4">
              <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent" />
                {topic.name}
              </h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {topic.subtopics.map((sub) => (
                  <span key={sub} className="px-3 py-1 text-sm bg-muted rounded-full">
                    {sub}
                  </span>
                ))}
              </div>
              <ul className="space-y-1 mb-2">
                {topic.tasks.map((task, t) => (
                  <li key={t} className="flex items-start gap-2 text-sm">
                    <CheckSquare className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-1">
                {topic.resources.map((res, r) => (
                  <li key={r}>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {res.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </AccordionItem>
      ))}
    </div>
  );
};

export default RoadmapView;
