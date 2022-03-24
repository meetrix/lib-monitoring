import React from 'react';
import { Button, ButtonProps, Theme, Typography } from '@mui/material';
import { withStyles, createStyles, WithStyles } from '@mui/styles';
import { css } from '@emotion/css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import DataSaverOffIcon from '@mui/icons-material/DataSaverOff';
import clsx from 'clsx';

const styles = (theme: Theme) => {
  return createStyles({
    applyFlex: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    icon: {
      display: 'flex',
      alignItems: 'center',
      marginRight: 10,
      width: 20,
    },
    label: {
      color: '#000',
    },
    rotatingEffect: {
      animation: `$icon-rotation 1s linear infinite`,
      color: '#00000061',
    },
    "@keyframes icon-rotation": {
      '0%': {
        transform: 'rotate(0)',
      },
      '100%': {
        transform: 'rotate(360deg)',
      },
    },
  });
};

export interface TestListRowProps
  extends WithStyles<ButtonProps & typeof styles> {
  label?: string;
  type?: 'success' | 'fail' | 'unset' | 'running' | 'result';
  message?: string;
}

export const TestListRow: React.FC<TestListRowProps> = ({
  classes,
  label,
  type = 'unset',
  message,
  ...otherProps
}: TestListRowProps) => {
  const rootStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };
  const colors = {
    success: {
      color: '#7CC479',
      '& .label-styles': {
        color: '#00000061',
      }
    },
    fail: {
      color: '#F05353',
      '& .label-styles': {
        color: '#00000061',
      }
    },
    running: {},
    unset: {},
    result: {},
  };


  const renderIcon = () => {
    switch(type) {
      case 'success':
        return <CheckCircleIcon fontSize="small"/>
      case 'fail':
        return <ErrorIcon fontSize="small" />
      case 'running':
        return <DataSaverOffIcon fontSize="small" className={classes.rotatingEffect} />
      case 'result':
        return <ErrorIcon fontSize="small" />
      case 'unset':
          return null
      default:
        return null;
    }
  }
  return (
    <div className={css({ ...colors[type], ...rootStyles})}>
      <div className={classes.applyFlex}>
        <div className={classes.icon}>{renderIcon()}</div>
        <Typography variant="body2" className={clsx(classes.label, 'label-styles')}>{label}</Typography>
      </div>
      {message && <Typography variant="body2">{message}</Typography>}
    </div>
  );
};

export default withStyles(styles)(TestListRow);
