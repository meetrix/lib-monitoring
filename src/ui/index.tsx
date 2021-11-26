import { render } from 'preact';
import DisplayStats from './DisplayStats';

let container: Element | (() => void) | undefined
const DIV_ID = 'lib-call-quality-monitoring-ui'

export const mountUI = () => {
  container = document.createElement('div')
  container.id = DIV_ID
  container.setAttribute(
    'style',
    'background-color:red; font-size:2em; position: fixed; bottom: 0; right: 0;'
  )
  return document.body.insertAdjacentElement('beforeend', container)
}

export const updateUI = () => {
  if (!container) return;
  render(
    <DisplayStats/>, container as Element
  );
}
