import React, { useState } from 'react'
import { X, RefreshCw } from 'lucide-react'
import Modal from '../common/Modal'
import ConfirmDialog from '../common/ConfirmDialog'
import ProjectForm from './ProjectForm'
import ProjectMilestones from './ProjectMilestones'
import ProjectWorkSummary from './ProjectWorkSummary'
import { ProjectGoalLinks, ProjectTaskLinks } from './ProjectLinks'
import ProjectOverview from './ProjectOverview'
import useProjectDetails from './useProjectDetails'

function Resource({ state, children }) {
  if (!state)
    return (
      <div className="project-detail-loading" role="status">
        Loading…
      </div>
    )
  if (state.error)
    return (
      <p className="projects-inline-error" role="alert">
        {state.error}
      </p>
    )
  return children(state.data)
}
export default function ProjectDetails({ id, onClose, onChanged }) {
  const [editing, setEditing] = useState(false)
  const [confirmation, setConfirmation] = useState(null)
  const { resources, busy, error, refresh, mutate, refreshTasks } =
    useProjectDetails(id, onChanged)
  const project = resources.project?.data?.project
  const summary = resources.summary?.data?.summary
  const changeStatus = (status) => {
    const run = () =>
      status === 'completed'
        ? mutate('completeProject')
        : status === 'active'
          ? mutate('reopenProject')
          : mutate('updateProject', { status })
    const unfinished = project.milestones.filter(
      (m) => !['completed', 'skipped'].includes(m.status),
    ).length
    if (status === 'completed' && unfinished)
      setConfirmation({
        title: 'Complete project?',
        description: `This project still has ${unfinished} unfinished milestone${unfinished === 1 ? '' : 's'}. Mark it completed anyway? Tasks, goals and milestones keep their current status.`,
        label: 'Complete project',
        action: run,
      })
    else if (status === 'archived') archive()
    else run()
  }
  const archive = () =>
    setConfirmation({
      title: 'Archive project?',
      description:
        'This project will leave your default list. Its milestones, goals, tasks and work history remain available in Archived projects.',
      label: 'Archive project',
      action: () => mutate('archiveProject'),
    })
  return (
    <Modal
      className="project-details-dialog"
      onClose={onClose}
      labelledBy="project-details-title"
      busy={busy}
    >
      <div className="project-details-content">
        <header className="project-dialog-header">
          <div>
            <span className="section-eyebrow">PROJECT WORKSPACE</span>
            <h2 id="project-details-title">
              {project?.name || 'Project details'}
            </h2>
          </div>
          <div className="d-flex">
            <button
              className="icon-button"
              aria-label="Refresh project details"
              disabled={busy}
              onClick={refresh}
            >
              <RefreshCw size={18} />
            </button>
            <button
              className="icon-button"
              aria-label="Close project details"
              disabled={busy}
              onClick={onClose}
            >
              <X size={22} />
            </button>
          </div>
        </header>
        <div className="project-details-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <Resource state={resources.project}>
            {() => (
              <>
                <ProjectOverview
                  project={project}
                  work={resources.work}
                  busy={busy}
                  onEdit={() => setEditing(true)}
                  onArchive={archive}
                  onStatusChange={changeStatus}
                />
                <ProjectMilestones
                  project={project}
                  busy={busy}
                  mutate={mutate}
                  confirm={setConfirmation}
                />
                <section className="project-detail-section">
                  <h3>Monthly goals</h3>
                  <Resource state={resources.goals}>
                    {(data) => <ProjectGoalLinks goals={data.goals} />}
                  </Resource>
                </section>
                <section className="project-detail-section">
                  <h3>Execution tasks</h3>
                  <Resource state={resources.tasks}>
                    {(data) => (
                      <ProjectTaskLinks
                        data={data}
                        project={project}
                        metrics={summary?.taskMetrics}
                        busy={busy}
                        onRefresh={refreshTasks}
                      />
                    )}
                  </Resource>
                </section>
              </>
            )}
          </Resource>
          <section className="project-detail-section">
            <h3>Focused work</h3>
            <Resource state={resources.work}>
              {(data) => (
                <ProjectWorkSummary
                  data={data.summary}
                  taskMetrics={summary?.taskMetrics}
                />
              )}
            </Resource>
          </section>
          {resources.summary?.error && (
            <p className="projects-inline-error" role="alert">
              Project summary: {resources.summary.error}
            </p>
          )}
          {Object.values(resources).some((state) => state.error) && (
            <button
              className="btn btn-outline-primary"
              onClick={refresh}
              disabled={busy}
            >
              Retry project details
            </button>
          )}
        </div>
        {editing && (
          <ProjectForm
            project={project}
            onClose={() => setEditing(false)}
            onSave={(data) =>
              mutate('updateProject', data, { throwOnError: true })
            }
          />
        )}
        {confirmation && (
          <ConfirmDialog
            {...confirmation}
            onClose={() => setConfirmation(null)}
          />
        )}
      </div>
    </Modal>
  )
}
