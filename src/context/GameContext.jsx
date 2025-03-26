import { createContext, useState, useContext, useEffect } from 'react';
import { getQuestions } from '../services/questionService';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({ team1: 0, team2: 0 });
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentTeam, setCurrentTeam] = useState('team1');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuestions();
        setQuestions(data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar perguntas:", error);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setCurrentQuestionIndex(0);
    setScores({ team1: 0, team2: 0 });
    setCurrentTeam('team1');
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // Alterna o time a cada pergunta
      setCurrentTeam(currentTeam === 'team1' ? 'team2' : 'team1');
    } else {
      // Fim do jogo
      setGameStarted(false);
    }
  };

  const addScore = (team, points) => {
    setScores(prev => ({
      ...prev,
      [team]: prev[team] + points
    }));
  };

  const passQuestion = () => {
    // Implementa a lógica de "passar" a pergunta para o outro time
    setCurrentTeam(currentTeam === 'team1' ? 'team2' : 'team1');
  };

  const value = {
    questions,
    currentQuestion: questions[currentQuestionIndex],
    currentQuestionIndex,
    scores,
    loading,
    gameStarted,
    currentTeam,
    startGame,
    nextQuestion,
    addScore,
    passQuestion
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};