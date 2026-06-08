import Tts from 'react-native-tts';

let ready   = false;
let checked = false;
let ttsOk   = true;

async function init(): Promise<boolean> {
  if (checked) return ttsOk;
  checked = true;

  try {
    await Tts.setDefaultLanguage('en-GB');
    await Tts.setDefaultRate(0.48);
    await Tts.setDefaultPitch(1.0);

    const voices = await Tts.voices();
    if (!voices?.length) { ttsOk = false; return false; }

    const british = voices.find(v => v.language === 'en-GB' && v.name === 'Daniel')
      ?? voices.find(v => v.language === 'en-GB' && v.name === 'Kate')
      ?? voices.find(v => v.language?.startsWith('en-GB'));
    if (british) await Tts.setDefaultVoice(british.id);

    ready = true;
    return true;
  } catch {
    ttsOk = false;
    return false;
  }
}

// Returns false if TTS is unavailable — caller should show the install prompt
export async function speak(text: string): Promise<boolean> {
  const ok = await init();
  if (!ok) return false;
  Tts.stop();
  Tts.speak(text);
  return true;
}

export function stop(): void {
  try { Tts.stop(); } catch {}
}

export async function isAvailable(): Promise<boolean> {
  return init();
}
