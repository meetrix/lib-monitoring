/** @jsx jsx */
import preact from 'preact/compat';
import { jsx } from '@emotion/react'

import { Provider } from 'unistore/preact';
import store from './store';
import DisplayStats from './containers/DisplayCodecs.container';
import Peers from './containers/Peers.container';

export default () => {
  return(
  // @ts-ignore
  <Provider store={store}>
    {/* @ts-ignore */}
    {/* <DisplayStats/> */}
    {/* @ts-ignore */}
    <Peers/>
  </Provider>
  )
}
