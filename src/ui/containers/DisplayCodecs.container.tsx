import React from 'react';
import { Provider, connect } from 'unistore/react';
import DisplayStats, { DisplayStatsProps } from '../components/DisplayStats';
import { increment } from '../store/actions';

export default connect<DisplayStatsProps, undefined, undefined, undefined>(
  'count',
  { increment}
)(({ count, increment }) => <DisplayStats count={count} increment={increment} />)
