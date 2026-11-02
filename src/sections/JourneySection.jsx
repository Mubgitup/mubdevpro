import React from 'react';
import { SectionHeader } from '../components/common/SectionHeader';
import { TimelineItem } from '../components/common/TimelineItem';
import { MotionReveal } from '../components/common/MotionReveal';
import { JOURNEY_MILESTONES } from '../data/journeyData';

export const JourneySection = () => {
  return (
    <section className="section-container section-py" id="journey">
      <MotionReveal direction="up" delay={0.1}>
        <SectionHeader
          badge="Evolution & Milestones"
          title="Education & Learning"
          highlightText="Journey"
          subtitle="A chronological timeline of my formal academic studies, intensive coursework, and hands-on coding milestones."
        />
      </MotionReveal>

      <div className="timeline-wrapper">
        <div className="timeline-track" aria-hidden="true" />

        {JOURNEY_MILESTONES.map((milestone, index) => (
          <MotionReveal key={milestone.id} direction="left" delay={0.15 * (index + 1)}>
            <TimelineItem milestone={milestone} />
          </MotionReveal>
        ))}
      </div>
    </section>
  );
};

export default JourneySection;
