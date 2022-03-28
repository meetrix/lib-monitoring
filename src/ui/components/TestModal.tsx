import React from 'react';
import { Modal, Button, ButtonProps, Theme, Typography, Box, Divider, IconButton } from '@mui/material';
import { withStyles, createStyles, WithStyles } from '@mui/styles';
import CloseIcon from '@mui/icons-material/Close';
import clsx from 'clsx';
import TestListRow from './TestListRow';

const styles = (theme: Theme) => {
  return createStyles({
    root: {
      width: 'clamp(550px ,40vw, 700px)',
    },
    closeButton: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
    contentWrapper: {
      backgroundColor: '#fff',
      padding: '3vw',
      borderRadius: 5,
    },
    listWrapper: {

    },
    bottomWrapper: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    }
  });
};

export interface TestModalProps
  extends WithStyles<ButtonProps & typeof styles> {
  label?: string;
  open: boolean;
  handleClose?: () => {};
}

export const TestModal: React.FC<TestModalProps> = ({
  classes,
  label,
  open,
  handleClose,
  ...otherProps
}: TestModalProps) => {

  const ModalListData = [
    {
      label: 'Checking your browser',
      type: 'error',
      message: 'Your browser is not compatible',
    },
    {
      label: 'Checking your microphone',
      type: 'success',
      message: 'No issues found',
    },
    {
      label: 'Checking your camera',
      type: 'running',
      message: undefined,
    },
    {
      label: 'Checking your network connection',
      type: 'unset',
      message: undefined,
    }
  ]

  return (
    <Modal
        open={open}
        onClose={handleClose}
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
            {ModalListData.map((data) => {
              return <TestListRow label={data?.label} type={data.type} message={data?.message} />
            })}
          </div>
          <Divider />
          <TestListRow label="Unfortunately you can’t make video calls through this browser, and your devices is not compatible." type="blackIcon" />
          <div className={classes.bottomWrapper}>
            <Typography id="test-modal-title" variant="caption" color="darkgray">
            TEST ID :234 - VIEW LOG
            </Typography>
            <Button>Test again</Button>
          </div>
        </Box>
      </Modal>
  );
};

export default withStyles(styles)(TestModal);
