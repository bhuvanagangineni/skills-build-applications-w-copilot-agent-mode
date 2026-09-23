import { useEffect, useState } from 'react';
import { BrowserRouter, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Activities from './components/Activities.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Teams from './components/Teams.jsx';
import Users from './components/Users.jsx';
import Workouts from './components/Workouts.jsx';

const apiRoot = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function Shell({ children }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const current = location.pathname === '/' ? 'Overview' : location.pathname.slice(1);
  const links = [['Overview', '/'], ['Activities', '/activities'], ['Leaderboard', '/leaderboard'], ['Teams', '/teams'], ['Workouts', '/workouts'], ['People', '/users']];
  return <div className="app-shell">
    <aside className={open ? 'sidebar is-open' : 'sidebar'}>
      <div className="brand"><div className="brand-mark">O</div><div><strong>OctoFit</strong><span>TRACKER</span></div></div>
      <div className="profile-chip"><div className="avatar avatar-coral">MC</div><div><strong>Maya Chen</strong><small>Student athlete</small></div><span className="online-dot" /></div>
      <nav>{links.map(([label, path]) => <NavLink key={path} to={path} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><span className={`nav-icon icon-${label.toLowerCase()}`} />{label}</NavLink>)}</nav>
      <div className="sidebar-foot"><div className="streak-card"><span className="flame">✦</span><div><strong>6 day streak</strong><small>Keep the rhythm going</small></div></div><small className="version">OCTOFIT / 01</small></div>
    </aside>
    <main className="main-content"><header className="topbar"><button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle menu">☰</button><div><p className="eyebrow">Mergington High School / {current}</p><h1>{current === 'Overview' ? 'Good morning, Maya' : current}</h1></div><div className="top-actions"><button className="icon-button" aria-label="Notifications">♧<i /></button><div className="top-avatar">MC</div></div></header>{children}</main>
  </div>;
}

function Overview() {
  const [activities, setActivities] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  useEffect(() => { Promise.all([fetch(`${apiRoot}/api/activities/`).then((r) => r.json()), fetch(`${apiRoot}/api/leaderboard/`).then((r) => r.json())]).then(([a, l]) => { setActivities(Array.isArray(a) ? a : a.results || []); setLeaderboard(Array.isArray(l) ? l : l.results || []); }).catch(() => {}); }, []);
  const minutes = activities.reduce((sum, item) => sum + (item.duration || 0), 0);
  return <div className="page-wrap">
    <section className="welcome-banner"><div><span className="label-pill">WEEKLY PULSE</span><h2>Your energy is adding up.</h2><p>You are <strong>38 minutes</strong> away from your weekly movement goal.</p><div className="progress-track"><span style={{ width: '74%' }} /></div><small>112 / 150 minutes <b>74%</b></small></div><div className="banner-orbit"><span>74</span><small>% goal</small></div></section>
    <div className="stats-grid"><Stat label="Move minutes" value={minutes || 112} unit="min" detail="↑ 18% from last week" tone="coral" /><Stat label="Octo points" value="486" unit="pts" detail="Ranked #1 this month" tone="yellow" /><Stat label="Current streak" value="6" unit="days" detail="Personal best: 12 days" tone="blue" /></div>
    <div className="content-grid"><section className="panel activity-panel"><div className="panel-heading"><div><span className="section-kicker">RECENT MOVEMENT</span><h3>Your activity</h3></div><NavLink to="/activities" className="text-link">View all <span>→</span></NavLink></div>{activities.slice(0, 4).map((item) => <ActivityRow key={item._id} item={item} />)}{!activities.length && <Empty text="Log your first activity to see it here." />}</section><section className="panel rank-panel"><div className="panel-heading"><div><span className="section-kicker">THE MONTHLY CLIMB</span><h3>Leaderboard</h3></div><NavLink to="/leaderboard" className="text-link">Full board <span>→</span></NavLink></div>{leaderboard.slice(0, 3).map((entry, index) => <div className="rank-row" key={entry._id}><span className={`rank-number rank-${index + 1}`}>{index + 1}</span><div className="avatar avatar-small">{entry.user?.name?.split(' ').map((n) => n[0]).join('') || '?'}</div><strong>{entry.user?.name || 'Athlete'}</strong><span className="rank-points">{entry.points} <small>pts</small></span></div>)}{!leaderboard.length && <Empty text="Leaderboard appears after seeding MongoDB." />}</section></div>
    <section className="prompt-strip"><div className="prompt-icon">✳</div><div><span className="section-kicker">TODAY'S NUDGE</span><h3>Try a 20-minute reset.</h3><p>A short session counts. Pick something that leaves you feeling better than you started.</p></div><NavLink to="/workouts" className="button button-dark">Find a workout <span>→</span></NavLink></section>
  </div>;
}
function Stat({ label, value, unit, detail, tone }) { return <div className={`stat-card stat-${tone}`}><span>{label}</span><strong>{value}<small>{unit}</small></strong><em>{detail}</em></div>; }
function ActivityRow({ item }) { return <div className="activity-row"><div className="activity-symbol">{item.type === 'Run' ? '↗' : item.type === 'Strength' ? '◒' : item.type === 'Cycle' ? '◌' : '⌁'}</div><div><strong>{item.type}</strong><small>{item.note || 'Logged movement'} / {new Date(item.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</small></div><b>{item.points} <small>pts</small></b></div>; }
function Empty({ text }) { return <p className="empty-state">{text}</p>; }

export default function App() { return <BrowserRouter><Shell><Routes><Route path="/" element={<Overview />} /><Route path="/activities" element={<Activities />} /><Route path="/leaderboard" element={<Leaderboard />} /><Route path="/teams" element={<Teams />} /><Route path="/workouts" element={<Workouts />} /><Route path="/users" element={<Users />} /></Routes></Shell></BrowserRouter>; }