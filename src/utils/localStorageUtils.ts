import debugLib from 'debug'

const debug = debugLib('localStorageUtils:')
debug.enabled = true

export const CLIENT_ID = 'clientId'

export const getClientId = (): string | null => {
  try {
    return localStorage.getItem(CLIENT_ID)
  } catch (error) {
    debug('Error, could not parse clientId from local storage', error)
    return null
  }
}

export const setClientId = (clientId: string): void => {
  try {
    return localStorage.setItem(CLIENT_ID, clientId)
  } catch (error) {
    debug('Error, could not store clientId in local storage', error)
    throw error
  }
}

export const removeClientId = (): void => {
  localStorage.removeItem(CLIENT_ID)
}
