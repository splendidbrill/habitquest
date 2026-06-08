import { useEffect, useState, useCallback, useRef } from 'react';
import Tts from 'react-native-tts';
import { speak, stop, isAvailable } from '../services/ttsService';

type Options = {
  autoRead?: string;   // text to speak immediately on mount
};

export function useTTS(options?: Options) {
  const [speaking,    setSpeaking]    = useState(false);
  const [showPrompt,  setShowPrompt]  = useState(false);
  const autoReadDone = useRef(false);

  useEffect(() => {
    const startSub  = Tts.addEventListener('tts-start',  () => setSpeaking(true));
    const finishSub = Tts.addEventListener('tts-finish', () => setSpeaking(false));
    const cancelSub = Tts.addEventListener('tts-cancel', () => setSpeaking(false));
    const errorSub  = Tts.addEventListener('tts-error',  () => setSpeaking(false));

    return () => {
      stop();
      startSub.remove();
      finishSub.remove();
      cancelSub.remove();
      errorSub.remove();
    };
  }, []);

  // Auto-read on mount
  useEffect(() => {
    if (!options?.autoRead || autoReadDone.current) return;
    autoReadDone.current = true;

    (async () => {
      const ok = await speak(options.autoRead!);
      if (!ok) setShowPrompt(true);
    })();
  }, [options?.autoRead]);

  const read = useCallback(async (text: string) => {
    const ok = await speak(text);
    if (!ok) setShowPrompt(true);
  }, []);

  const toggle = useCallback(async (text: string) => {
    if (speaking) {
      stop();
    } else {
      const ok = await speak(text);
      if (!ok) setShowPrompt(true);
    }
  }, [speaking]);

  const checkAndRead = useCallback(async (text: string) => {
    const available = await isAvailable();
    if (!available) { setShowPrompt(true); return; }
    await speak(text);
  }, []);

  return { read, toggle, stop, speaking, showPrompt, setShowPrompt, checkAndRead };
}
