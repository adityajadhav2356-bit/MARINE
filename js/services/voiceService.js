// MARIX Marine Bridge Console — Voice-First Multimodal Audio Subsystem (STT & TTS)
// Manages real-time ship intercom speech recognition, tactical voice synthesis,
// multi-language dialect mapping (EN / HI / MR), and nautical voice commands.

export class VoiceService {
  constructor() {
    this.recognition = null;
    this.isRecording = false;
    this.currentLanguage = localStorage.getItem('orca_lang') || 'en';
    this.synth = window.speechSynthesis || null;
    this.currentUtterance = null;
    this.isVoiceOutputEnabled = true;

    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
      this.updateLanguage(this.currentLanguage);
    }
  }

  updateLanguage(lang) {
    this.currentLanguage = lang;
    if (!this.recognition) return;

    // Map MARIX language to standard BCP-47 locale tags
    const langMap = {
      en: 'en-IN',
      hi: 'hi-IN',
      mr: 'mr-IN'
    };
    this.recognition.lang = langMap[lang] || 'en-IN';
  }

  startListening({ onInterim, onFinal, onEnd, onError }) {
    if (!this.recognition) {
      this.initSpeechRecognition();
    }

    if (!this.recognition) {
      if (onError) onError('Speech recognition is not supported in this browser. Please use Chrome/Edge or type directly.');
      return false;
    }

    if (this.isRecording) {
      this.stopListening();
      return false;
    }

    this.isRecording = true;
    this.updateLanguage(localStorage.getItem('orca_lang') || 'en');

    this.recognition.onstart = () => {
      this.isRecording = true;
      window.dispatchEvent(new CustomEvent('marix:voice-start'));
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (onInterim && interimTranscript) {
        onInterim(interimTranscript);
      }

      if (onFinal && finalTranscript) {
        onFinal(finalTranscript);
      }
    };

    this.recognition.onerror = (event) => {
      console.warn('[VoiceService] Recognition error:', event.error);
      this.isRecording = false;
      window.dispatchEvent(new CustomEvent('marix:voice-end'));
      if (onError) onError(event.error);
    };

    this.recognition.onend = () => {
      this.isRecording = false;
      window.dispatchEvent(new CustomEvent('marix:voice-end'));
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
      return true;
    } catch (e) {
      console.warn('[VoiceService] start error:', e);
      this.isRecording = false;
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isRecording) {
      this.isRecording = false;
      try {
        this.recognition.stop();
      } catch (e) {}
      window.dispatchEvent(new CustomEvent('marix:voice-end'));
    }
  }

  // Text-to-Speech Tactical Radio Readout
  speak(text, { onStart, onEnd, pitch = 1.0, rate = 1.05 } = {}) {
    if (!this.synth || !this.isVoiceOutputEnabled) return;

    this.stopSpeaking();

    // Clean markdown and formatting symbols from text for clean tactical audio speech
    const cleanText = text
      .replace(/[#*_`~\[\]\(\)>]/g, ' ')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    this.currentUtterance = utterance;

    const langMap = {
      en: 'en-IN',
      hi: 'hi-IN',
      mr: 'mr-IN'
    };
    utterance.lang = langMap[this.currentLanguage] || 'en-IN';
    utterance.pitch = pitch;
    utterance.rate = rate;

    // Pick a natural sounding voice if available
    const voices = this.synth.getVoices();
    const matchVoice = voices.find(v => v.lang.startsWith(utterance.lang.substring(0, 2)) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('India')));
    if (matchVoice) {
      utterance.voice = matchVoice;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
      window.dispatchEvent(new CustomEvent('marix:speech-start'));
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
      window.dispatchEvent(new CustomEvent('marix:speech-end'));
    };

    utterance.onerror = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
      window.dispatchEvent(new CustomEvent('marix:speech-end'));
    };

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
      window.dispatchEvent(new CustomEvent('marix:speech-end'));
    }
  }

  toggleVoiceOutput() {
    this.isVoiceOutputEnabled = !this.isVoiceOutputEnabled;
    if (!this.isVoiceOutputEnabled) {
      this.stopSpeaking();
    }
    return this.isVoiceOutputEnabled;
  }

  // Parse spoken voice commands for direct hands-free bridge control
  checkVoiceNavigationCommand(transcript) {
    const t = (transcript || '').toLowerCase().trim();
    if (t.includes('open map') || t.includes('show map') || t.includes('view map') || t.includes('marine chart')) {
      window.location.hash = '#/map';
      return 'Navigating to Marine Chart';
    } else if (t.includes('open safety') || t.includes('show alerts') || t.includes('safety alerts') || t.includes('emergency')) {
      window.location.hash = '#/safety';
      return 'Navigating to Safety & Alerts';
    } else if (t.includes('route planner') || t.includes('plan route') || t.includes('show route')) {
      window.location.hash = '#/route';
      return 'Navigating to Route Planner';
    } else if (t.includes('ocean research') || t.includes('show research') || t.includes('sst trend')) {
      window.location.hash = '#/research';
      return 'Navigating to Oceanographic Research';
    } else if (t.includes('bridge home') || t.includes('go home') || t.includes('dashboard')) {
      window.location.hash = '#/';
      return 'Navigating to Bridge Home';
    } else if (t.includes('demo login') || t.includes('switch stakeholder') || t.includes('login screen')) {
      window.location.hash = '#/login';
      return 'Navigating to Demo Login Hub';
    }
    return null;
  }
}

export const voiceService = new VoiceService();
