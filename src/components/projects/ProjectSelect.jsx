import React, { useEffect, useState } from 'react'
import projectService from '../../services/project.service'
import { formatApiError } from '../../utils/formatApiError'
export default function ProjectSelect({ value, onChange }) {
  const [projects, setProjects] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(''),
    [retry, setRetry] = useState(0)
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    ;(async () => {
      try {
        const data = await projectService.getActiveProjects()
        let items = data.projects
        if (value && !items.some((p) => p._id === value)) {
          const result = await projectService.getProject(value)
          items = [...items, result.project]
        }
        if (active) setProjects(items)
      } catch (err) {
        if (active) setError(formatApiError(err))
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [retry, value])
  return (
    <div className="mb-3">
      <label
        className="form-label small fw-semibold"
        htmlFor="goal-project-link"
      >
        Project (optional)
      </label>
      <select
        id="goal-project-link"
        className="form-select"
        value={value}
        disabled={loading || Boolean(error)}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{loading ? 'Loading projects…' : 'No project'}</option>
        {value && !projects.some((p) => p._id === value) && (
          <option value={value}>Linked project</option>
        )}
        {projects.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-danger small" role="alert">
          Unable to load projects. {error}{' '}
          <button
            className="btn btn-link btn-sm"
            type="button"
            onClick={() => setRetry((v) => v + 1)}
          >
            Retry projects
          </button>
        </p>
      )}
    </div>
  )
}
