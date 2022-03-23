import React from 'react';
import { css } from '@emotion/css';
import Button from '@mui/material/Button';

/**
 * Primary UI component for user interaction
 */

export interface ButtonComponentProps {
  color?: 'primary' | 'secondary';
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Button contents
   */
  label?: string;
  /**
   * Optional click handler
   */
  onClick?: () => {}
}
export const ButtonComponent = ({ color = 'primary', backgroundColor, size = 'medium', label, ...props }: ButtonComponentProps) => {
  const baseStyles = {
    fontFamily: "'Nunito Sans', 'Helvetica Neue',Helvetica, Arial, sans-serif",
    fontWeight: 700,
    border: 0,
    borderRadius: '3em',
    cursor: 'pointer',
    display: 'inline-block',
    lineHeight: 1,
  }
  const colors = {
    primary: {
      color: 'white',
      backgroundColor: '#1ea7fd'
    },
    secondary: {
      color: '#333',
      backgroundColor: 'transparent',
      boxShadow: 'rgba(92, 85, 85, 0.15) 0px 0px 0px 1px inset'
    }
  };

  const sizes = {
    small: {
      fontSize: '12px',
      padding: '10px 16px'
    },
    medium: {
      fontSize: '14px',
      padding: '11px 20px'
    },
    large: {
      fontSize: '16px',
      padding: '12px 24px'
    }
  }
  return (
    <Button
      className={css({
        ...baseStyles,
        ...colors[color],
        ...sizes[size]

      })}
      // {...props}
    >
      {label}
    </Button>
  );
};

export default ButtonComponent;
