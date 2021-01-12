import axios from 'axios'
import { Report } from '../types'

export default class API {
  backendUrl: string

  constructor(backendUrl: string) {
    this.backendUrl = backendUrl
  }

  async report(event: Report) {
    try {
      const response = await axios.post(this.backendUrl, event)
      console.log(response)
    } catch (error) {
      console.error('Meetrix:callQualityMonitor:', error)
    }
  }
}
