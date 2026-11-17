import React, { useState, useEffect, useCallback } from 'react'
import DashboardSkeleton from '../components/feedback/DashboardSkeleton'
import MonthHeader from '../components/month/MonthHeader'
import MonthlySummaryCard from '../components/month/MonthlySummaryCard'
import MonthlyGoalsSection from '../components/month/MonthlyGoalsSection'
import GoalAttentionCard from '../components/month/GoalAttentionCard'
import MonthlyExecutionSummary from '../components/month/MonthlyExecutionSummary'
import MonthlyWeeklyBreakdown from '../components/month/MonthlyWeeklyBreakdown'
import MonthlyReviewCard from '../components/month/MonthlyReviewCard'
import MonthlyGoalForm from '../components/month/MonthlyGoalForm'
import GoalProgressModal from '../components/month/GoalProgressModal'
import MonthlyReviewForm from '../components/month/MonthlyReviewForm'

import goalService from '../services/goal.service'
import monthlyReviewService from '../services/monthlyReview.service'
import dashboardService from '../services/dashboard.service'
import { formatApiError } from '../utils/formatApiError'
import { getMonthName } from '../utils/dateFormat'
import '../styles/month.css'

const MonthPage = () => {
  const currentDate = new Date()
  const [year, setYear] = useState(currentDate.getFullYear())
  const [month, setMonth] = useState(currentDate.getMonth() + 1) // 1-12

  const isCurrentMonth = year === currentDate.getFullYear() && month === (currentDate.getMonth() + 1)

  // Data states
  const [goals, setGoals] = useState([])
  const [summary, setSummary] = useState(null)
  const [monthData, setMonthData] = useState(null)
  const [review, setReview] = useState(null)
  const [reviewPreview, setReviewPreview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Modal states
  const [goalModalOpen, setGoalModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [progressModalOpen, setProgressModalOpen] = useState(false)
  const [selectedGoalForProgress, setSelectedGoalForProgress] = useState(null)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)

  // Fetch all monthly data
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      // Fetch goals and summary for selected year & month
      const goalsRes = await goalService.getGoals({ year, month })
      const goalsList = goalsRes?.data?.goals || goalsRes?.goals || []
      setGoals(goalsList)

      // Fetch goal summary
      try {
        const summaryRes = await goalService.getGoalSummary({ year, month })
        const summaryObj = summaryRes?.data?.summary?.[0] || summaryRes?.summary?.[0] || null
        setSummary(summaryObj ? {
          total: summaryObj.totalGoals,
          completed: summaryObj.completedGoals,
          inProgress: summaryObj.inProgressGoals,
          notStarted: summaryObj.notStartedGoals,
          paused: summaryObj.pausedGoals
        } : null)
      } catch (err) {
        // Fallback summary computation from goals array
        setSummary({
          total: goalsList.length,
          completed: goalsList.filter(g => g.status === 'completed' || (g.progress ?? 0) >= 100).length,
          inProgress: goalsList.filter(g => g.status === 'in_progress').length,
          notStarted: goalsList.filter(g => g.status === 'not_started').length,
          paused: goalsList.filter(g => g.status === 'paused').length,
        })
      }

      // Fetch dashboard month data
      try {
        const dashRes = await dashboardService.getMonth()
        const dashData = dashRes?.data?.data || dashRes?.data || null
        setMonthData(dashData)
      } catch (err) {
        console.warn('Dashboard month data error:', err)
      }

      // Fetch monthly review for selected month
      try {
        const reviewRes = await monthlyReviewService.getMonthlyReviewByMonth(year, month)
        setReview(reviewRes?.data?.review || reviewRes?.review || null)
      } catch (err) {
        // 404 is normal if user hasn't created a review yet
        setReview(null)
      }

      // Fetch review preview (for weekly breakdown and metrics)
      try {
        const previewRes = await monthlyReviewService.getPreviewByMonth(year, month)
        setReviewPreview(previewRes?.data?.preview || previewRes?.preview || null)
      } catch (err) {
        setReviewPreview(null)
      }

    } catch (err) {
      console.error('Error loading month page data:', err)
      setError(formatApiError(err))
    } finally {
      setLoading(false)
    }
  }, [year, month])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Navigation handlers
  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12)
      setYear(prev => prev - 1)
    } else {
      setMonth(prev => prev - 1)
    }
  }

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1)
      setYear(prev => prev + 1)
    } else {
      setMonth(prev => prev + 1)
    }
  }

  const handleCurrentMonth = () => {
    setYear(currentDate.getFullYear())
    setMonth(currentDate.getMonth() + 1)
  }

  // Goal operations
  const handleOpenNewGoalModal = () => {
    setEditingGoal(null)
    setGoalModalOpen(true)
  }

  const handleEditGoal = (goal) => {
    setEditingGoal(goal)
    setGoalModalOpen(true)
  }

  const handleSaveGoal = async (payload, goalId) => {
    if (goalId) {
      await goalService.updateGoal(goalId, payload)
    } else {
      await goalService.createGoal(payload)
    }
    await fetchData()
  }

  const handleDeleteGoal = async (goalId) => {
    await goalService.deleteGoal(goalId)
    await fetchData()
  }

  // Progress update operations
  const handleOpenProgressModal = (goal) => {
    setSelectedGoalForProgress(goal)
    setProgressModalOpen(true)
  }

  const handleSubmitProgress = async (goalId, { currentValue, status }) => {
    await goalService.updateGoalProgress(goalId, { currentValue })
    if (status) {
      await goalService.updateGoal(goalId, { status })
    }
    await fetchData()
  }

  // Milestone operations
  const handleToggleMilestone = async (goalId, milestoneId, completed) => {
    await goalService.updateMilestone(goalId, milestoneId, { completed })
    await fetchData()
  }

  const handleAddMilestone = async (goalId, title) => {
    await goalService.addMilestone(goalId, { title })
    await fetchData()
  }

  const handleDeleteMilestone = async (goalId, milestoneId) => {
    await goalService.deleteMilestone(goalId, milestoneId)
    await fetchData()
  }

  // Review operations
  const handleOpenReviewModal = () => {
    setReviewModalOpen(true)
  }

  const handleSaveReview = async (payload, reviewId) => {
    if (reviewId) {
      await monthlyReviewService.updateMonthlyReview(reviewId, payload)
    } else {
      await monthlyReviewService.createMonthlyReview(payload)
    }
    await fetchData()
  }

  const handleDeleteReview = async (reviewId) => {
    await monthlyReviewService.deleteMonthlyReview(reviewId)
    await fetchData()
  }

  const handleRefreshSnapshot = async (reviewId) => {
    await monthlyReviewService.refreshSnapshot(reviewId)
    await fetchData()
  }

  // Determine weekly breakdown from review snapshot or preview
  const weeklyBreakdown = review?.snapshot?.weeklyBreakdown || reviewPreview?.snapshot?.weeklyBreakdown || []

  return (
    <div className="month-page container-fluid">
      {/* Header */}
      <MonthHeader
        year={year}
        month={month}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onCurrentMonth={handleCurrentMonth}
        isCurrentMonth={isCurrentMonth}
        onOpenNewGoalModal={handleOpenNewGoalModal}
        onToggleReview={handleOpenReviewModal}
        hasReview={Boolean(review?._id)}
      />

      {loading ? (
        <DashboardSkeleton label="Loading your monthly goals and review" />
      ) : error ? (
        <div className="dashboard-message" role="alert"><div>
          <h2>Unable to load monthly data</h2>
          <p className="small mb-3">{error}</p>
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={fetchData}>
            Try again
          </button>
        </div></div>
      ) : (
        <>
          {/* Top Monthly Summary Cards */}
          <MonthlySummaryCard
            summary={summary}
            monthData={monthData}
          />

          {/* Monthly Goals Section (Grid & Filters) */}
          <div className="my-4">
            <MonthlyGoalsSection
              goals={goals}
              onOpenNewGoalModal={handleOpenNewGoalModal}
              onEditGoal={handleEditGoal}
              onDeleteGoal={handleDeleteGoal}
              onOpenProgressModal={handleOpenProgressModal}
              onToggleMilestone={handleToggleMilestone}
              onAddMilestone={handleAddMilestone}
              onDeleteMilestone={handleDeleteMilestone}
            />
          </div>

          {/* Attention & Focus Signals */}
          <div className="my-4">
            <GoalAttentionCard
              goals={goals}
              onOpenProgressModal={handleOpenProgressModal}
            />
          </div>

          {/* Execution & Habits Breakdown */}
          <div className="my-4">
            <MonthlyExecutionSummary
              monthData={monthData}
            />
          </div>

          {/* Weekly Rhythm / Cadence Breakdown */}
          {weeklyBreakdown.length > 0 && (
            <div className="my-4">
              <MonthlyWeeklyBreakdown
                weeklyBreakdown={weeklyBreakdown}
              />
            </div>
          )}

          {/* Monthly Review Section */}
          <div className="my-4">
            <MonthlyReviewCard
              review={review}
              onOpenReviewModal={handleOpenReviewModal}
              onDeleteReview={handleDeleteReview}
              year={year}
              monthName={getMonthName(month)}
            />
          </div>
        </>
      )}

      {/* Goal Create/Edit Modal */}
      <MonthlyGoalForm
        isOpen={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        onSubmit={handleSaveGoal}
        initialGoal={editingGoal}
        year={year}
        month={month}
      />

      {/* Goal Quick Progress Modal */}
      <GoalProgressModal
        isOpen={progressModalOpen}
        onClose={() => setProgressModalOpen(false)}
        onSubmit={handleSubmitProgress}
        goal={selectedGoalForProgress}
      />

      {/* Monthly Review Modal */}
      <MonthlyReviewForm
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSubmit={handleSaveReview}
        onRefreshSnapshot={handleRefreshSnapshot}
        initialReview={review}
        year={year}
        month={month}
      />
    </div>
  )
}

export default MonthPage
