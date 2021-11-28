/** @jsx jsx */
import preact from 'preact/compat';
import { jsx } from '@emotion/react';
import { connect } from 'unistore/preact';
import { PeersComponent, PeersComponentProps } from '../components/PeersComponent';
import { increment } from '../store/actions';

export default connect<PeersComponentProps, undefined, undefined, undefined>(
  'peers',
  { increment }
  /* @ts-ignore */
)(({ peers }) => <PeersComponent peers={peers} />)
