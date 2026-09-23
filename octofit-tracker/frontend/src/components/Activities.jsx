import { useEffect, useState } from 'react';
import { apiFetch, collection } from '../api.js';

export default function Activities() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ type: 'Run', duration: 20, points: 40, note: '' });

  const load = () => apiFetch('/api/activities/').then(collection).then(setItems).catch(() => setMessage('Connect the API to load activities.'));

  useEffect(() => {
    load();
  }, []);

  const submit = (event) => {
    event.preventDefault();
    setMessage('');
    apiFetch('/api/activities/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      .then(() => { setMessage('Activity logged. Nice work.'); load(); })
      .catch(() => setMessage('Choose a seeded user before logging an activity.'));
  };

  return <div className="page-wrap">
    <div className="page-intro"><div><span className="section-kicker">THE RECEIPTS</span><h2>Activity log</h2><p>Every session is a vote for the person you are becoming.</p></div><form className="quick-log" onSubmit={submit}><select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}><option>Run</option><option>Walk</option><option>Strength</option><option>Cycle</option><option>Swim</option></select><input type="number" min="1" value={form.duration} onChange={(event) => setForm({ ...form, duration: Number(event.target.value) })} aria-label="Minutes" /><button className="button button-coral">+ Log session</button></form></div>
    {message && <div className="notice">{message}</div>}
    <section className="panel table-panel"><div className="panel-heading"><h3>Recent sessions</h3><span className="count-badge">{items.length} sessions</span></div>{items.map((item, index) => <div className="table-row" key={item._id || index}><div className="activity-symbol">{item.type === 'Run' ? '↗' : '◒'}</div><strong>{item.type}</strong><span>{item.note || 'Movement session'}</span><span>{item.duration} min</span><b>{item.points} pts</b></div>)}{!items.length && <p className="empty-state">No activities yet. Log your first session above.</p>}</section>
  </div>;
}
