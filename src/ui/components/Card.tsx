import { ComponentType } from 'react';
import { css } from '@emotion/css';
import { WithTheme, withTheme } from '../providers/themeProvider';

export interface CardComponentProps {

}

const _Card = (props: WithTheme<CardComponentProps>) => {
  const styles = {
    background: props.theme.palette.background.default
  };
  return(<div
    className={css(styles)}
  ></div>)
}

export const Card = withTheme(_Card);

export default Card;
