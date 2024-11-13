import React, { useEffect, useContext } from 'react';
import { AudioClassifierProvider, AudioClassifierAdapterCtx } from './AudioClassifierAdapterCtx';
import { AudioClassifierManagerProvider, AudioClassifierManagerCtx } from './AudioClassifierManagerCtx';

function InnerApp() {
  const { initializeAudioClassifier } = useContext(AudioClassifierAdapterCtx);
  const { startAudioClassification } = useContext(AudioClassifierManagerCtx);

  useEffect(() => {
    console.log("App useEffect() init");
    initializeAudioClassifier();
  }, []);

  const handleClick = async () => {
    startAudioClassification();
  };

  return (
    <div className="App">
      <div id="detector-container">
        <h2>Stream audio classifications</h2>
        <p>Check out the repository for this project: <a href="https://github.com/nolnc/audio-classifier" target="_blank" rel="noreferrer">audio-classifier</a>.</p>
        <div>Click <b>Start Classifying</b> to start streaming classifications of your own audio.</div>
        <button class="mdc-button mdc-button--raised" id="microBt" onClick={handleClick}>START</button>
        <p id="microResult"></p>
      </div>
    </div>
  );
}

// Context provider wrapper for App 
function App() {
  return (
    <AudioClassifierProvider>
      <AudioClassifierManagerProvider>
        <InnerApp />
      </AudioClassifierManagerProvider>
    </AudioClassifierProvider>
  );
}

export default App;