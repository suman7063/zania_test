import { setupWorker } from 'msw/browser'
import { serviceConfig } from './ServiceConfig'

export const worker = setupWorker(...serviceConfig)