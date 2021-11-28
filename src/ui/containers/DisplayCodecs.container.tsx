/** @jsx jsx */
import preact from 'preact/compat';
import { jsx } from '@emotion/react';
import { Provider, connect } from 'unistore/preact';
import DisplayStats, { DisplayStatsProps } from '../components/DisplayStats';
import { increment } from '../store/actions';

export default connect<DisplayStatsProps, undefined, undefined, undefined>(
  'count',
  { increment}
)(({ count, increment }) => <DisplayStats count={count} increment={increment} />)
