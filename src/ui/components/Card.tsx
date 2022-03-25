import { ComponentType } from 'react';
import { css } from '@emotion/css';
import { withTheme, WithTheme } from '@emotion/react';
import { Theme } from '@mui/material';

export interface CardComponentProps {

}

const _Card = (props: WithTheme<CardComponentProps, Theme>) => {
  const styles = {
    background: props.theme.palette.background.default
  };
  return(<div
    className={css(styles)}
  ></div>)
}

export const Card = withTheme(_Card);

export default Card;
