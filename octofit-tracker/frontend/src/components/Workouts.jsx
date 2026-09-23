import { useEffect, useState } from 'react';
import { apiFetch, collection } from '../api.js';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    apiFetch('/api/workouts/').then(collection).then(setWorkouts).catch(() => setWorkouts([]));
  }, []);

  return <div className="page-wrap">
    <div className="page-intro"><div><span className="section-kicker">PERSONALIZED FOR YOU</span><h2>Workout shelf</h2><p>Pick a session that fits the energy you have today.</p></div></div>
    <div className="workout-grid">{workouts.map((workout, index) => <article className="workout-card" key={workout._id || index}><div className="workout-art"><span>{workout.category === 'Cardio' ? '↗' : '◒'}</span><small>{workout.duration} min</small></div><div className="workout-copy"><div><span className="section-kicker">{workout.category}</span><span className="difficulty">{workout.difficulty}</span></div><h3>{workout.title}</h3><p>{workout.description}</p><button className="text-link">View session <span>→</span></button></div></article>)}{!workouts.length && <p className="empty-state">Workout suggestions will appear here.</p>}</div>
  </div>;
}
