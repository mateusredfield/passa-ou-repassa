import { useGame } from '../context/GameContext';
import QuestionCard from '../components/QuestionCard';
import Scoreboard from '../components/Scoreboard';
import '../assets/styles/Game.css';

const Game = () => {
  const { currentQuestionIndex, questions } = useGame();

  return (
    <div className="game-container">
      <h1 className="game-title">Passa ou Repassa</h1>
      <Scoreboard />
      <div className="question-progress">
        Pergunta {currentQuestionIndex + 1} de {questions.length}
      </div>
      <QuestionCard />
    </div>
  );
};

export default Game;