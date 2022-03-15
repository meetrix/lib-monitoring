import React from 'react';
import { Provider } from 'unistore/react';
import store from './store';
import DisplayStats from './containers/DisplayCodecs.container';
import Peers from './containers/Peers.container';
import { URLParametersProvider } from './providers/urlParameters';
import { ThemeProvider } from '@mui/material/styles';

export default () => {
  return(
  <Provider store={store}>
        {/* @ts-ignore */}
        <Peers/>
  </Provider>
  )
}
