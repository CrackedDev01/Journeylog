import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import Modal from '../common/Modal'
import taskService from '../../services/task.service'
import { dateLabel, label } from './projectHelpers'
import { formatApiError } from '../../utils/formatApiError'
export function ProjectGoalLinks({ goals }) {
  if (!goals.length)
    return (
      <p className="project-section-empty">
        No linked monthly goals. Choose this project when creating or editing a
        goal in your Month workspace.
      </p>
    )
  return (
    <ul className="project-linked-list">
      {goals.map((goal) => (
        <li key={goal._id}>
          <div>
            <strong>{goal.title}</strong>
            <span>
              {new Date(goal.year, goal.month - 1).toLocaleDateString(
                undefined,
                { month: 'long', year: 'numeric' },
              )}{' '}
              · {label(goal.status)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}
export function ProjectTaskLinks({ data, project, metrics, onRefresh, busy }) {
  const [adding, setAdding] = useState(false)
  const page = data.page || 1
  const milestones = new Map(project.milestones.map((m) => [m._id, m.title]))
  return (
    <>
      <div className="project-task-heading">
        <p className="project-small">
          {metrics
            ? `${metrics.totalTasks} total · ${metrics.completedTasks} completed · ${metrics.inProgressTasks} in progress · ${metrics.plannedTasks} planned`
            : `${data.count} tasks`}
        </p>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => setAdding(true)}
          disabled={busy}
        >
          <Plus size={15} />
          Add task
        </button>
      </div>
      {!data.tasks.length ? (
        <p className="project-section-empty">
          No tasks linked yet. Add the next concrete step for this project.
        </p>
      ) : (
        <ul className="project-linked-list">
          {data.tasks.map((task) => (
            <li key={task._id}>
              <div>
                <strong>{task.title}</strong>
                <span>
                  {label(task.priority)} · {label(task.status)} ·{' '}
                  {dateLabel(task.date)}
                </span>
                {task.projectMilestoneId && (
                  <span>
                    Milestone:{' '}
                    {milestones.get(String(task.projectMilestoneId)) ||
                      'Removed milestone'}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {data.pages > 1 && (
        <div className="project-pagination">
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={busy || page <= 1}
            onClick={() => {
              onRefresh(page - 1)
            }}
          >
            Previous tasks
          </button>
          <span>
            {page} / {data.pages}
          </span>
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={busy || page >= data.pages}
            onClick={() => {
              onRefresh(page + 1)
            }}
          >
            Next tasks
          </button>
        </div>
      )}
      {adding && (
        <ProjectTaskForm
          project={project}
          onClose={() => setAdding(false)}
          onSave={async () => {
            await onRefresh(1)
          }}
        />
      )}
    </>
  )
}
function ProjectTaskForm({ project, onClose, onSave }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState('')
  const submit = async (event) => {
    event.preventDefault()
    if (busy) return
    const data = Object.fromEntries(new FormData(event.currentTarget))
    data.title = data.title.trim()
    if (!data.title) {
      setError('Enter a task title.')
      return
    }
    if (!data.projectMilestoneId) delete data.projectMilestoneId
    data.project = project._id
    setBusy(true)
    setError('')
    try {
      await taskService.createTask(data)
      await onSave()
      onClose()
    } catch (err) {
      setError(formatApiError(err))
    } finally {
      setBusy(false)
    }
  }
  return (
    <Modal
      onClose={onClose}
      labelledBy="project-task-heading"
      busy={busy}
      className="project-form-dialog"
    >
      <div className="project-dialog-content">
        <header className="project-dialog-header">
          <h2 id="project-task-heading">Add project task</h2>
          <button
            className="icon-button"
            disabled={busy}
            aria-label="Close task form"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>
        <form onSubmit={submit}>
          <fieldset className="project-form-fields" disabled={busy}>
            {error && (
              <div role="alert" className="alert alert-danger">
                {error}
              </div>
            )}
            <p className="project-small">Project: {project.name}</p>
            <label htmlFor="pt-title">Task title</label>
            <input
              id="pt-title"
              name="title"
              maxLength={200}
              className="form-control"
              required
              autoFocus
            />
            <label htmlFor="pt-date">Date</label>
            <input
              id="pt-date"
              name="date"
              type="date"
              className="form-control"
              required
              defaultValue={new Date().toLocaleDateString('en-CA')}
            />
            <label htmlFor="pt-priority">Priority</label>
            <select
              id="pt-priority"
              name="priority"
              className="form-select"
              defaultValue="important"
            >
              <option value="must_do">Must do</option>
              <option value="important">Important</option>
              <option value="optional">Optional</option>
            </select>
            <label htmlFor="pt-milestone">Milestone (optional)</label>
            <select
              id="pt-milestone"
              name="projectMilestoneId"
              className="form-select"
            >
              <option value="">No milestone</option>
              {project.milestones.map((m) => (
                <option value={m._id} key={m._id}>
                  {m.title}
                </option>
              ))}
            </select>
          </fieldset>
          <footer className="project-dialog-footer">
            <button
              className="btn btn-outline-secondary"
              type="button"
              disabled={busy}
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="btn btn-primary" disabled={busy}>
              {busy ? 'Saving…' : 'Create task'}
            </button>
          </footer>
        </form>
      </div>
    </Modal>
  )
}
