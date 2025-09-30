import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ICONS
function SvgIcon({ path }: { path: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      width={18}
      height={18}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    </svg>
  )
} 

function IconEye() { return <SvgIcon path="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Zm11 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /> }
function IconDashboard() { return <SvgIcon path="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" /> }
function IconFolder() { return <SvgIcon path="M3 7h5l2 2h11v11H3V7z" /> }
function IconDirectory() { return <SvgIcon path="M4 6h16M4 12h16M4 18h7" /> }
function IconAnalytics() { return <SvgIcon path="M3 3v18h18M7 16l5-5 5 5" /> }
function IconGraph() { return <SvgIcon path="M18 18v-6m0 6v-2m0 2h-2m2 0h-6m-6 0v2m0-2v-4m0 4H4m14 0V4m-2 0h2m-2 0h-4m-4 0v2m0-2V4m0 0H4" /> }
function IconMap() { return <SvgIcon path="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" /> }
function IconAddReport() { return <SvgIcon path="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM9 16H4M12 12H4M12 8H4M16 2v4h4" /> }
function IconUpload() { return <SvgIcon path="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" /> }
function IconSearch() { return <SvgIcon path="M11 19a8 8 0 1 1 5.293-2.707L21 21" /> }
function IconShield() { return <SvgIcon path="M12 3l8 4v6a8 8 0 1 1-16 0V7l8-4z" /> }

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => { setProfileOpen(false) }, [location.pathname])

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const linkStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 8,
    color: '#cbd5e1',
    textDecoration: 'none'
  }

  const activeStyle: React.CSSProperties = {
    ...linkStyle,
    background: 'rgba(255,255,255,0.08)',
    color: 'white',
    fontWeight: 700
  }

  return (
    <aside style={{
      width: 260,
      borderRight: '1px solid rgba(255,255,255,0.12)',
      background: 'rgba(2,6,23,0.6)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <div style={{
        padding: 16,
        borderBottom: '1px solid rgba(255,255,255,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
      }}>
        <IconEye />
        <h2 style={{ margin: 0 }}>Trinetra</h2>
      </div>

      <nav style={{ padding: 12, display: 'grid', gap: 6 }}>
        <NavLink to="/" end style={({ isActive }) => isActive ? activeStyle : linkStyle}>
          <IconDashboard /> <span>Dashboard</span>
        </NavLink>
        <NavLink to="/file-manager" style={({ isActive }) => isActive ? activeStyle : linkStyle}>
          <IconFolder /> <span>File Manager</span>
        </NavLink>
        <NavLink to="/directory" style={({ isActive }) => isActive ? activeStyle : linkStyle}>
          <IconDirectory /> <span>Document Directory</span>
        </NavLink>
        <NavLink to="/station-analytics" style={({ isActive }) => isActive ? activeStyle : linkStyle}>
          <IconAnalytics /> <span>Station Analytics</span>
        </NavLink>
        <NavLink to="/graph-view" style={({ isActive }) => isActive ? activeStyle : linkStyle}>
          <IconGraph /> <span>Knowledge Graph</span>
        </NavLink>
        <NavLink to="/geospatial-view" style={({ isActive }) => isActive ? activeStyle : linkStyle}>
          <IconMap /> <span>Geospatial View</span>
        </NavLink>
        <NavLink to="/add-report" style={({ isActive }) => isActive ? activeStyle : linkStyle}>
          <IconAddReport /> <span>Add Report</span>
        </NavLink>
        <NavLink to="/upload" style={({ isActive }) => isActive ? activeStyle : linkStyle}>
          <IconUpload /> <span>Upload</span>
        </NavLink>
        <NavLink to="/search" style={({ isActive }) => isActive ? activeStyle : linkStyle}>
          <IconSearch /> <span>Search</span>
        </NavLink>
        <NavLink to="/admin" style={({ isActive }) => isActive ? activeStyle : linkStyle}>
          <IconShield /> <span>Admin</span>
        </NavLink>
      </nav>

      <div style={{ marginTop: 'auto', padding: 12, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
        {profileOpen && (
          <div style={{
            padding: 12, borderRadius: 12,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            marginBottom: 10
          }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>User Profile</div>
            <div style={{ display: 'grid', gap: 6, fontSize: 13 }}>
              <Row label="UID" value={user?.uid || '-'} mono />
              <Row label="Username" value={user?.username || '-'} />
              <Row label="Email" value={user?.email || '-'} />
              <Row label="Organization" value={user?.organization || '-'} />
            </div>
            <button
              onClick={handleLogout}
              style={{
                width: '100%', marginTop: 12, padding: '8px 10px',
                borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)',
                background: '#2563eb', color: 'white', fontWeight: 700
              }}
            >
              Logout
            </button>
          </div>
        )}

        <button
          onClick={() => setProfileOpen(v => !v)}
          aria-expanded={profileOpen}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            width: '100%', background: 'transparent', border: 'none',
            padding: 6, cursor: 'pointer', color: 'inherit'
          }}
        >
          <img src={user?.avatarUrl} alt="avatar" style={{ width: 36, height: 36, borderRadius: 9999 }} />
          <div style={{ textAlign: 'left', minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.displayName}
            </div>
            <div style={{ color: '#94a3b8', fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </div>
          </div>
        </button>
      </div>
    </aside>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 8, alignItems: 'start', minWidth: 0 }}>
      <div style={{ color: '#94a3b8' }}>{label}</div>
      <div style={{
        fontFamily: mono ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' : undefined,
        overflowWrap: 'anywhere', wordBreak: 'break-word', minWidth: 0
      }}>
        {value}
      </div>
    </div>
  )
}