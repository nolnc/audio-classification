// Manages the audio classifier requests.

import React, { createContext, useContext } from 'react';
import { AudioClassifierAdapterCtx } from './AudioClassifierAdapterCtx';

const AudioClassifierManagerCtx = createContext();

const AudioClassifierManagerProvider = ({ children }) => {

  let audioCtx = null;

  const { audioClassifier, isAudioClassifierReady } = useContext(AudioClassifierAdapterCtx);

  /*
  const hasGetUserMedia = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };
  */

  async function startAudioClassification() {
    console.log("startAudioClassification()");
    if (!audioClassifier || !isAudioClassifierReady) {
      console.log("Wait! audioClassifier not loaded yet.");
      return;
    }

    const constraints = {
      audio: true
    };
    let stream;
    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
    }
    catch (err) {
        console.log("The following error occured: " + err);
        alert("getUserMedia not supported on your browser");
    }

    const streamingBt = document.getElementById("microBt");

    if (!audioCtx) {
      audioCtx = new AudioContext({ sampleRate: 16000 });
    }
    else if (audioCtx.state === "running") {
      await audioCtx.suspend();
      streamingBt.innerHTML = "CONTINUE";
      return;
    }

    // resumes AudioContext if has been suspended
    await audioCtx.resume();
    streamingBt.innerHTML = "PAUSE";

    const source = audioCtx.createMediaStreamSource(stream);
    const scriptNode = audioCtx.createScriptProcessor(16384, 1, 1);

    scriptNode.onaudioprocess = function (audioProcessingEvent) {
      const inputBuffer = audioProcessingEvent.inputBuffer;
      let inputData = inputBuffer.getChannelData(0);

      // Classify the audio
      const result = audioClassifier.classify(inputData);
      const categories = result[0].classifications[0].categories;

      // Display results
      const output = document.getElementById("microResult");
      output.innerText =
        Math.round(parseFloat(categories[0].score) * 100) + "% " + categories[0].categoryName + "\n" +
        Math.round(parseFloat(categories[1].score) * 100) + "% " + categories[1].categoryName + "\n" +
        Math.round(parseFloat(categories[2].score) * 100) + "% " + categories[2].categoryName;
      };

      source.connect(scriptNode);
      scriptNode.connect(audioCtx.destination);
  };

  const disableMic = async () => {
    console.log("disableMic()");
  };

  const audioClassifierManagerShared = {
    startAudioClassification
  };

  return (
    <AudioClassifierManagerCtx.Provider value={ audioClassifierManagerShared }>
      {children}
    </AudioClassifierManagerCtx.Provider>
  );
};

export { AudioClassifierManagerProvider, AudioClassifierManagerCtx };
