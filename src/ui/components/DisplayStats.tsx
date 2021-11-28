/** @jsx jsx */
import preact from 'preact/compat';
import { jsx } from '@emotion/react';
import { PeerComponent } from './PeerComponent';

export interface DisplayStatsProps {
  count: number,
  increment: () => void
};

const DisplayStats = ({ count, increment }: DisplayStatsProps) => {
  return (
    <div>
      <button
        css={{
          color: 'hotpink'
        }}
        onClick={increment}
      >
        {`Hello ${count}`}
      </button>
    </div>
  );
}

export default DisplayStats;
