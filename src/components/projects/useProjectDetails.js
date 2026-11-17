import { useEffect, useRef, useState } from 'react'
import projectService from '../../services/project.service'
import { formatApiError } from '../../utils/formatApiError'

export default function useProjectDetails(id, onChanged) {
  const [resources, setResources] = useState({})
  const [version, setVersion] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const lock = useRef(false),
    taskPage = useRef(1)
  useEffect(() => {
    let active = true
    setResources({})
    setError('')
    const requests = {
      project: () => projectService.getProject(id),
      summary: () => projectService.getProjectSummary(id),
      goals: () => projectService.getProjectGoals(id),
      tasks: () =>
        projectService.getProjectTasks(id, {
          limit: 10,
          page: taskPage.current,
        }),
      work: () => projectService.getProjectWorkSummary(id),
    }
    Object.entries(requests).forEach(async ([key, load]) => {
      try {
        const data = await load()
        if (active)
          setResources((previous) => ({ ...previous, [key]: { data } }))
      } catch (err) {
        if (active)
          setResources((previous) => ({
            ...previous,
            [key]: { error: formatApiError(err) },
          }))
      }
    })
    return () => {
      active = false
    }
  }, [id, version])
  const refresh = () => setVersion((value) => value + 1)
  const mutate = async (method, ...args) => {
    let shouldThrow = false
    if (args.at(-1)?.throwOnError) {
      args.pop()
      shouldThrow = true
    }
    if (lock.current) return false
    lock.current = true
    setBusy(true)
    setError('')
    try {
      await projectService[method](id, ...args)
      refresh()
      await onChanged()
      return true
    } catch (err) {
      setError(formatApiError(err))
      if (shouldThrow) throw err
      return false
    } finally {
      lock.current = false
      setBusy(false)
    }
  }
  const refreshTasks = async (page = 1) => {
    taskPage.current = page
    refresh()
    await onChanged()
  }
  return { resources, busy, error, refresh, mutate, refreshTasks }
}
