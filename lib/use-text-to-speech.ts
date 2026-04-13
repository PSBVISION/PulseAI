import { useState, useCallback, useRef, useEffect } from 'react';

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
    if (voices.length > 0) {
      setAvailableVoices(voices);
      return;
    }
    // If no voices are available, they might be loading
    // This should trigger the onvoiceschanged event
  }, [synth]);

  // Set up voice loading on component mount
  useEffect(() => {
    if (!synth) return;

    // Load voices immediately
    loadVoices();

    // Also listen for when voices become available
    const handleVoicesChanged = () => {
      loadVoices();
    };

    synth.onvoiceschanged = handleVoicesChanged;

    return () => {
      if (synth) {
        synth.onvoiceschanged = null;
      }
    };
  }, [synth, loadVoices]);

  const speak = useCallback(
    (text: string, options: UseTextToSpeechOptions = {}) => {
      if (!synth) {
        console.warn('Speech synthesis not supported');
        return;
      }

      if (!text || typeof text !== 'string') {
        console.warn('Invalid text provided to speak');
        return;
      }

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

      // Ensure voices are loaded
      let voicesToUse = availableVoices;
      if (voicesToUse.length === 0) {
        // Try to get voices one more time
        voicesToUse = synth.getVoices();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Validate and set speech parameters
      utterance.rate = Math.max(0.1, Math.min(2, rate));
      utterance.pitch = Math.max(0, Math.min(2, pitch));
      utterance.volume = Math.max(0, Math.min(1, volume));
      utterance.lang = language;

      // Set voice if available
      if (voicesToUse.length > 0) {
        const voiceIdx = Math.min(
          voiceIndex,
          voicesToUse.length - 1
        );
        utterance.voice = voicesToUse[voiceIdx];
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
        console.error('Error details:', {
          error: event.error,
          utterance: {
            text: utterance.text,
            rate: utterance.rate,
            pitch: utterance.pitch,
            volume: utterance.volume,
            lang: utterance.lang,
          },
        });
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utteranceRef.current = utterance;
      try {
        synth.speak(utterance);
      } catch (error) {
        console.error('Failed to call synth.speak:', error);
        setIsSpeaking(false);
        setIsPaused(false);
      }
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
