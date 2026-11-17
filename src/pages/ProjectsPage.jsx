import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, FolderKanban } from 'lucide-react'
import projectService from '../services/project.service'
import ProjectFilters from '../components/projects/ProjectFilters'
import ProjectSummary from '../components/projects/ProjectSummary'
import ProjectCard from '../components/projects/ProjectCard'
import ProjectForm from '../components/projects/ProjectForm'
import ProjectDetails from '../components/projects/ProjectDetails'
import DashboardSkeleton from '../components/feedback/DashboardSkeleton'
import { STATUSES } from '../components/projects/projectHelpers'
import { formatApiError } from '../utils/formatApiError'
import '../styles/projects.css'

export default function ProjectsPage() {
  const [params, setParams] = useSearchParams(),
    [filter, setFilter] = useState(''),
    [priority, setPriority] = useState(''),
    [page, setPage] = useState(1),
    [version, setVersion] = useState(0)
  const [list, setList] = useState(null),
    [summary, setSummary] = useState(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(''),
    [summaryError, setSummaryError] = useState(''),
    [creating, setCreating] = useState(false),
    [notice, setNotice] = useState('')
  const request = useRef(0),
    selected = params.get('project')
  const load = useCallback(async () => {
    const current = ++request.current
    setLoading(true)
    setError('')
    setSummaryError('')
    const results = await Promise.allSettled([
      projectService.getProjects({
        status: filter || undefined,
        priority: priority || undefined,
        page,
        limit: 12,
      }),
      projectService.getSummary(),
    ])
    if (current !== request.current) return
    if (results[0].status === 'fulfilled') {
      const data = results[0].value
      if (page > 1 && !data.projects.length) {
        setPage(page - 1)
      } else setList(data)
    } else setError(formatApiError(results[0].reason))
    if (results[1].status === 'fulfilled') setSummary(results[1].value.summary)
    else setSummaryError(formatApiError(results[1].reason))
    setLoading(false)
  }, [filter, priority, page])
  useEffect(() => {
    load()
    return () => {
      request.current++
    }
  }, [load, version])
  const refresh = async () => {
    setVersion((v) => v + 1)
  }
  const open = (id) => setParams({ project: id })
  const create = async (data) => {
    const { project } = await projectService.createProject(data)
    setFilter('')
    setPriority('')
    setPage(1)
    setNotice('Project created.')
    await refresh()
    open(project._id)
  }
  return (
    <div className="projects-page">
      <header className="projects-header">
        <div>
          <span className="section-eyebrow">MEANINGFUL WORK</span>
          <h1>
            Projects<span className="heading-period">.</span>
          </h1>
          <p>Turn larger outcomes into milestones and focused execution.</p>
        </div>
        <button
          id="new-project-button"
          className="btn btn-primary"
          onClick={() => setCreating(true)}
        >
          <Plus size={17} />
          New project
        </button>
      </header>
      {notice && (
        <p className="project-notice" role="status">
          {notice}
          <button
            type="button"
            className="btn btn-link btn-sm"
            onClick={() => setNotice('')}
          >
            Dismiss
          </button>
        </p>
      )}
      <ProjectSummary summary={summary} error={summaryError} retry={load} />
      <ProjectFilters
        filter={filter}
        priority={priority}
        onStatusChange={(value) => {
          setFilter(value)
          setPage(1)
        }}
        onPriorityChange={(value) => {
          setPriority(value)
          setPage(1)
        }}
      />
      {loading ? (
        <DashboardSkeleton label="Loading projects" />
      ) : error ? (
        <div className="dashboard-message" role="alert">
          <div>
            <h2>Unable to load projects</h2>
            <p>{error}</p>
            <button className="btn btn-outline-primary" onClick={load}>
              Retry
            </button>
          </div>
        </div>
      ) : list?.projects.length ? (
        <>
          <div className="projects-grid">
            {list.projects.map((project) => (
              <ProjectCard key={project._id} project={project} onOpen={open} />
            ))}
          </div>
          <div className="project-pagination">
            <span>
              {list.count} project{list.count === 1 ? '' : 's'}
            </span>
            {list.pages > 1 && (
              <>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </button>
                <span>
                  {page} / {list.pages}
                </span>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled={page >= list.pages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        <section className="project-empty">
          <FolderKanban size={32} aria-hidden="true" />
          <h2>
            {summary?.total === 0
              ? 'No projects yet'
              : `No ${filter ? STATUSES[filter].toLowerCase() + ' ' : ''}projects${priority ? ' with this priority' : ''}.`}
          </h2>
          <p>
            {summary?.total === 0
              ? 'Projects help you organize larger outcomes into milestones and focused execution.'
              : 'Try another filter, or create a project for your next larger outcome.'}
          </p>
          <button className="btn btn-primary" onClick={() => setCreating(true)}>
            <Plus size={16} />
            Create project
          </button>
          {(filter || priority) && (
            <button
              className="btn btn-link"
              onClick={() => {
                setFilter('')
                setPriority('')
                setPage(1)
              }}
            >
              Clear filters
            </button>
          )}
        </section>
      )}
      {creating && (
        <ProjectForm onClose={() => setCreating(false)} onSave={create} />
      )}
      {selected && !creating && (
        <ProjectDetails
          key={selected}
          id={selected}
          onClose={() => {
            setParams({})
            requestAnimationFrame(() => {
              const target = [
                ...document.querySelectorAll('[data-project-id]'),
              ].find((element) => element.dataset.projectId === selected)
              ;(
                target || document.getElementById('new-project-button')
              )?.focus()
            })
          }}
          onChanged={refresh}
        />
      )}
    </div>
  )
}
