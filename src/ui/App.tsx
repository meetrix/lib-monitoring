import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
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
