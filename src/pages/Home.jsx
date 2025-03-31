import { useGame } from '../context/GameContext';
import '../assets/styles/Home.css';
import quizBackground from '../assets/images/background1.png'; // Importe a imagem

const Home = () => {
  const { startGame, loading } = useGame();

  return (
    <div className="home-container" style={{ backgroundImage: `url(${quizBackground})` }}>
      <div className="overlay"></div> {/* Adicione uma camada de sobreposição para melhorar a legibilidade */}
      <div className="home-content">
        <h1 className="title">Passa ou Repassa</h1>
        <p className="description">
          Teste seus conhecimentos neste jogo de perguntas e respostas!
        </p>
        <button 
          onClick={startGame} 
          className="start-button"
          disabled={loading}
        >
          {loading ? 'Carregando...' : 'Iniciar Jogo'}
        </button>
      </div>
    </div>
  );
};

export default Home;