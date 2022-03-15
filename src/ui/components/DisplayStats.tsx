import React from 'react';
import { PeerComponent } from './PeerComponent';
import { css } from '@emotion/css';

export interface DisplayStatsProps {
  count: number,
  increment: () => void
};

const DisplayStats = ({ count, increment }: DisplayStatsProps) => {
  return (
    <div>
      <button
        className={css({
          color: 'hotpink'
        })}
        onClick={increment}
      >
        {`Hello ${count}`}
      </button>
    </div>
  );
}

export default DisplayStats;
