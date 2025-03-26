// Mock service para perguntas e respostas
// Será substituído pela integração com API no futuro

export const getQuestions = () => {
  return Promise.resolve([
    {
      id: 1,
      question: "Qual é a capital do Brasil?",
      answer: "Brasília",
      difficulty: "fácil",
      category: "Geografia"
    },
    {
      id: 2,
      question: "Quem escreveu 'Dom Casmurro'?",
      answer: "Machado de Assis",
      difficulty: "médio",
      category: "Literatura"
    },
    {
      id: 3,
      question: "Qual é o maior planeta do sistema solar?",
      answer: "Júpiter",
      difficulty: "fácil",
      category: "Astronomia"
    },
    {
      id: 4,
      question: "Em que ano o homem pisou na Lua pela primeira vez?",
      answer: "1969",
      difficulty: "médio",
      category: "História"
    },
    {
      id: 5,
      question: "Qual é o elemento químico mais abundante na crosta terrestre?",
      answer: "Oxigênio",
      difficulty: "difícil",
      category: "Ciências"
    }
  ]);
};