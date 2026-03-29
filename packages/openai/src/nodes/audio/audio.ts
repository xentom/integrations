import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import * as pins from '@/pins'

const nodes = i.nodes.group('Audio')

export const textToSpeech = nodes.action({
  description: 'Convert text to spoken audio using a text-to-speech model.',
  inputs: {
    input: i.pins.data({
      description:
        'The text to synthesize into speech. Maximum 4096 characters.',
      schema: v.pipe(v.string(), v.maxLength(4096)),
      control: i.controls.text({
        placeholder: 'Hello, how can I help you today?',
        rows: 4,
      }),
    }),
    model: pins.audio.speechModel,
    voice: pins.audio.voice,
    instructions: i.pins.data({
      description:
        'Control the voice style and tone. Only supported on gpt-4o-mini-tts.',
      schema: v.string(),
      control: i.controls.text({
        placeholder: 'Speak in a calm, professional tone.',
        rows: 2,
      }),
      optional: true,
    }),
    response_format: pins.audio.speechFormat.with({ optional: true }),
    speed: i.pins.data({
      description:
        'The speed of the generated audio. Between 0.25 and 4.0. Defaults to 1.0.',
      schema: v.pipe(v.number(), v.minValue(0.25), v.maxValue(4.0)),
      control: i.controls.number({ default: 1.0 }),
      optional: true,
    }),
  },
  outputs: {
    audio: pins.audio.speech,
  },
  async run(opts) {
    const audio = await opts.state.client.audio.speech.create({
      input: opts.inputs.input,
      model: opts.inputs.model,
      voice: opts.inputs.voice,
      instructions: opts.inputs.instructions,
      response_format: opts.inputs.response_format as
        | 'mp3'
        | 'opus'
        | 'aac'
        | 'flac'
        | 'wav'
        | 'pcm'
        | undefined,
      speed: opts.inputs.speed,
    })

    return opts.next({ audio })
  },
})

export const transcribeAudio = nodes.action({
  description: 'Transcribe spoken audio into text.',
  inputs: {
    file: i.pins.data<File>({
      description:
        'The audio file to transcribe. Supported formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, webm.',
    }),
    model: pins.audio.transcriptionModel,
    language: i.pins.data({
      description:
        'The language of the audio in ISO-639-1 format (e.g. "en"). Improves accuracy.',
      schema: v.string(),
      control: i.controls.text({ placeholder: 'en' }),
      optional: true,
    }),
    prompt: i.pins.data({
      description:
        'Optional context to guide the transcription style or continue a previous segment.',
      schema: v.string(),
      control: i.controls.text({
        placeholder: 'The following is a conversation about...',
        rows: 2,
      }),
      optional: true,
    }),
    temperature: i.pins.data({
      description:
        'Sampling temperature between 0 and 1. Higher values produce more varied output.',
      schema: v.pipe(v.number(), v.minValue(0), v.maxValue(1)),
      control: i.controls.number({ default: 0 }),
      optional: true,
    }),
  },
  outputs: {
    transcription: pins.audio.transcription,
    text: i.pins.data({
      description: 'The transcribed text.',
      schema: v.string(),
    }),
  },
  async run(opts) {
    const transcription = await opts.state.client.audio.transcriptions.create({
      file: opts.inputs.file,
      model: opts.inputs.model,
      language: opts.inputs.language,
      prompt: opts.inputs.prompt,
      temperature: opts.inputs.temperature,
      response_format: 'json',
    })

    return opts.next({
      transcription,
      text: transcription.text,
    })
  },
})

export const translateAudio = nodes.action({
  description: 'Translate spoken audio into English text using Whisper.',
  inputs: {
    file: i.pins.data<File>({
      description:
        'The audio file to translate. Supported formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, webm.',
    }),
    prompt: i.pins.data({
      description:
        'Optional English text to guide the translation style or continue a previous segment.',
      schema: v.string(),
      control: i.controls.text({
        placeholder: 'The following is a conversation about...',
        rows: 2,
      }),
      optional: true,
    }),
    temperature: i.pins.data({
      description:
        'Sampling temperature between 0 and 1. Higher values produce more varied output.',
      schema: v.pipe(v.number(), v.minValue(0), v.maxValue(1)),
      control: i.controls.number({ default: 0 }),
      optional: true,
    }),
  },
  outputs: {
    translation: pins.audio.translation,
    text: i.pins.data({
      description: 'The translated text in English.',
      schema: v.string(),
    }),
  },
  async run(opts) {
    const translation = await opts.state.client.audio.translations.create({
      file: opts.inputs.file,
      model: 'whisper-1',
      prompt: opts.inputs.prompt,
      temperature: opts.inputs.temperature,
      response_format: 'json',
    })

    return opts.next({
      translation,
      text: translation.text,
    })
  },
})
