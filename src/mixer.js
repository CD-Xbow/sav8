// SAV8 Mixer Core with revised channel controls: 
// Mute+LED on top, volume below, master/effects/output separated

const NUM_CHANNELS = 8;
const channelsDiv = document.getElementById('channels');
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let masterGain = audioCtx.createGain();
let masterMute = false;
let masterPan = audioCtx.createStereoPanner();
let masterEQ = audioCtx.createBiquadFilter();
masterEQ.type = 'peaking';
masterEQ.frequency.value = 1000;
masterEQ.gain.value = 0;

let effectSend = audioCtx.createGain();
let effectReturn = audioCtx.createGain();
let effects = { reverb: audioCtx.createGain() };
effects.reverb.gain.value = 0;

let masterSplitter = audioCtx.createChannelSplitter(2);
let analyserL = audioCtx.createAnalyser();
let analyserR = audioCtx.createAnalyser();
analyserL.fftSize = 256;
analyserR.fftSize = 256;

// Master signal chain
masterGain.connect(masterPan).connect(masterEQ).connect(masterSplitter);
masterSplitter.connect(analyserL, 0);
masterSplitter.connect(analyserR, 1);
masterEQ.connect(audioCtx.destination);
effectReturn.connect(masterGain);

document.addEventListener('DOMContentLoaded', function() {
  const helpBtn = document.getElementById('help-btn');
  if (helpBtn) {
    helpBtn.onclick = () => {
      window.open('help.html', '_blank');
    };
  }
});

function loadReverbImpulse() {
  fetch('https://cdn.jsdelivr.net/gh/mdn/webaudio-examples/voice-change-o-matic/audio/concert-crowd.ogg')
    .then(response => response.arrayBuffer())
    .then(buf => audioCtx.decodeAudioData(buf))
    .then(audioBuffer => {
      let convolver = audioCtx.createConvolver();
      convolver.buffer = audioBuffer;
      effectSend.connect(convolver);
      convolver.connect(effects.reverb);
      effects.reverb.connect(effectReturn);
    });
}
loadReverbImpulse();

