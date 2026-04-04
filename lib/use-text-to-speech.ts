import { useState, useCallback, useRef } from 'react';

interface UseTextToSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  language?: string;
  voiceIndex?: number;
}

interface UseTextToSpeechResult {
  isSupported: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  availableVoices: SpeechSynthesisVoice[];
  speak: (text: string, options?: UseTextToSpeechOptions) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setVoice: (voiceIndex: number) => void;
}

export function useTextToSpeech(): UseTextToSpeechResult {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const voiceIndexRef = useRef(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported = Boolean(synth);

  // Load available voices
  const loadVoices = useCallback(() => {
    if (!synth) return;
    const voices = synth.getVoices();
    setAvailableVoices(voices);
  }, [synth]);

  if (synth && typeof window !== 'undefined') {
    // Load voices when they become available
    synth.onvoiceschanged = loadVoices;
  }

  const speak = useCallback(
    (text: string, options: UseTextToSpeechOptions = {}) => {
      if (!synth) return;

      const {
        rate = 1,
        pitch = 1,
        volume = 0.9,
        language = 'en-US',
        voiceIndex = 0,
      } = options;

      // Cancel any ongoing speech
      if (synth.speaking) {
        synth.cancel();
      }

      // Load voices if not already loaded
      if (availableVoices.length === 0) {
        loadVoices();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      utterance.lang = language;

      // Set voice if available
      if (availableVoices.length > 0) {
        const voiceIdx = Math.min(
          voiceIndex,
          availableVoices.length - 1
        );
        utterance.voice = availableVoices[voiceIdx];
        voiceIndexRef.current = voiceIdx;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utteranceRef.current = utterance;
      synth.speak(utterance);
    },
    [synth, availableVoices, loadVoices]
  );

  const pause = useCallback(() => {
    if (!synth || !synth.speaking) return;
    synth.pause();
    setIsPaused(true);
  }, [synth]);

  const resume = useCallback(() => {
    if (!synth || !synth.paused) return;
    synth.resume();
    setIsPaused(false);
  }, [synth]);

  const stop = useCallback(() => {
    if (!synth) return;
    synth.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, [synth]);

  const setVoice = useCallback(
    (voiceIndex: number) => {
      if (voiceIndex >= 0 && voiceIndex < availableVoices.length) {
        voiceIndexRef.current = voiceIndex;
      }
    },
    [availableVoices]
  );

  return {
    isSupported,
    isSpeaking,
    isPaused,
    availableVoices,
    speak,
    pause,
    resume,
    stop,
    setVoice,
  };
}
