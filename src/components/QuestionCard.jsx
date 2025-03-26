import { useState } from 'react';
import { useGame } from '../context/GameContext';
import '../assets/styles/QuestionCard.css';

const QuestionCard = () => {
  const { currentQuestion, currentTeam, addScore, nextQuestion, passQuestion } = useGame();
  const [showAnswer, setShowAnswer] = useState(false);
  const [answered, setAnswered] = useState(false);

  if (!currentQuestion) return <div className="question-card">Carregando pergunta...</div>;

  const handleRevealAnswer = () => {
    setShowAnswer(true);
  };

  const handleCorrectAnswer = () => {
    addScore(currentTeam, 10); // Adiciona 10 pontos para o time atual
    setAnswered(true);
  };

  const handleWrongAnswer = () => {
    setAnswered(true);
  };

  const handleNext = () => {
    setShowAnswer(false);
    setAnswered(false);
    nextQuestion();
  };

  const handlePass = () => {
    passQuestion();
  };

  return (
    <div className="question-card">
      <div className="question-header">
        <span className="category">{currentQuestion.category}</span>
        <span className="difficulty">{currentQuestion.difficulty}</span>
      </div>
      
      <h2 className="question-text">{currentQuestion.question}</h2>
      
      {showAnswer && (
        <div className="answer">
          <h3>Resposta:</h3>
          <p>{currentQuestion.answer}</p>
        </div>
      )}
      
      <div className="actions">
        {!showAnswer && !answered && (
          <>
            <button onClick={handleRevealAnswer} className="btn reveal">Revelar Resposta</button>
            <button onClick={handlePass} className="btn pass">Passar</button>
          </>
        )}
        
        {showAnswer && !answered && (
          <>
            <button onClick={handleCorrectAnswer} className="btn correct">Acertou</button>
            <button onClick={handleWrongAnswer} className="btn wrong">Errou</button>
          </>
        )}
        
        {answered && (
          <button onClick={handleNext} className="btn next">Próxima Pergunta</button>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;