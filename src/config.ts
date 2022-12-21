export const BACKEND_URL =
  process.env.REACT_APP_ENVIRONMENT === 'production'
    ? window._env_.REACT_APP_API_BASE_URL
    : process.env.REACT_APP_API_BASE_URL || 'https://apiwr.dev.meetrix.io';

export const SOCKET_PATH = '/stats';

export const API_KEY =
  process.env.REACT_APP_ENVIRONMENT === 'production'
    ? window._env_.API_KEY
    : process.env.API_KEY || '';
export const turn = {
  uri:
    process.env.REACT_APP_ENVIRONMENT === 'production'
      ? window._env_.TURN_URI
      : process.env.TURN_URI || 'turn:coturnwr.dev.meetrix.io:3478',
  username:
    process.env.REACT_APP_ENVIRONMENT === 'production'
      ? window._env_.TURN_USERNAME
      : process.env.TURN_USERNAME || 'user',
  credential: process.env.TURN_CREDENTIALS || 'X5jjSZ5a1d',
};

export const stun = {
  uri:
    process.env.REACT_APP_ENVIRONMENT === 'production'
      ? window._env_.STUN_URI
      : process.env.STUN_URI || 'stun:meet-jit-si-turnrelay.jitsi.net:443',
};
