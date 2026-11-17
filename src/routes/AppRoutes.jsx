import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import AuthLayout from '../layouts/AuthLayout'
import AppLayout from '../layouts/AppLayout'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import DashboardPage from '../pages/DashboardPage'
import DashboardHomePage from '../pages/DashboardHomePage'
import TodayPage from '../pages/TodayPage'
import WeekPage from '../pages/WeekPage'
import HabitsPage from '../pages/HabitsPage'
import SkillsPage from '../pages/SkillsPage'
import ProjectsPage from '../pages/ProjectsPage'
import MonthPage from '../pages/MonthPage'
import ReviewsPage from '../pages/ReviewsPage'
import SettingsPage from '../pages/SettingsPage'
import NotFoundPage from '../pages/NotFoundPage'


const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/signup" element={<Navigate to="/register" replace />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/app/dashboard" element={<DashboardHomePage />} />
          <Route path="/app/today" element={<TodayPage />} />
          <Route path="/app/week" element={<WeekPage />} />
          <Route path="/app/habits" element={<HabitsPage />} />
          <Route path="/app/skills" element={<SkillsPage />} />
          <Route path="/app/projects" element={<ProjectsPage />} />
          <Route path="/app/reviews" element={<ReviewsPage />} />
          <Route path="/app/settings" element={<SettingsPage />} />
          <Route path="/app/month" element={<MonthPage />} />
          <Route path="/app/:section" element={<DashboardPage />} />
          <Route path="/app/*" element={<NotFoundPage />} />
        </Route>
      </Route>

      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* 404 page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes
