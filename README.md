
![images of savaloys](sav8.jpg)

# SAV:8
SAV8 is a web based  8 input streo audio mixing desk built with plain HTML, CSS and Javascript. 

[Try it out](https://mixer.puter.site/)

## Overview
SAV:8 is an in-browser 8-channel digital mixer for audio and video work. It can accept 8 input sources at a time, including audio files, video files (audio only), microphone, or a built-in tone generator. These inputs can be mono or streo, so we could say its a potential 16 track mixer. 

There is no recording function, you'll need a browser extention or an app like Audacity. 

### Input Channel 

- Input Selector: Choose source for the channel: File (audio), Video (extracts audio, no video display), Microphone, or Tone (synth).
- Open Button: For file/video inputs, click Open to select a file. Supported video: mp4, webm, ogg (no AVI).
- File Name: The name of the loaded file appears below the input selector.
- Mute Button: Silences the channel. Next to it is a LED-style input meter showing signal level.
- Volume: Adjusts the loudness of the channel.
- Pan: Places the sound left/right in the stereo field.
- Tone: Simple EQ (peaking filter) for the channel.
- Effect Send: Sends part of the signal to the reverb effect unit.
- Transport Controls: For file/video, use Play, Pause, Stop, and seek slider. (For video, only audio is played.)
- Microphone: Use the dropdown to select mic. Speak into your default system input. Mic turns off when you select another input.
- Tone: Built-in tone generator (sawtooth wave, 5s duration for demo).

### Master Channel

- Mute: Mutes all output.
- Volume, Pan, Tone: Controls for overall output.
- Effect: Toggles the reverb effect on/off for the master output.
- Master Meters: Stereo level meters for overall output.

### Effects Unit
- Reverb: Controls the level of reverb effect applied to channels with an effects send.

### Supported File Types

- Audio: Most web-friendly formats (mp3, wav, ogg, m4a etc.).
- Video: mp4, webm, ogg. (Audio only, no video display in this version.) Not Supported: avi and some proprietary formats.
- MIDI: supports playing midi files through the built in midi player, I use this one: https://github.com/cifkao/html-midi-player

### Tips & Troubleshooting

- Browser Autoplay: Audio context may need an initial user action (click/select) to start. If mic doesn't work immediately, try loading and playing an audio file first, or just click once in the mixer area.
- Microphone: Grant permission when prompted. Mic stops as soon as you select another input.
- Video Input: Only audio is used; the video image is not shown in this version.
- Performance: For best results, use a modern browser (Chrome, Edge, Firefox). Some features may not work on mobile or older browsers.
- Files Don't Play: Try converting to a supported format if a file fails to load.

### Keyboard & Accessibility
Most controls support keyboard navigation (Tab, Enter, Space, Arrow keys on sliders). No speech control

### Installing

Copy the files to a server or locally and you are ready to go. It's a node free zone.

### License

Creative commons license - CC BY-SA 

### About

SAV8 is a web-based mixer for creative audio work, prototyping, and fun!

Created by CD-Xbow with significant help from his silicon friend, GitHub Copilot.

### Future plans 

- support MOD files
- Make a puter app out of it
- More FX
- Better Eq


