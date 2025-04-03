import { useState, useEffect } from 'react';

function InstallPWA() {
  const [promptInstall, setPromptInstall] = useState(null);
  const [debugMessage, setDebugMessage] = useState('Aguardando evento de instalação...');
  const [pwaStatus, setPwaStatus] = useState('Verificando...');
  const [showManualInstructions, setShowManualInstructions] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  
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
      setIsInstalled(true);
      return;
    }

    // Also check if it's installed using other methods
    if (window.navigator.standalone === true) {
      setPwaStatus('Já instalado (iOS standalone)');
      setDebugMessage('App já está instalado no iOS');
      setIsInstalled(true);
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
      setIsInstalled(true);
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
        {isInstalled ? (
          <>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Como desinstalar:</h3>
            
            {isMobile && isChrome && (
              <div>
                <p>No Android:</p>
                <ol style={{ paddingLeft: '20px', margin: '5px 0' }}>
                  <li>Vá para Configurações do dispositivo</li>
                  <li>Aplicativos - Passa ou Repassa</li>
                  <li>Toque em "Desinstalar"</li>
                </ol>
              </div>
            )}
            
            {!isMobile && (isChrome || isEdge) && (
              <div>
                <p>No Chrome/Edge para Desktop:</p>
                <ol style={{ paddingLeft: '20px', margin: '5px 0' }}>
                  <li>Clique no menu (três pontos)</li>
                  <li>Aplicativos - Gerenciar aplicativos</li>
                  <li>Encontre "Passa ou Repassa" e clique em "Remover"</li>
                </ol>
              </div>
            )}
            
            {isSafari && (
              <div>
                <p>No iOS:</p>
                <ol style={{ paddingLeft: '20px', margin: '5px 0' }}>
                  <li>Pressione e segure o ícone do app na tela inicial</li>
                  <li>Toque em "Remover aplicativo"</li>
                  <li>Confirme a remoção</li>
                </ol>
              </div>
            )}
          </>
        ) : (
          <>
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
          </>
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
  // Add this missing function
  const showUninstallInstructions = () => {
    setShowManualInstructions(true);
    setDebugMessage('Para desinstalar, siga as instruções abaixo');
  };

  // Modify the return statement to ensure it only shows on the home page
  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
      {window.location.pathname === '/' && (
        <>
          {isInstalled ? (
            <button
              onClick={showUninstallInstructions}
              style={{ 
                padding: '10px',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Gerenciar App"
            >
              <span style={{ fontSize: '20px' }}>⚙️</span>
            </button>
          ) : (
            <button
              onClick={onClick}
              style={{ 
                padding: '10px',
                backgroundColor: promptInstall ? 'rgba(76,175,80,0.8)' : 'rgba(0,123,255,0.8)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Instalar App"
            >
              <span style={{ fontSize: '20px' }}>⬇️</span>
            </button>
          )}
          
          {showManualInstructions && renderManualInstructions()}
        </>
      )}
    </div>
  );
}

export default InstallPWA;