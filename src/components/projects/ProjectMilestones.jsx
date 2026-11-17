import React, { useState } from 'react'
import { Plus, Pencil, Trash2, CircleCheck } from 'lucide-react'
import ProjectMilestoneForm from './ProjectMilestoneForm'
import { MILESTONE_STATUSES, dateLabel } from './projectHelpers'
export default function ProjectMilestones({ project, busy, mutate, confirm }) {
  const [form, setForm] = useState(null)
  const milestones = [...project.milestones].sort(
    (a, b) =>
      a.order - b.order || new Date(a.createdAt) - new Date(b.createdAt),
  )
  return (
    <section
      className="project-detail-section"
      aria-labelledby="project-milestones-heading"
    >
      <div className="project-section-heading">
        <h3 id="project-milestones-heading">
          Milestones <span>{milestones.length}</span>
        </h3>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => setForm({})}
          disabled={busy}
        >
          <Plus size={15} />
          Add milestone
        </button>
      </div>
      {!milestones.length && (
        <p className="project-section-empty">
          No milestones yet. Define a few clear steps toward your outcome.
        </p>
      )}
      <ol className="project-milestone-list">
        {milestones.map((m) => (
          <li key={m._id}>
            <div className="project-milestone-title">
              <CircleCheck
                size={18}
                aria-hidden="true"
                className={
                  m.status === 'completed' ? 'text-success' : 'text-secondary'
                }
              />
              <div>
                <h4>{m.title}</h4>
                {m.description && <p>{m.description}</p>}
                <p className="project-small">
                  Order {m.order}
                  {m.targetDate && ` · Target ${dateLabel(m.targetDate)}`}
                  {m.completedAt && ` · Completed ${dateLabel(m.completedAt)}`}
                </p>
              </div>
            </div>
            <div className="project-milestone-actions">
              <select
                className="form-select form-select-sm"
                aria-label={`Status for ${m.title}`}
                value={m.status}
                disabled={busy}
                onChange={(event) =>
                  mutate('updateMilestone', m._id, {
                    status: event.target.value,
                  })
                }
              >
                {Object.entries(MILESTONE_STATUSES).map(([key, text]) => (
                  <option key={key} value={key}>
                    {text}
                  </option>
                ))}
              </select>
              <button
                className="icon-button"
                disabled={busy}
                aria-label={`Edit milestone: ${m.title}`}
                onClick={() => setForm(m)}
              >
                <Pencil size={16} />
              </button>
              <button
                className="icon-button"
                disabled={busy}
                aria-label={`Delete milestone: ${m.title}`}
                onClick={() =>
                  confirm({
                    title: 'Delete milestone?',
                    description: `“${m.title}” will be removed from this project. Linked tasks will remain.`,
                    action: () => mutate('deleteMilestone', m._id),
                    label: 'Delete milestone',
                  })
                }
              >
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ol>
      {form && (
        <ProjectMilestoneForm
          milestone={form._id ? form : null}
          nextOrder={
            milestones.length
              ? Math.max(...milestones.map((m) => m.order)) + 1
              : 0
          }
          onClose={() => setForm(null)}
          onSave={(data, id) =>
            mutate(
              id ? 'updateMilestone' : 'addMilestone',
              ...(id ? [id, data] : [data]),
              { throwOnError: true },
            )
          }
        />
      )}
    </section>
  )
}
