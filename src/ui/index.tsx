import { render } from 'preact';
import App from './App';

let container: Element | (() => void) | undefined
const DIV_ID = 'lib-call-quality-monitoring-ui'

export const mountUI = () => {
  container = document.createElement('div')
  container.id = DIV_ID
  container.setAttribute(
    'style',
    'background-color:white; font-size:1rem; position: fixed; bottom: 0; right: 0;'
  )
  return document.body.insertAdjacentElement('beforeend', container)
}

export const updateUI = () => {
  if (!container) return;
  render(
    <App/>, container as Element
  );
}
