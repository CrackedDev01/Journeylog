import React, { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BookOpenCheck, CalendarCheck, CalendarRange, ChartNoAxesCombined, ChevronDown, Repeat2, FolderKanban, GraduationCap, LayoutDashboard, LogOut, SlidersHorizontal, TrendingUp, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { formatDate } from '../utils/dateFormat'
import BrandMark from '../components/common/BrandMark'
import Modal from '../components/common/Modal'
import OfflineBanner from '../components/pwa/OfflineBanner'
import UpdateNotice from '../components/pwa/UpdateNotice'
import './AppLayout.css'

const navigation = [
  { label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
  { label: 'Today', path: '/app/today', icon: CalendarCheck },
  { label: 'Week', path: '/app/week', icon: CalendarRange },
  { label: 'Month', path: '/app/month', icon: ChartNoAxesCombined },
  { label: 'Projects', path: '/app/projects', icon: FolderKanban },
  { label: 'Habits', path: '/app/habits', icon: Repeat2 },
  { label: 'Skills', path: '/app/skills', icon: GraduationCap },
  { label: 'Reviews', path: '/app/reviews', icon: BookOpenCheck },
]

function WorkspaceNavigation({ onNavigate }) {
  return <>
    <div className="sidebar-label">WORKSPACE</div>
    <nav className="sidebar-nav" aria-label="Main navigation">
      {navigation.map(({ label, path, icon: Icon }) => <NavLink key={path} to={path} onClick={onNavigate} end={label === 'Today'} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}><Icon size={19} /><span>{label}</span>{label === 'Today' && <span className="nav-today-dot" />}</NavLink>)}
    </nav>
    <div className="sidebar-bottom">
      <NavLink to="/app/settings" onClick={onNavigate} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}><SlidersHorizontal size={19} /><span>Settings</span></NavLink>
      <div className="sidebar-note"><TrendingUp size={19} /><p>Small steps.<br /><strong>Lasting change.</strong></p></div>
    </div>
  </>
}

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const currentSection = navigation.find((item) => location.pathname === item.path)?.label || 'Settings'
  const formattedDate = formatDate(new Date(), { weekday: 'short', month: 'long', day: 'numeric' })
  const initials = (user?.name || 'Your account').trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
  useEffect(() => {
    document.title = `${currentSection} · JourneyLog`
    const media = window.matchMedia('(min-width: 768px)')
    const closeOnDesktop = () => { if (media.matches) setMenuOpen(false) }
    media.addEventListener('change', closeOnDesktop)
    return () => media.removeEventListener('change', closeOnDesktop)
  }, [currentSection])
  return <div className="app-layout">
    <a href="#main-content" className="skip-link">Skip to content</a>
    <aside className="app-sidebar"><NavLink className="app-brand" to="/app/dashboard"><BrandMark /><span>JourneyLog</span></NavLink><WorkspaceNavigation /></aside>
    <div className="app-workspace">
      <header className="app-topbar">
        <button className="icon-button mobile-menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label="Open navigation" aria-haspopup="dialog" aria-expanded={menuOpen}><Menu size={22} /></button>
        <div className="topbar-location"><span>My workspace</span><span className="topbar-divider">/</span><strong>{currentSection}</strong></div>
        <div className="topbar-date"><CalendarRange size={15} />{formattedDate}</div>
        <div className="dropdown">
          <button className="profile-menu dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label={`Account menu for ${user?.name || 'your account'}`}><span className="avatar">{initials}</span><span className="profile-name">{user?.name || 'Your account'}</span><ChevronDown size={14} /></button>
          <ul className="dropdown-menu dropdown-menu-end profile-dropdown"><li><span className="dropdown-item-text small text-secondary">{user?.email || 'Signed in'}</span></li><li><hr className="dropdown-divider" /></li><li><button className="dropdown-item" type="button" onClick={() => { logout(); navigate('/login', { replace: true }) }}><LogOut size={16} />Sign out</button></li></ul>
        </div>
      </header>
      <main className="app-main" id="main-content" tabIndex={-1}><OfflineBanner /><UpdateNotice /><Outlet /></main>
      <footer className="workspace-footer"><span>JourneyLog</span><span>One day at a time.</span></footer>
    </div>
    {menuOpen && <Modal className="navigation-drawer" onClose={() => setMenuOpen(false)} labelledBy="navigation-title"><div className="drawer-heading"><span id="navigation-title">Your workspace</span><button className="icon-button" aria-label="Close navigation" onClick={() => setMenuOpen(false)}><X size={22} /></button></div><WorkspaceNavigation onNavigate={() => setMenuOpen(false)} /></Modal>}
  </div>
}
