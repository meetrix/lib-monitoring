import React, { useEffect } from 'react';
import {
  Modal,
  Button,
  Theme,
  Typography,
  Box,
  Divider,
  IconButton,
  ButtonProps,
} from '@mui/material';
import { withStyles, createStyles, WithStyles } from '@mui/styles';
import CloseIcon from '@mui/icons-material/Close';

import TestListRow from './TestListRow';
import { ITestView, components, subComponents, ISubMessages } from '../slice/types';

const styles = (theme: Theme) => {
  return createStyles({
    root: {
      width: 'clamp(550px ,40vw, 700px)',
      margin: 'auto',
    },
    closeButton: {
      position: 'absolute !important' as 'absolute',
      top: 0,
      right: 0,
    },
    contentWrapper: {
      backgroundColor: '#fff',
      padding: '3vw',
      borderRadius: 5,
    },
    listWrapper: {},
    bottomWrapper: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
  });
};

export interface TestModalProps extends WithStyles<ButtonProps & typeof styles> {
  label?: string;
  open: boolean;
  data: ITestView[];
  testId?: string;
  onClose?: () => void;
  onRetry?: () => void;
}

function deriveStatus(data: ITestView[], testId?: string) {
  const status = data.every(({ status }) => status === 'success')
    ? 'success'
    : data.every(({ status }) => status === '')
    ? ''
    : data.some(({ status }) => status === 'failure')
    ? 'failure'
    : 'running';

  let statusMessage = 'Tests not run';
  switch (status) {
    case 'success':
      statusMessage = 'All tests passed';
      break;
    case 'failure':
      statusMessage = testId
        ? 'Unfortunately you can’t make video calls through this browser, and your devices is not compatible.'
        : 'Waiting';
      break;
    case 'running':
      statusMessage = 'Running tests';
      break;
    default:
      break;
  }
  return { status, statusMessage };
}

const getLastAvailableSubMessage = (row: ITestView) => {
  const subComp = subComponents[row.key];
  for (let i = subComp.length - 1; i >= 0; i--) {
    const subComponent = subComp[i];
    const subMessage = row?.subMessages[subComponent] && [...row.subMessages[subComponent]].pop();
    if (subMessage) {
      return subMessage;
    }
  }

  return '';
};

export const TestModal: React.FC<TestModalProps> = ({
  classes,
  label,
  open,
  data,
  testId,
  onClose: handleClose,
  onRetry: handleRetry,
  ...otherProps
}: TestModalProps) => {
  const { status, statusMessage } = deriveStatus(data, testId);

  useEffect(() => {
    if (open && status === '') {
      handleRetry?.();
    }
  }, [!!handleRetry, open, status]);

  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (/*reason === 'backdropClick' && */ status === 'running') return;
        handleClose?.();
      }}
      className={classes.root}
      disableEnforceFocus
      aria-labelledby="test-modal-title"
      aria-describedby="test-modal-description"
    >
      <Box className={classes.contentWrapper}>
        <IconButton aria-label="close" className={classes.closeButton}>
          <CloseIcon fontSize="small" />
        </IconButton>
        <Typography id="test-modal-title" variant="h6" component="h2">
          Let’s test your devices and network connection
        </Typography>
        <Typography id="test-modal-description" variant="caption" color="darkgray">
          Please do not close this window until the test completes
        </Typography>
        <div className={classes.listWrapper}>
          {data.map(row => {
            return (
              <TestListRow {...row} message={row.message || getLastAvailableSubMessage(row)} />
            );
          })}
        </div>
        <Divider />
        <TestListRow label={statusMessage} status={status} />
        <div className={classes.bottomWrapper}>
          <Typography id="test-modal-title" variant="caption" color="darkgray">
            {testId && `TEST ID: ${testId}`}
          </Typography>
          <Button disabled={!testId} onClick={handleRetry}>
            Test again
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default withStyles(styles)(TestModal);
