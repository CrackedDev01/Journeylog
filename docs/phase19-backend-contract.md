# Phase 19 backend contract

Inspected routes, controllers, services, models and validators before implementing the UI. The working checkout differed from the supplied description: Today and Week were read-only dashboard summaries; MonthlyGoal had no persisted project reference; several Project endpoints contained runtime/aggregation defects.

## Existing routes used

| Method | Path under `/api/v1` | Purpose |
| --- | --- | --- |
| GET / POST | `/projects` | Paginated project list / create |
| GET | `/projects/active` | Planned, active and paused projects for selectors |
| GET | `/projects/summary` | Portfolio status counts; existing route repaired |
| GET / PATCH / DELETE | `/projects/:projectId` | Read / edit / soft archive |
| PATCH | `/projects/:projectId/complete` | Complete project only |
| PATCH | `/projects/:projectId/reopen` | Return to active, clear completion timestamp |
| PATCH | `/projects/:projectId/archive` | Soft archive, retain records and completion history |
| POST | `/projects/:projectId/milestones` | Add embedded milestone |
| PATCH / DELETE | `/projects/:projectId/milestones/:milestoneId` | Edit / remove milestone |
| GET | `/projects/:projectId/tasks` | Paginated standard Tasks |
| GET | `/projects/:projectId/goals` | Linked MonthlyGoals |
| GET | `/projects/:projectId/summary` | Authoritative milestone/task/work/goal metrics |
| GET | `/projects/:projectId/work-summary` | Completed-session aggregation and five recent sessions |
| POST / PATCH | `/goals`, `/goals/:goalId` | Existing goal API owns the project relationship |
| POST | `/tasks` | Standard Task with project and optional projectMilestoneId |

No new HTTP routes were invented. The absent MonthlyGoal project reference was added to the existing schema/service and validates ownership on create/update.

## Fields and meanings

- Project: name, objective, description, category, priority, status, startDate, targetDate, estimatedHours, notes; user and completion timestamps are server managed.
- Project statuses: planned, active, paused, completed, cancelled, archived.
- Priorities: low, medium, high, critical.
- Milestone: title, description, status, targetDate, completedAt, order. Statuses: planned, in_progress, completed, skipped.
- Progress: rounded completed milestones / non-skipped milestones. Null if no non-skipped milestones. This calculation lives in the backend and is returned in list/detail/summary responses.
- List responses include authoritative progress, active/completed milestone counts, overdue flag and actualMinutes. Work is aggregated for the current page in one batch, not fetched once per card.
- Work uses completed WorkSessions owned by the authenticated user, joined through that user's Tasks and Project. Minutes derive from session timestamps, with stored duration as a fallback for records without timestamps. Active/cancelled sessions do not count. Actual effort is never editable on Project.
- Task references: project and projectMilestoneId. Removing a milestone retains Tasks; the UI identifies a removed milestone instead of showing a Mongo ID.
- MonthlyGoal.project is the single persisted relationship. The Project endpoint only reads it.
- DELETE is a soft archive, not permanent removal. Related Tasks, Goals, milestones and work history remain. Repeating the archive is idempotent.
- An unfinished-milestone confirmation affects only Project status; no related entity is auto-completed.
- Default list excludes archived projects; Archived filter retrieves them. Summary counts cover all owned projects, independent of list filters/pagination.
