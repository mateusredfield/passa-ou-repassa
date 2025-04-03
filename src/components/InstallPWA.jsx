import { useState, useEffect } from 'react';

function InstallPWA() {
  const [promptInstall, setPromptInstall] = useState(null);
  const [debugMessage, setDebugMessage] = useState('Aguardando evento de instalação...');
  const [pwaStatus, setPwaStatus] = useState('Verificando...');
  const [showManualInstructions, setShowManualInstructions] = useState(false);
  
  // Add this function to manually trigger the prompt
  const triggerPrompt = () => {
    // This is a hack to try to trigger the beforeinstallprompt event
    // It doesn't always work, but worth trying
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    setTimeout(() => {
      document.body.removeChild(iframe);
      console.log('Tentando forçar o evento beforeinstallprompt');
    }, 100);
  };

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setPwaStatus('Já instalado (standalone mode)');
      setDebugMessage('App já está instalado e rodando em modo standalone');
      console.log('App já está rodando em modo standalone');
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      console.log('Evento beforeinstallprompt capturado!', e);
      setPromptInstall(e);
      setDebugMessage('Pronto para instalar!');
      setPwaStatus('Instalável');
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    
    // Verificar se já está instalado
    window.addEventListener('appinstalled', () => {
      console.log('App instalado com sucesso!');
      setDebugMessage('App instalado com sucesso!');
      setPwaStatus('Instalado');
    });
    
    console.log('InstallPWA component mounted');
    
    // Check PWA criteria
    checkPWACriteria();
    
    // Try to trigger the prompt after a short delay
    setTimeout(triggerPrompt, 2000);
    
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const checkPWACriteria = () => {
    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      setPwaStatus('Service Worker não suportado');
      return;
    }

    // Check if running on HTTPS or localhost
    if (!(window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
      setPwaStatus('Não está em HTTPS ou localhost');
      return;
    }

    // Check manifest
    const linkElement = document.querySelector('link[rel="manifest"]');
    if (!linkElement) {
      setPwaStatus('Manifesto não encontrado');
      return;
    }

    setPwaStatus('Critérios básicos atendidos, aguardando evento...');
  };

  const onClick = () => {
    console.log('Botão de instalação clicado');
    if (!promptInstall) {
      setDebugMessage('Prompt de instalação não disponível. Veja instruções abaixo:');
      triggerPrompt(); // Try to trigger the prompt when button is clicked
      
      // Show manual installation instructions
      setShowManualInstructions(true);
      return;
    }
    
    promptInstall.prompt();
    promptInstall.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Usuário aceitou a instalação');
        setDebugMessage('Instalação aceita!');
      } else {
        console.log('Usuário recusou a instalação');
        setDebugMessage('Instalação recusada pelo usuário');
      }
    });
  };

  // Render manual installation instructions
  const renderManualInstructions = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isChrome = /Chrome/i.test(navigator.userAgent) && !/Edge|Edg/i.test(navigator.userAgent);
    const isEdge = /Edge|Edg/i.test(navigator.userAgent);
    const isSafari = /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);
    
    return (
      <div style={{ 
        backgroundColor: 'rgba(0,0,0,0.8)', 
        color: 'white', 
        padding: '15px', 
        borderRadius: '5px',
        fontSize: '14px',
        maxWidth: '300px',
        marginTop: '10px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Como instalar manualmente:</h3>
        
        {isMobile && isChrome && (
          <div>
            <p>No Chrome para Android:</p>
            <ol style={{ paddingLeft: '20px', margin: '5px 0' }}>
              <li>Toque no menu (três pontos)</li>
              <li>Selecione "Instalar aplicativo"</li>
            </ol>
          </div>
        )}
        
        {!isMobile && (isChrome || isEdge) && (
          <div>
            <p>No Chrome/Edge para Desktop:</p>
            <ol style={{ paddingLeft: '20px', margin: '5px 0' }}>
              <li>Clique no ícone de instalação na barra de endereço ⊕</li>
              <li>Ou vá ao menu (três pontos) → "Instalar Passa ou Repassa..."</li>
            </ol>
          </div>
        )}
        
        {isSafari && (
          <div>
            <p>No Safari para iOS:</p>
            <ol style={{ paddingLeft: '20px', margin: '5px 0' }}>
              <li>Toque no botão compartilhar</li>
              <li>Role para baixo e toque em "Adicionar à Tela de Início"</li>
            </ol>
          </div>
        )}
        
        <button 
          onClick={() => setShowManualInstructions(false)}
          style={{ 
            marginTop: '10px',
            padding: '5px 10px',
            backgroundColor: '#555',
            border: 'none',
            borderRadius: '3px',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Fechar
        </button>
      </div>
    );
  };

  // Sempre mostrar o botão para depuração
  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
      <button
        onClick={onClick}
        style={{ 
          padding: '10px 15px',
          backgroundColor: promptInstall ? '#4CAF50' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Instalar App {promptInstall ? '✓' : ''}
      </button>
      
      <div style={{ 
        marginTop: '5px', 
        backgroundColor: 'rgba(0,0,0,0.7)', 
        color: 'white', 
        padding: '5px', 
        borderRadius: '3px',
        fontSize: '12px',
        maxWidth: '250px'
      }}>
        <div>Status: {pwaStatus}</div>
        <div>{debugMessage}</div>
      </div>
      
      {showManualInstructions && renderManualInstructions()}
    </div>
  );
}

export default InstallPWA;