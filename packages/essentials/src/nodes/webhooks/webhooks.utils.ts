import { EventEmitter } from 'node:events'

export const responses = new EventEmitter<Record<string, [Response]>>()
