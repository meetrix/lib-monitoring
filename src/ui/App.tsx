import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Peers from './containers/Peers.container';

export default () => {
  return (
    <Provider store={store}>
      {/* @ts-ignore */}
      <Peers />
    </Provider>
  );
};
