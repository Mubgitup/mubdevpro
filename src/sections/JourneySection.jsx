import React from 'react';
import { SectionHeader } from '../components/common/SectionHeader';
import { TimelineItem } from '../components/common/TimelineItem';
import { JOURNEY_MILESTONES } from '../data/journeyData';

export const JourneySection = () => {
  return (
    <section className="section-container section-py" id="journey">
      <SectionHeader
        badge="Evolution & Milestones"
        title="Education & Learning"
        highlightText="Journey"
        subtitle="A chronological timeline of my formal academic studies, intensive coursework, and hands-on coding milestones."
      />

      <div className="timeline-wrapper">
        <div className="timeline-track" aria-hidden="true" />

        {JOURNEY_MILESTONES.map((milestone) => (
          <TimelineItem key={milestone.id} milestone={milestone} />
        ))}
      </div>
    </section>
  );
};

export default JourneySection;
