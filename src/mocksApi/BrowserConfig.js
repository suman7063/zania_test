import { setupWorker } from 'msw/browser'
import { serviceConfig } from '../mocksApi/ServiceConfig'

export const worker = setupWorker(...serviceConfig)