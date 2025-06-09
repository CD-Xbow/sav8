(()=>{!function(){function t(t){var e=!0,i=!1,s=null,n={text:!0,search:!0,url:!0,tel:!0,email:!0,password:!0,number:!0,date:!0,month:!0,week:!0,time:!0,datetime:!0,"datetime-local":!0};function o(t){return!!t&&t!==document&&"HTML"!==t.nodeName&&"BODY"!==t.nodeName&&"classList"in t&&"contains"in t.classList}function r(t){t.classList.contains("focus-visible")||(t.classList.add("focus-visible"),t.setAttribute("data-focus-visible-added",""))}function a(t){e=!1}function l(){document.addEventListener("mousemove",d),document.addEventListener("mousedown",d),document.addEventListener("mouseup",d),document.addEventListener("pointermove",d),document.addEventListener("pointerdown",d),document.addEventListener("pointerup",d),document.addEventListener("touchmove",d),document.addEventListener("touchstart",d),document.addEventListener("touchend",d)}function d(t){t.target.nodeName&&"html"===t.target.nodeName.toLowerCase()||(e=!1,document.removeEventListener("mousemove",d),document.removeEventListener("mousedown",d),document.removeEventListener("mouseup",d),document.removeEventListener("pointermove",d),document.removeEventListener("pointerdown",d),document.removeEventListener("pointerup",d),document.removeEventListener("touchmove",d),document.removeEventListener("touchstart",d),document.removeEventListener("touchend",d))}document.addEventListener("keydown",function(i){i.metaKey||i.altKey||i.ctrlKey||(o(t.activeElement)&&r(t.activeElement),e=!0)},!0),document.addEventListener("mousedown",a,!0),document.addEventListener("pointerdown",a,!0),document.addEventListener("touchstart",a,!0),document.addEventListener("visibilitychange",function(t){"hidden"===document.visibilityState&&(i&&(e=!0),l())},!0),l(),t.addEventListener("focus",function(t){if(o(t.target)){var i,s,a;(e||(s=(i=t.target).type,"INPUT"===(a=i.tagName)&&n[s]&&!i.readOnly||"TEXTAREA"===a&&!i.readOnly||i.isContentEditable))&&r(t.target)}},!0),t.addEventListener("blur",function(t){if(o(t.target)&&(t.target.classList.contains("focus-visible")||t.target.hasAttribute("data-focus-visible-added"))){var e;i=!0,window.clearTimeout(s),s=window.setTimeout(function(){i=!1},100),(e=t.target).hasAttribute("data-focus-visible-added")&&(e.classList.remove("focus-visible"),e.removeAttribute("data-focus-visible-added"))}},!0),t.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&t.host?t.host.setAttribute("data-js-focus-visible",""):t.nodeType===Node.DOCUMENT_NODE&&(document.documentElement.classList.add("js-focus-visible"),document.documentElement.setAttribute("data-js-focus-visible",""))}if("undefined"!=typeof window&&"undefined"!=typeof document){var e;window.applyFocusVisiblePolyfill=t;try{e=new CustomEvent("focus-visible-polyfill-ready")}catch(t){(e=document.createEvent("CustomEvent")).initCustomEvent("focus-visible-polyfill-ready",!1,!1,{})}window.dispatchEvent(e)}"undefined"!=typeof document&&t(document)}();/**
 * html-midi-player@1.5.0
 * https://github.com/cifkao/html-midi-player.git
 * @author Ondřej Cífka (@cifkao)
 * @license BSD-2-Clause
 */var t={};t=core;let e=document.createElement("template");e.innerHTML=`
<style>
:host {
  display: inline-block;
  width: 300px;
  margin: 3px;
  vertical-align: bottom;
  font-family: sans-serif;
  font-size: 14px;
}

:focus:not(.focus-visible) {
  outline: none;
}

.controls {
  width: inherit;
  height: inherit;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  position: relative;
  overflow: hidden;
  align-items: center;
  border-radius: 100px;
  background: #f2f5f6;
  padding: 0 0.25em;
  user-select: none;
}
.controls > * {
  margin: 0.8em 0.45em;
}
.controls input, .controls button {
  cursor: pointer;
}
.controls input:disabled, .controls button:disabled {
  cursor: inherit;
}
.controls button {
  text-align: center;
  background: rgba(204, 204, 204, 0);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 100%;
  transition: background-color 0.25s ease 0s;
  padding: 0;
}
.controls button:not(:disabled):hover {
  background: rgba(204, 204, 204, 0.3);
}
.controls button:not(:disabled):active {
  background: rgba(204, 204, 204, 0.6);
}
.controls button .icon {
  display: none;
}
.controls button .icon, .controls button .icon svg {
  vertical-align: middle;
}
.controls button .icon svg {
  fill: currentColor;
}
.controls .seek-bar {
  flex: 1;
  min-width: 0;
  margin-right: 1.1em;
  background: transparent;
}
.controls .seek-bar::-moz-range-track {
  background-color: #555;
}
.controls.stopped .play-icon, .controls.playing .stop-icon, .controls.error .error-icon {
  display: inherit;
}
.controls.frozen > div, .controls > button:disabled .icon {
  opacity: 0.5;
}
.controls .overlay {
  z-index: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  box-sizing: border-box;
  display: none;
  opacity: 1;
}
.controls.loading .loading-overlay {
  display: block;
  background: linear-gradient(110deg, #92929200 5%, #92929288 25%, #92929200 45%);
  background-size: 250% 100%;
  background-repeat: repeat-y;
  animation: shimmer 1.5s linear infinite;
}

@keyframes shimmer {
  0% {
    background-position: 125% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
<div class="controls stopped frozen" part="control-panel">
  <button class="play" part="play-button" disabled>
    <span class="icon play-icon"><svg width="24" height="24" version="1.1" viewBox="0 0 6.35 6.35" xmlns="http://www.w3.org/2000/svg">
 <path d="m4.4979 3.175-2.1167 1.5875v-3.175z" stroke-width=".70201"/>
</svg>
</span>
    <span class="icon stop-icon"><svg width="24" height="24" version="1.1" viewBox="0 0 6.35 6.35" xmlns="http://www.w3.org/2000/svg">
 <path d="m1.8521 1.5875v3.175h0.92604v-3.175zm1.7198 0v3.175h0.92604v-3.175z" stroke-width=".24153"/>
</svg>
</span>
    <span class="icon error-icon"><svg width="24" height="24" version="1.1" viewBox="0 0 6.35 6.35" xmlns="http://www.w3.org/2000/svg">
 <path transform="scale(.26458)" d="m12 3.5a8.4993 8.4993 0 0 0-8.5 8.5 8.4993 8.4993 0 0 0 8.5 8.5 8.4993 8.4993 0 0 0 8.5-8.5 8.4993 8.4993 0 0 0-8.5-8.5zm-1.4062 3.5h3v6h-3v-6zm0 8h3v2h-3v-2z"/>
</svg>
</span>
  </button>
  <div part="time"><span class="current-time" part="current-time">0:00</span> / <span class="total-time" part="total-time">0:00</span></div>
  <input type="range" min="0" max="0" value="0" step="any" class="seek-bar" part="seek-bar" disabled>
  <div class="overlay loading-overlay" part="loading-overlay"></div>
</div>
`;let i=document.createElement("template");function s(t){let e=t<0,i=(t=Math.floor(Math.abs(t||0)))%60,s=(t-i)/60,n=(t-i-60*s)/3600,o=s>9||!n?`${s}:`:`0${s}:`;return(e?"-":"")+(n?`${n}:`:"")+o+(i>9?`${i}`:`0${i}`)}i.innerHTML=`
<style>
:host {
  display: block;
}

::slotted(.piano-roll-visualizer) {
  overflow-x: auto;
}
</style>
<slot>
</slot>
`;let n=["piano-roll","waterfall","staff"];class o extends HTMLElement{constructor(){super(...arguments),this.domInitialized=!1,this.ns=null,this._config={}}static get observedAttributes(){return["src","type"]}connectedCallback(){this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(i.content.cloneNode(!0)),this.domInitialized||(this.domInitialized=!0,this.wrapper=document.createElement("div"),this.appendChild(this.wrapper),this.initVisualizerNow())}attributeChangedCallback(t,e,i){("src"===t||"type"===t)&&this.initVisualizer()}initVisualizer(){null==this.initTimeout&&(this.initTimeout=window.setTimeout(()=>this.initVisualizerNow()))}async initVisualizerNow(){if(this.initTimeout=null,this.domInitialized&&(this.src&&(this.ns=null,this.ns=await (0,t.urlToNoteSequence)(this.src)),this.wrapper.innerHTML="",this.ns)){if("piano-roll"===this.type){this.wrapper.classList.add("piano-roll-visualizer");let e=document.createElementNS("http://www.w3.org/2000/svg","svg");this.wrapper.appendChild(e),this.visualizer=new t.PianoRollSVGVisualizer(this.ns,e,this._config)}else if("waterfall"===this.type)this.wrapper.classList.add("waterfall-visualizer"),this.visualizer=new t.WaterfallSVGVisualizer(this.ns,this.wrapper,this._config);else if("staff"===this.type){this.wrapper.classList.add("staff-visualizer");let e=document.createElement("div");this.wrapper.appendChild(e),this.visualizer=new t.StaffSVGVisualizer(this.ns,e,this._config)}}}reload(){this.initVisualizerNow()}redraw(t){this.visualizer&&this.visualizer.redraw(t,null!=t)}clearActiveNotes(){this.visualizer&&this.visualizer.clearActiveNotes()}get noteSequence(){return this.ns}set noteSequence(t){this.ns!=t&&(this.ns=t,this.removeAttribute("src"),this.initVisualizer())}get src(){return this.getAttribute("src")}set src(t){this.ns=null,this.setOrRemoveAttribute("src",t),this.initVisualizer()}get type(){let t=this.getAttribute("type");return 0>n.indexOf(t)&&(t="piano-roll"),t}set type(t){if(null!=t&&0>n.indexOf(t))throw Error(`Unknown visualizer type ${t}. Allowed values: ${n.join(", ")}`);this.setOrRemoveAttribute("type",t)}get config(){return this._config}set config(t){this._config=t,this.initVisualizer()}setOrRemoveAttribute(t,e){null==e?this.removeAttribute(t):this.setAttribute(t,e)}}let r=["start","stop","note"],a=null;class l extends HTMLElement{constructor(){super(),this.domInitialized=!1,this.needInitNs=!1,this.visualizerListeners=new Map,this.ns=null,this._playing=!1,this.seeking=!1,this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(e.content.cloneNode(!0)),this.controlPanel=this.shadowRoot.querySelector(".controls"),this.playButton=this.controlPanel.querySelector(".play"),this.currentTimeLabel=this.controlPanel.querySelector(".current-time"),this.totalTimeLabel=this.controlPanel.querySelector(".total-time"),this.seekBar=this.controlPanel.querySelector(".seek-bar")}static get observedAttributes(){return["sound-font","src","visualizer"]}connectedCallback(){if(this.domInitialized)return;this.domInitialized=!0;let t=window.applyFocusVisiblePolyfill;null!=t&&t(this.shadowRoot),this.playButton.addEventListener("click",()=>{this.player.isPlaying()?this.stop():this.start()}),this.seekBar.addEventListener("input",()=>{this.seeking=!0,this.player&&"started"===this.player.getPlayState()&&this.player.pause()}),this.seekBar.addEventListener("change",()=>{let t=this.currentTime;this.currentTimeLabel.textContent=s(t),this.player&&this.player.isPlaying()&&(this.player.seekTo(t),"paused"===this.player.getPlayState()&&this.player.resume()),this.seeking=!1}),this.initPlayerNow()}attributeChangedCallback(t,e,i){if(this.hasAttribute(t)||(i=null),"sound-font"===t||"src"===t)this.initPlayer();else if("visualizer"===t){let t=()=>{this.setVisualizerSelector(i)};"loading"===document.readyState?window.addEventListener("DOMContentLoaded",t):t()}}initPlayer(t=!0){this.needInitNs=this.needInitNs||t,null==this.initTimeout&&(this.stop(),this.setLoading(),this.initTimeout=window.setTimeout(()=>this.initPlayerNow(this.needInitNs)))}async initPlayerNow(e=!0){if(this.initTimeout=null,this.needInitNs=!1,this.domInitialized)try{let i=null;if(e&&(this.src&&(this.ns=null,this.ns=await (0,t.urlToNoteSequence)(this.src)),this.currentTime=0,this.ns||this.setError("No content loaded")),i=this.ns)this.seekBar.max=String(i.totalTime),this.totalTimeLabel.textContent=s(i.totalTime);else{this.seekBar.max="0",this.totalTimeLabel.textContent=s(0);return}let n=this.soundFont,o={run:t=>this.ns===i&&this.noteCallback(t),stop:()=>{}};if(null===n?this.player=new t.Player(!1,o):(""===n&&(n="https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus"),this.player=new t.SoundFontPlayer(n,void 0,void 0,void 0,o),await this.player.loadSamples(i)),this.ns!==i)return;this.setLoaded(),this.dispatchEvent(new CustomEvent("load"))}catch(t){throw this.setError(String(t)),t}}reload(){this.initPlayerNow()}start(){this._start()}_start(t=!1){(async()=>{if(this.player){if("stopped"==this.player.getPlayState()){a&&a.playing&&!(a==this&&t)&&a.stop(),a=this,this._playing=!0;let e=this.currentTime;0==this.ns.notes.filter(t=>t.startTime>e).length&&(e=0),this.currentTime=e,this.controlPanel.classList.remove("stopped"),this.controlPanel.classList.add("playing");try{for(let t of this.visualizerListeners.keys())t.noteSequence!=this.ns&&(t.noteSequence=this.ns,t.reload());let i=this.player.start(this.ns,void 0,e);t?this.dispatchEvent(new CustomEvent("loop")):this.dispatchEvent(new CustomEvent("start")),await i,this.handleStop(!0)}catch(t){throw this.handleStop(),t}}else"paused"==this.player.getPlayState()&&this.player.resume()}})()}stop(){this.player&&this.player.isPlaying()&&this.player.stop(),this.handleStop(!1)}addVisualizer(t){let e={start:()=>{t.noteSequence=this.noteSequence},stop:()=>{t.clearActiveNotes()},note:e=>{t.redraw(e.detail.note)}};for(let t of r)this.addEventListener(t,e[t]);this.visualizerListeners.set(t,e)}removeVisualizer(t){let e=this.visualizerListeners.get(t);for(let t of r)this.removeEventListener(t,e[t]);this.visualizerListeners.delete(t)}noteCallback(t){this.playing&&(this.dispatchEvent(new CustomEvent("note",{detail:{note:t}})),this.seeking||(this.seekBar.value=String(t.startTime),this.currentTimeLabel.textContent=s(t.startTime)))}handleStop(t=!1){if(t){if(this.loop){this.currentTime=0,this._start(!0);return}this.currentTime=this.duration}this.controlPanel.classList.remove("playing"),this.controlPanel.classList.add("stopped"),this._playing&&(this._playing=!1,this.dispatchEvent(new CustomEvent("stop",{detail:{finished:t}})))}setVisualizerSelector(t){for(let t of this.visualizerListeners.values())for(let e of r)this.removeEventListener(e,t[e]);if(this.visualizerListeners.clear(),null!=t)for(let e of document.querySelectorAll(t)){if(!(e instanceof o)){console.warn(`Selector ${t} matched non-visualizer element`,e);continue}this.addVisualizer(e)}}setLoading(){this.playButton.disabled=!0,this.seekBar.disabled=!0,this.controlPanel.classList.remove("error"),this.controlPanel.classList.add("loading","frozen"),this.controlPanel.removeAttribute("title")}setLoaded(){this.controlPanel.classList.remove("loading","frozen"),this.playButton.disabled=!1,this.seekBar.disabled=!1}setError(t){this.playButton.disabled=!0,this.seekBar.disabled=!0,this.controlPanel.classList.remove("loading","stopped","playing"),this.controlPanel.classList.add("error","frozen"),this.controlPanel.title=t}get noteSequence(){return this.ns}set noteSequence(t){this.ns!=t&&(this.ns=t,this.removeAttribute("src"),this.initPlayer())}get src(){return this.getAttribute("src")}set src(t){this.ns=null,this.setOrRemoveAttribute("src",t),this.initPlayer()}get soundFont(){return this.getAttribute("sound-font")}set soundFont(t){this.setOrRemoveAttribute("sound-font",t)}get loop(){return null!=this.getAttribute("loop")}set loop(t){this.setOrRemoveAttribute("loop",t?"":null)}get currentTime(){return parseFloat(this.seekBar.value)}set currentTime(t){this.seekBar.value=String(t),this.currentTimeLabel.textContent=s(this.currentTime),this.player&&this.player.isPlaying()&&this.player.seekTo(t)}get duration(){return parseFloat(this.seekBar.max)}get playing(){return this._playing}setOrRemoveAttribute(t,e){null==e?this.removeAttribute(t):this.setAttribute(t,e)}}window.customElements.define("midi-player",l),window.customElements.define("midi-visualizer",o),window.addEventListener("DOMContentLoaded",()=>{let e=document.getElementById("midiFile");e&&e.addEventListener("change",e=>{(0,t.blobToNoteSequence)(e.target.files[0]).then(t=>{document.getElementById("mainPlayer").noteSequence=t,document.getElementById("mainVisualizer").noteSequence=t}).catch(t=>{alert("Failed to load MIDI file."),console.error(t)})})})})();
//# sourceMappingURL=index.js.map
