import { useGame } from '../context/GameContext';
import '../assets/styles/Results.css';

const Results = () => {
  const { scores, startGame } = useGame();
  
  const winner = scores.team1 > scores.team2 
    ? 'Time 1' 
    : scores.team2 > scores.team1 
      ? 'Time 2' 
      : 'Empate';

  return (
    <div className="results-container">
      <h1 className="results-title">Fim de Jogo!</h1>
      
      <div className="final-scores">
        <div className="team-score">
          <h2>Time 1</h2>
          <p className="score">{scores.team1}</p>
        </div>
        <div className="team-score">
          <h2>Time 2</h2>
          <p className="score">{scores.team2}</p>
        </div>
      </div>
      
      {winner !== 'Empate' ? (
        <h2 className="winner-announcement">O vencedor é: {winner}!</h2>
      ) : (
        <h2 className="winner-announcement">O jogo terminou em empate!</h2>
      )}
      
      <button onClick={startGame} className="play-again-button">
        Jogar Novamente
      </button>
    </div>
  );
};

export default Results;