import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type Transcription, type Translation } from 'openai/resources/audio'

export const transcription = i.pins.data<Transcription>({
  description: 'A transcription object containing the transcribed text.',
})

export const translation = i.pins.data<Translation>({
  description: 'A translation object containing the translated text.',
})

export const speech = i.pins.data<Response>({
  description: 'The raw audio response from the text-to-speech API.',
})

export const speechModel = i.pins.data({
  displayName: 'Model',
  description: 'The text-to-speech model to use.',
  schema: v.string(),
  control: i.controls.select({
    default: 'gpt-4o-mini-tts',
    options: [
      {
        value: 'gpt-4o-mini-tts',
        label: 'GPT-4o Mini TTS',
        description: 'Fast, efficient text-to-speech model.',
      },
      {
        value: 'tts-1',
        label: 'TTS-1',
        description: 'Standard text-to-speech model.',
      },
      {
        value: 'tts-1-hd',
        label: 'TTS-1 HD',
        description: 'High-definition text-to-speech model.',
      },
    ],
  }),
})

export const voice = i.pins.data({
  displayName: 'Voice',
  description: 'The voice to use for speech synthesis.',
  schema: v.string(),
  control: i.controls.select({
    default: 'alloy',
    options: [
      { value: 'alloy', label: 'Alloy' },
      { value: 'ash', label: 'Ash' },
      { value: 'ballad', label: 'Ballad' },
      { value: 'cedar', label: 'Cedar' },
      { value: 'coral', label: 'Coral' },
      { value: 'echo', label: 'Echo' },
      { value: 'marin', label: 'Marin' },
      { value: 'sage', label: 'Sage' },
      { value: 'shimmer', label: 'Shimmer' },
      { value: 'verse', label: 'Verse' },
    ],
  }),
})

export const transcriptionModel = i.pins.data({
  displayName: 'Model',
  description: 'The speech-to-text model to use.',
  schema: v.string(),
  control: i.controls.select({
    default: 'gpt-4o-transcribe',
    options: [
      {
        value: 'gpt-4o-transcribe',
        label: 'GPT-4o Transcribe',
        description: 'High-accuracy transcription model.',
      },
      {
        value: 'gpt-4o-mini-transcribe',
        label: 'GPT-4o Mini Transcribe',
        description: 'Fast, efficient transcription model.',
      },
      {
        value: 'whisper-1',
        label: 'Whisper-1',
        description: 'General-purpose speech recognition model.',
      },
    ],
  }),
})

export const speechFormat = i.pins.data({
  displayName: 'Response Format',
  description: 'The audio format of the generated speech.',
  schema: v.string(),
  control: i.controls.select({
    default: 'mp3',
    options: [
      { value: 'mp3', label: 'MP3' },
      { value: 'opus', label: 'Opus' },
      { value: 'aac', label: 'AAC' },
      { value: 'flac', label: 'FLAC' },
      { value: 'wav', label: 'WAV' },
      { value: 'pcm', label: 'PCM' },
    ],
  }),
})