function createChannel(idx) {
  let gain = audioCtx.createGain();
  let mute = false;
  let pan = audioCtx.createStereoPanner();
  let eq = audioCtx.createBiquadFilter();
  eq.type = 'peaking';
  eq.frequency.value = 1000;
  eq.gain.value = 0;
  let sendGain = audioCtx.createGain();
  sendGain.gain.value = 0;

  // Per-channel analyser for LED meter
  let analyser = audioCtx.createAnalyser();
  analyser.fftSize = 128;
  eq.connect(analyser);
  gain.connect(pan).connect(eq).connect(masterGain);
  eq.connect(sendGain).connect(effectSend);

  // Store references for mic management
  let micStream = null;
  let micSource = null;

  // Store references for MIDI player
  let midiPlayer = null;
  let midiFileUrl = null;
  let midiAudioSrc = null;

  // Channel UI
  let channel = document.createElement('div');
  channel.className = 'channel';
  channel.innerHTML = `
    <div class="channel-header">
      <h2>Ch ${idx + 1}</h2>
    </div>
    <select class="input-source">
      <option value="">Select input</option>
      <option value="file">Audio File</option>
      <option value="video">Video</option>
      <option value="mic">Microphone</option>
      <option value="midi">MIDI</option>
      <option value="tone">Tone</option>
    </select>
    <div class="input-filename"></div>
    <div class="channel-top-controls">
      <button class="mute">Mute</button>
      <canvas class="led-meter" width="14" height="32"></canvas>
    </div>
    <div class="channel-volume-row">
      <label>Volume <input type="range" min="0" max="1" step="0.01" value="0.8" class="volume"></label>
    </div>
    <span class="file-btn-wrap" style="display:none">
      <button type="button" class="file-btn-label" title="Open audio file" tabindex="-1">Open</button>
      <input type="file" class="file-input" accept="audio/*" tabindex="0">
    </span>
    <span class="video-btn-wrap" style="display:none">
      <button type="button" class="video-btn-label" title="Open video file" tabindex="-1">Open</button>
      <input type="file" class="video-input" accept="video/mp4,video/webm,video/ogg" tabindex="0">
    </span>
    <div class="midi-btn-wrap" style="display:none">
      <button type="button" class="midi-btn-label" title="Open MIDI file" tabindex="-1">Open</button>
      <input type="file" class="midi-input" accept=".mid,audio/midi,audio/x-midi" tabindex="0">
    </div>
    <div class="file-controls" style="display:none">
      <button class="play">Play</button>
      <button class="pause">Pause</button>
      <button class="stop">Stop</button>
      <input type="range" class="seek" min="0" max="1" step="0.01" value="0">
      <span class="time">0:00 / 0:00</span>
    </div>
    <label>Pan <input type="range" min="-1" max="1" step="0.01" value="0" class="pan"></label>
    <label>Tone <input type="range" min="-30" max="30" step="1" value="0" class="tone"></label>
    <label>Effect Send <input type="range" min="0" max="1" step="0.01" value="0" class="send"></label>
    <div class="channel-midi-slot"></div>
  `;
  channelsDiv.appendChild(channel);

  // DOM references
  let filenameDiv = channel.querySelector('.input-filename');
  function setFilename(name) {
    filenameDiv.textContent = name ? name : "";
  }
  let midiBtnWrap = channel.querySelector('.midi-btn-wrap');
  let midiBtnLabel = midiBtnWrap.querySelector('.midi-btn-label');
  let midiInput = midiBtnWrap.querySelector('.midi-input');
  let midiSlot = channel.querySelector('.channel-midi-slot');

  // Channel Controls
  channel.querySelector('.mute').onclick = () => {
    mute = !mute;
    gain.gain.value = mute ? 0 : parseFloat(channel.querySelector('.volume').value);
    channel.querySelector('.mute').classList.toggle('active', mute);
  };
  channel.querySelector('.volume').oninput = (e) => {
    if (!mute) gain.gain.value = parseFloat(e.target.value);
  };
  channel.querySelector('.pan').oninput = (e) => pan.pan.value = parseFloat(e.target.value);
  channel.querySelector('.tone').oninput = (e) => eq.gain.value = parseFloat(e.target.value);
  channel.querySelector('.send').oninput = (e) => sendGain.gain.value = parseFloat(e.target.value);

  // AUDIO FILE LOGIC
  let inputSource = channel.querySelector('.input-source');
  let fileBtnWrap = channel.querySelector('.file-btn-wrap');
  let fileBtnLabel = fileBtnWrap.querySelector('.file-btn-label');
  let fileInput = fileBtnWrap.querySelector('.file-input');
  let videoBtnWrap = channel.querySelector('.video-btn-wrap');
  let videoBtnLabel = videoBtnWrap.querySelector('.video-btn-label');
  let videoInput = videoBtnWrap.querySelector('.video-input');
  let fileControls = channel.querySelector('.file-controls');
  let playBtn = channel.querySelector('.play');
  let pauseBtn = channel.querySelector('.pause');
  let stopBtn = channel.querySelector('.stop');
  let seekSlider = channel.querySelector('.seek');
  let timeLabel = channel.querySelector('.time');
  let ledMeter = channel.querySelector('.led-meter');

  let audioBuffer = null;
  let bufferSource = null;
  let isPlaying = false;
  let startTime = 0;
  let pausedAt = 0;
  let duration = 0;
  let animSeek = null;

  // Video
  let videoElement = null;
  let videoSource = null;

  fileBtnLabel.onclick = () => fileInput.click();
  videoBtnLabel.onclick = () => videoInput.click();
  midiBtnLabel.onclick = () => midiInput.click();

  function resetUI() {
    seekSlider.value = 0;
    seekSlider.max = 1;
    timeLabel.textContent = "0:00 / 0:00";
  }
  function formatTime(t) {
    t = Math.floor(t);
    return `${Math.floor(t/60)}:${("0" + (t%60)).slice(-2)}`;
  }
  function updateSeekUI() {
    let current = 0;
    if (audioBuffer) {
      current = isPlaying
        ? (audioCtx.currentTime - startTime + pausedAt)
        : pausedAt;
      duration = audioBuffer.duration;
    } else if (videoElement) {
      current = videoElement.currentTime;
      duration = videoElement.duration;
    }
    seekSlider.value = (duration > 0) ? current / duration : 0;
    timeLabel.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
    if (isPlaying || (videoElement && !videoElement.paused && !videoElement.ended)) {
      animSeek = requestAnimationFrame(updateSeekUI);
      if (current >= duration) stopPlayback();
    }
  }
  function playPlayback() {
    if (audioBuffer) {
      if (isPlaying) stopPlayback();
      bufferSource = audioCtx.createBufferSource();
      bufferSource.buffer = audioBuffer;
      bufferSource.loop = true;
      bufferSource.connect(gain);
      startTime = audioCtx.currentTime;
      bufferSource.start(0, pausedAt);
      isPlaying = true;
      updateSeekUI();
    } else if (videoElement) {
      if (videoElement.paused || videoElement.ended) {
        videoElement.currentTime = pausedAt || 0;
        videoElement.play();
        isPlaying = true;
        updateSeekUI();
      }
    }
  }
  function pausePlayback() {
    if (audioBuffer && isPlaying) {
      pausedAt += audioCtx.currentTime - startTime;
      bufferSource.stop();
      isPlaying = false;
      cancelAnimationFrame(animSeek);
      updateSeekUI();
    } else if (videoElement && !videoElement.paused) {
      pausedAt = videoElement.currentTime;
      videoElement.pause();
      isPlaying = false;
      cancelAnimationFrame(animSeek);
      updateSeekUI();
    }
  }
  function stopPlayback() {
    if (audioBuffer && bufferSource) {
      bufferSource.stop();
      isPlaying = false;
      pausedAt = 0;
      bufferSource = null;
      resetUI();
      cancelAnimationFrame(animSeek);
    } else if (videoElement) {
      videoElement.pause();
      videoElement.currentTime = 0;
      pausedAt = 0;
      isPlaying = false;
      resetUI();
      cancelAnimationFrame(animSeek);
    }
  }

  playBtn.onclick = playPlayback;
  pauseBtn.onclick = pausePlayback;
  stopBtn.onclick = stopPlayback;
  seekSlider.oninput = (e) => {
    let seekTo = parseFloat(seekSlider.value) * duration;
    if (audioBuffer) {
      pausedAt = seekTo;
      if (isPlaying) playPlayback();
      else updateSeekUI();
    } else if (videoElement) {
      videoElement.currentTime = seekTo;
      pausedAt = seekTo;
      updateSeekUI();
    }
  };

  // --- Microphone management helpers ---
  function stopMic() {
    if (micSource) {
      try { micSource.disconnect(); } catch (e) {}
      micSource = null;
    }
    if (micStream) {
      micStream.getTracks().forEach(track => track.stop());
      micStream = null;
    }
  }

  // --- MIDI management helpers ---
  function removeMidiPlayer() {
    if (midiPlayer) {
      if (midiAudioSrc) {
        try { midiAudioSrc.disconnect(); } catch (e) {}
      }
      midiSlot.innerHTML = '';
      midiPlayer = null;
      midiAudioSrc = null;
      midiFileUrl = null;
    }
  }

  // --- Input source switching ---
  inputSource.onchange = async (e) => {
    if (audioCtx.state === "suspended") await audioCtx.resume();

    let val = e.target.value;
    stopMic();
    removeMidiPlayer();

    fileBtnWrap.style.display = (val === 'file') ? 'inline-block' : 'none';
    fileControls.style.display = (val === 'file' || val === 'video') ? '' : 'none';
    videoBtnWrap.style.display = (val === 'video') ? 'inline-block' : 'none';
    midiBtnWrap.style.display = (val === 'midi') ? 'inline-block' : 'none';
    setFilename("");

    if (val === 'mic') {
      try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micSource = audioCtx.createMediaStreamSource(micStream);
        micSource.connect(gain);
      } catch (err) {
        alert('Could not access microphone: ' + err.message);
        inputSource.value = "";
        return;
      }
      fileControls.style.display = 'none';
      fileBtnWrap.style.display = 'none';
      videoBtnWrap.style.display = 'none';
      midiBtnWrap.style.display = 'none';
    }
    if (val === 'tone') {
      let osc = audioCtx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = 220 * (idx + 1);
      osc.start();
      osc.connect(gain);
      setTimeout(() => osc.stop(), 5000); // 5s demo
      fileControls.style.display = 'none';
      fileBtnWrap.style.display = 'none';
      videoBtnWrap.style.display = 'none';
      midiBtnWrap.style.display = 'none';
    }
    if (val !== 'file') {
      stopPlayback();
      audioBuffer = null;
      resetUI();
    }
    if (val !== 'video') {
      stopPlayback();
      if (videoElement) {
        videoElement.pause();
        videoElement.src = "";
        videoElement.remove();
        videoElement = null;
        videoSource = null;
      }
      resetUI();
    }
  };

  // --- MIDI file loading and player setup ---
  midiInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFilename(file.name);

    removeMidiPlayer();

    midiPlayer = document.createElement('midi-player');
    midiPlayer.style.width = "300px";
    midiPlayer.setAttribute('sound-font', '');
    midiPlayer.setAttribute('style', "width:300px; margin: 0.2em 0 0.2em 0;");

    // Set the MIDI file src
    midiFileUrl = URL.createObjectURL(file);
    midiPlayer.setAttribute('src', midiFileUrl);

    // Wait for the player to upgrade and render, then grab <audio>
    setTimeout(() => {
      // The <audio> element is in the shadow DOM or as a child
      let midiAudio = midiPlayer.shadowRoot
        ? midiPlayer.shadowRoot.querySelector('audio')
        : midiPlayer.querySelector('audio');
      if (midiAudio) {
        midiAudio.pause();
        midiAudio.currentTime = 0;
        midiAudioSrc = audioCtx.createMediaElementSource(midiAudio);
        midiAudioSrc.connect(gain);
      }
    }, 450);

    // Show the MIDI player slot at the bottom of this channel
    midiSlot.innerHTML = '';
    const slotInner = document.createElement('div');
    slotInner.className = 'channel-midi-slot-inner';
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'channel-midi-slot-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.title = "Hide MIDI Player";
    closeBtn.onclick = (e) => {
      midiSlot.innerHTML = '';
      removeMidiPlayer();
      inputSource.value = "";
      setFilename("");
    };
    slotInner.appendChild(closeBtn);
    slotInner.appendChild(midiPlayer);
    midiSlot.appendChild(slotInner);
  };

  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = function(ev) {
      audioCtx.decodeAudioData(ev.target.result, (abuf) => {
        audioBuffer = abuf;
        duration = abuf.duration;
        seekSlider.max = 1;
        seekSlider.value = 0;
        pausedAt = 0;
        resetUI();
        timeLabel.textContent = `0:00 / ${formatTime(duration)}`;
      });
    };
    reader.readAsArrayBuffer(file);
  };

  videoInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFilename(file.name);
    if (videoElement) {
      videoElement.pause();
      videoElement.src = "";
      videoElement.remove();
      videoElement = null;
      videoSource = null;
    }

    videoElement = document.createElement('video');
    videoElement.src = URL.createObjectURL(file);
    videoElement.crossOrigin = "anonymous";
    videoElement.preload = "auto";
    videoElement.style.display = "none";
    document.body.appendChild(videoElement);

    if (videoSource) {
      videoSource.disconnect();
      videoSource = null;
    }
    videoSource = audioCtx.createMediaElementSource(videoElement);
    videoSource.connect(gain);

    videoElement.onloadedmetadata = () => {
      duration = videoElement.duration;
      seekSlider.max = 1;
      seekSlider.value = 0;
      pausedAt = 0;
      resetUI();
      timeLabel.textContent = `0:00 / ${formatTime(duration)}`;
    };
    videoElement.onended = () => {
      isPlaying = false;
      pausedAt = 0;
      resetUI();
    };
    videoElement.onerror = () => {
      alert("This video format is not supported. Please use mp4, webm, or ogg.");
      videoElement.pause();
      videoElement.src = "";
      videoElement.remove();
      videoElement = null;
      videoSource = null;
      resetUI();
      setFilename("");
    };
  };

  // LED-style input meter animation
  function drawLedMeter() {
    let ctx = ledMeter.getContext('2d');
    let data = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(data);
    let min = 255, max = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i] < min) min = data[i];
      if (data[i] > max) max = data[i];
    }
    let amp = (max - min) / 255;
    ctx.clearRect(0, 0, 14, 32);
    let leds = 6;
    let active = Math.round(amp * leds);
    for (let i = 0; i < leds; i++) {
      let color = "#222";
      if (i < active) {
        if (i >= leds - 1) color = "#f00";
        else if (i >= leds - 2) color = "#ff0";
        else color = "#0f0";
      }
      ctx.fillStyle = color;
      ctx.fillRect(2, 30 - i * 5, 10, 4);
    }
    requestAnimationFrame(drawLedMeter);
  }
  drawLedMeter();
}

