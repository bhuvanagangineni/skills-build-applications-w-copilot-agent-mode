import { useEffect, useState } from 'react';
import { apiFetch, collection } from '../api.js';

export default function Teams() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    apiFetch('/api/teams/').then(collection).then(setTeams).catch(() => setTeams([]));
  }, []);

  return <div className="page-wrap">
    <div className="page-intro"><div><span className="section-kicker">FIND YOUR PEOPLE</span><h2>Teams</h2><p>Momentum is more fun when it is shared.</p></div><button className="button button-dark">+ Create team</button></div>
    <div className="team-grid">{teams.map((team, index) => <article className="team-card" key={team._id || index} style={{ '--team-color': team.color }}><div className="team-top"><span className="team-mark">✳</span><span>{team.members?.length || 0} members</span></div><h3>{team.name}</h3><p>{team.motto}</p><div className="member-stack">{team.members?.map((member, memberIndex) => <span key={member?._id || memberIndex} className="avatar avatar-tiny">{member?.name?.[0] || '?'}</span>)}</div></article>)}{!teams.length && <p className="empty-state">Your teams will show up here after setup.</p>}</div>
  </div>;
}
