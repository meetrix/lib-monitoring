type Environments = 'development' | 'staging' | 'production';
const environment = process.env.NODE_ENV as Environments;
const BACKEND_URLS = {
  development: 'http://localhost:9100',
  staging: 'https://apiwr.dev.meetrix.io',
  production: 'https://stats.meetrix.io',
};

export const BACKEND_WS = `${BACKEND_URLS[environment]}/clients`;
export const BACKEND_REST = `${BACKEND_URLS[environment]}/v1`;
export const SOCKET_PATH = '/stats';

export const API_KEY = process.env.API_KEY || '';

export const turn = {
  uri: process.env.TURN_URI || 'turn:development6.meetrix.io:3478',
  username: process.env.TURN_USERNAME || '1647236552',
  credential: process.env.TURN_CREDENTIALS || 'OrSL7J+tjB9u+FcLgJMQLMupjic=',
};

export const stun = {
  uri: process.env.STUN_URI || 'stun:meet-jit-si-turnrelay.jitsi.net:443',
};
