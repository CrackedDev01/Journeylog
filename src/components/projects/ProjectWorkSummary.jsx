import React from 'react'
import { Clock3 } from 'lucide-react'
import { minutes, dateLabel, label } from './projectHelpers'
export default function ProjectWorkSummary({ data, taskMetrics }) {
  return (
    <>
      <dl className="project-work-metrics">
        <div>
          <dt>Actual work</dt>
          <dd>{minutes(data.actualMinutes)}</dd>
        </div>
        <div>
          <dt>Work sessions</dt>
          <dd>{data.totalWorkSessions}</dd>
        </div>
        <div>
          <dt>Tasks worked on</dt>
          <dd>{data.tasksWorkedOn}</dd>
        </div>
        <div>
          <dt>Completed tasks</dt>
          <dd>{taskMetrics?.completedTasks ?? '—'}</dd>
        </div>
      </dl>
      <p className="project-small">
        Derived from completed work sessions on this project’s tasks. Estimated
        effort:{' '}
        {data.estimatedHours == null ? 'not set' : `${data.estimatedHours}h`}.
      </p>
      {data.totalWorkSessions === 0 && (
        <p className="project-section-empty">
          No completed work sessions yet. Time recorded on linked tasks will
          appear here.
        </p>
      )}
      {!!data.recentSessions?.length && (
        <>
          <h4 className="project-subheading">Recent work</h4>
          <ul className="project-linked-list">
            {data.recentSessions.map((session) => (
              <li key={session._id}>
                <Clock3 size={16} aria-hidden="true" />
                <div>
                  <strong>{session.taskTitle || session.title}</strong>
                  <span>
                    {label(session.sessionType)} ·{' '}
                    {dateLabel(session.startedAt)}
                  </span>
                </div>
                <span>{minutes(session.durationMinutes)}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}