for (let i = 0; i < NUM_CHANNELS; i++) createChannel(i);

// Master channel UI
const master = document.getElementById('master-panel');
master.querySelector('.mute').onclick = () => {
  masterMute = !masterMute;
  masterGain.gain.value = masterMute ? 0 : 1;
  master.querySelector('.mute').classList.toggle('active', masterMute);
};
master.querySelector('.volume').oninput = (e) => {
  if (!masterMute) masterGain.gain.value = parseFloat(e.target.value);
};
master.querySelector('.pan').oninput = (e) => masterPan.pan.value = parseFloat(e.target.value);
master.querySelector('.tone').oninput = (e) => masterEQ.gain.value = parseFloat(e.target.value);
master.querySelector('.effect-send').onclick = () => {
  effects.reverb.gain.value = effects.reverb.gain.value === 0 ? 0.5 : 0;
};
document.querySelector('.reverb').oninput = (e) => {
  effects.reverb.gain.value = parseFloat(e.target.value);
};

// Master meters
const meterL = document.getElementById('meter-left');
const meterR = document.getElementById('meter-right');
const ctxL = meterL.getContext('2d');
const ctxR = meterR.getContext('2d');

function drawMeter(ctx, analyser) {
  let data = new Uint8Array(analyser.fftSize);
  analyser.getByteTimeDomainData(data);
  let min = 255, max = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i] < min) min = data[i];
    if (data[i] > max) max = data[i];
  }
  let amp = (max - min) / 255;
  ctx.clearRect(0, 0, 20, 120);
  let h = Math.round(amp * 120);
  ctx.fillStyle = h > 80 ? "#f00" : h > 40 ? "#ff0" : "#0f0";
  ctx.fillRect(4, 120 - h, 12, h);
}

function animateMeters() {
  drawMeter(ctxL, analyserL);
  drawMeter(ctxR, analyserR);
  requestAnimationFrame(animateMeters);
}
animateMeters();