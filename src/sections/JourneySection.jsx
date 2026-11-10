import React, { useState, useEffect } from 'react';
import { SectionHeader } from '../components/common/SectionHeader';
import { TimelineItem } from '../components/common/TimelineItem';
import { MotionReveal } from '../components/common/MotionReveal';
import { JOURNEY_MILESTONES } from '../data/journeyData';
import { api } from '../services/api';

export const JourneySection = () => {
  const [milestones, setMilestones] = useState(JOURNEY_MILESTONES);

  useEffect(() => {
    let isMounted = true;
    api.education.list()
      .then((res) => {
        const items = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.education)
            ? res.education
            : Array.isArray(res?.data?.education)
              ? res.data.education
              : null;

        if (isMounted && items && items.length > 0) {
          setMilestones(items);
        }
      })
      .catch((_err) => {
        // Retain initial authentic milestones if offline
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

        {milestones.map((milestone, index) => (
          <MotionReveal key={milestone.id} direction="left" delay={0.15 * (index + 1)}>
            <TimelineItem milestone={milestone} />
          </MotionReveal>
        ))}
      </div>
    </section>
  );
};

export default JourneySection;
