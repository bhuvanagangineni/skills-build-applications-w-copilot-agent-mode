import { useEffect, useState } from 'react';
import { apiFetch, collection } from '../api.js';

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    apiFetch('/api/users/').then(collection).then(setUsers).catch(() => setUsers([]));
  }, []);

  return <div className="page-wrap">
    <div className="page-intro"><div><span className="section-kicker">THE COMMUNITY</span><h2>People</h2><p>Meet the students making movement part of their week.</p></div></div>
    <div className="people-grid">{users.map((user, index) => <article className="person-card" key={user._id || index}><div className="avatar avatar-large">{user.name?.split(' ').map((name) => name[0]).join('') || '?'}</div><h3>{user.name || 'Athlete'}</h3><p>{user.email}</p><span>Goal: {user.weeklyGoal || 0} min / week</span></article>)}{!users.length && <p className="empty-state">No people have been added yet.</p>}</div>
  </div>;
}
