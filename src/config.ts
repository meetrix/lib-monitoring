type Envoronments = 'development' | 'staging' | 'production'
const environment = process.env.NODE_ENV as Envoronments
const BACKEND_URLS = {
  development: 'http://localhost:9100/clients',
  staging: 'https://apiwr.dev.meetrix.io/clients',
  production: 'https://stats.meetrix.io/clients'
}

export const BACKEND_URL = BACKEND_URLS[environment]
export const SOCKET_PATH = '/stats'
