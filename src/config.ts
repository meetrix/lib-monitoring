type Envoronments = 'development' | 'staging' | 'production'
const environment = process.env.NODE_ENV as Envoronments
const BACKEND_URLS = {
  development: 'http://localhost:9100/plugins',
  staging: 'https://stats.dev.meetrix.io/plugins',
  production: 'https://stats.meetrix.io/plugins'
}

export const BACKEND_URL = BACKEND_URLS[environment]
export const SOCKET_PATH = '/stats'
