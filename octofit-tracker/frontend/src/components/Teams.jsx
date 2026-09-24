import React from 'react';
const [teams = () => {
  const url = 'https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/teams';
  return <div>Teams</div>;
};
export default Teams;
