type Envoronments = 'development' | 'staging' | 'production'
const environment = process.env.NODE_ENV as Envoronments
const BACKEND_URLS = {
  development: 'http://localhost:9100',
  staging: 'https://stats.dev.meetrix.io',
  production: 'https://stats.meetrix.io'
}

export const BACKEND_URL = BACKEND_URLS[environment]
export const SOCKET_PATH = '/stats/'
