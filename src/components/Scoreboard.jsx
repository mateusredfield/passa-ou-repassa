import { useGame } from '../context/GameContext';
import '../assets/styles/Scoreboard.css';

const Scoreboard = () => {
  const { scores, currentTeam } = useGame();

  return (
    <div className="scoreboard">
      <div className={`team ${currentTeam === 'team1' ? 'active' : ''}`}>
        <h3>Time 1</h3>
        <div className="score">{scores.team1}</div>
      </div>
      <div className={`team ${currentTeam === 'team2' ? 'active' : ''}`}>
        <h3>Time 2</h3>
        <div className="score">{scores.team2}</div>
      </div>
    </div>
  );
};

export default Scoreboard;