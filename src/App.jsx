// Fix the imports - remove duplicates
import { useState } from 'react';
import './App.css';
import { mockQuestions } from './questions';
import quizBackground from './assets/images/quiz-background.png';

// Componente temporário para Home
const Home = ({ onStartGame }) => (
  <div className="home-container">
    <div className="home-content">
      <h1 className="title">Passa ou Repassa</h1>
      <p className="description">
        Teste seus conhecimentos neste jogo de perguntas e respostas!
      </p>
      <button onClick={onStartGame} className="start-button">
        INICIAR JOGO</button>
    </div>
  </div>
);

// Game component remains the same
const Game = ({ questions: allQuestions, onFinish }) => {
  const [questions] = useState(() => {
    // Randomly shuffle questions at the start
    return [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 20);
  });
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({ team1: 0, team2: 0 });
  const [currentTeam, setCurrentTeam] = useState('team1');
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [questionsPerTeam, setQuestionsPerTeam] = useState({ team1: 0, team2: 0 });

  // Add function to check if game should end
  const shouldEndGame = () => {
    return questionsPerTeam.team1 >= 10 || questionsPerTeam.team2 >= 10;
  };

  const handleNextQuestion = () => {
    const newQuestionsPerTeam = {
      ...questionsPerTeam,
      [currentTeam]: questionsPerTeam[currentTeam] + 1
    };
    setQuestionsPerTeam(newQuestionsPerTeam);

    if (shouldEndGame() || currentQuestionIndex >= questions.length - 1) {
      onFinish(scores);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentTeam(currentTeam === 'team1' ? 'team2' : 'team1');
      setSelectedOption(null);
      setShowResult(false);
    }
  };

  // Add this new function to handle passing
  // Update the handlePass function
  const handlePass = () => {
    const newQuestionsPerTeam = {
      ...questionsPerTeam,
      [currentTeam]: questionsPerTeam[currentTeam] + 1
    };
    setQuestionsPerTeam(newQuestionsPerTeam);

    if (shouldEndGame() || currentQuestionIndex >= questions.length - 1) {
      onFinish(scores);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentTeam(currentTeam === 'team1' ? 'team2' : 'team1');
      setSelectedOption(null);
    }
  };
  
  const handleOptionSelect = (option) => {
    if (!showResult) {
      // If clicking the same option, deselect it
      if (selectedOption === option) {
        setSelectedOption(null);
      } else {
        // Otherwise, select the new option
        setSelectedOption(option);
      }
    }
  };

  const handleAnswer = () => {
    if (selectedOption) {
      const isCorrect = selectedOption === questions[currentQuestionIndex].answer;
      if (isCorrect) {
        handleScore(currentTeam, 10);
      }
      setShowResult(true);
    }
  };
  
  const handleScore = (team, points) => {
    const newScores = { ...scores, [team]: scores[team] + points };
    setScores(newScores);
  };

  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="game-container">
      
      <div className='divisaoTopo'>
        
        <h1 className="game-title">Passa ou Repassa</h1>
        
        <div className="scoreboard">
          <div className={`team ${currentTeam === 'team1' ? 'active' : ''}`}>
            <h3>TIME 1</h3>
            <div className="score">{scores.team1}</div>
          </div>
          <div className={`team ${currentTeam === 'team2' ? 'active' : ''}`}>
            <h3>TIME 2</h3>
            <div className="score">{scores.team2}</div>
          </div>
        </div>

        <div className='subDivisao'>
          <div className="question-progress" style={{visibility: "hidden"}}>
            Pergunta {currentQuestionIndex + 1} / {questions.length}
          </div>
          <div className="questions-per-team">
            <div><span>TIME 1: </span><span className='qualTeam'>{questionsPerTeam.team1} / 10</span></div>
            <div><span>TIME 2: </span><span className='qualTeam'>{questionsPerTeam.team2} / 10</span></div>
          </div>
        </div>
      </div>
      
      <div className="question-card">
        <h2 className='question-card-text'>{currentQuestion.question}</h2>
        <div className="options-container">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionSelect(option)}
              className={`option-button ${selectedOption === option ? 'selected' : ''} ${
                showResult ? (option === currentQuestion.answer ? 'correct' : 'wrong') : ''
              }`}
              disabled={showResult}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="actions">
          {!showResult && (
            <>
              <button 
                onClick={handleAnswer} 
                className="btn confirm"
                disabled={!selectedOption}
              >
                Confirmar
              </button>
              <button 
                onClick={handlePass}
                className="btn pass"
              >
                Passar
              </button>
            </>
          )}
          {showResult && (
            <button onClick={handleNextQuestion} className="btn next">
              Próxima Pergunta
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente temporário para Results
const Results = ({ scores, onRestart }) => {
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
      
      <button onClick={onRestart} className="play-again-button">
        Jogar Novamente
      </button>
    </div>
  );
};

// Keep only one App function - fix the background implementation
function App() {
  const [gameState, setGameState] = useState('home');
  const [finalScores, setFinalScores] = useState({ team1: 0, team2: 0 });
  
  const startGame = () => {
    setGameState('game');
  };
  
  const finishGame = (scores) => {
    setFinalScores(scores);
    setGameState('results');
  };
  
  const restartGame = () => {
    setGameState('home');
  };
  
  return (
    <>
      {/* Imagem de fundo com blur - seguindo o exemplo fornecido */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        display: 'block',
        backgroundImage: `url(${quizBackground})`,
        backgroundSize: '120% 120%', // Aumentado para ter espaço para movimento
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        width: '100%',
        height: '100%',
        WebkitFilter: 'blur(3px)',
        MozFilter: 'blur(3px)',
        OFilter: 'blur(3px)',
        msFilter: 'blur(3px)',
        filter: 'blur(3px)',
        animation: 'backgroundPan 8s linear infinite'
      }}></div>
      
      {/* Overlay escuro */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
      }}></div>
      
      {/* Conteúdo principal com z-index maior */}
      <div style={{
        position: 'relative',
        zIndex: 9999,
        width: '100%',
        height: '100%'
      }} className="app">
        {gameState === 'home' && <Home onStartGame={startGame} className="componentHome"/>}
        {gameState === 'game' && <Game questions={mockQuestions} onFinish={finishGame} className="componentGame"/>}
        {gameState === 'results' && <Results scores={finalScores} onRestart={restartGame} />}
      </div>
    </>
  );
}

export default App;
