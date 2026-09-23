import { useEffect, useState } from 'react';
import { apiFetch, collection } from '../api.js';

export default function Leaderboard() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    apiFetch('/api/leaderboard/').then(collection).then(setRows).catch(() => setRows([]));
  }, []);

  return <div className="page-wrap">
    <div className="page-intro"><div><span className="section-kicker">FRIENDLY COMPETITION</span><h2>Leaderboard</h2><p>See how the community is moving this month.</p></div><span className="filter-chip">This month⌄</span></div>
    <section className="panel leaderboard-large">
      {rows.map((entry, index) => <div className="leader-row" key={entry._id || entry.user?._id || index}><span className="leader-rank">{String(index + 1).padStart(2, '0')}</span><div className="avatar">{entry.user?.name?.split(' ').map((name) => name[0]).join('') || '?'}</div><div className="leader-name"><strong>{entry.user?.name || 'Athlete'}</strong><small>{index === 0 ? 'On a roll' : 'Keep climbing'}</small></div><div className="leader-bar"><span style={{ width: `${Math.min(100, (entry.points / (rows[0]?.points || 1)) * 100)}%` }} /></div><b>{entry.points}<small> pts</small></b><span className={entry.change >= 0 ? 'change up' : 'change down'}>{entry.change >= 0 ? '↑' : '↓'} {Math.abs(entry.change || 0)}</span></div>)}
      {!rows.length && <p className="empty-state">Seed the database to populate the monthly climb.</p>}
    </section>
  </div>;
}
