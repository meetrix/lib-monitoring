import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Modal, 
  ModalProps, 
  Theme, 
  Typography, 
  IconButton 
} from '@mui/material';
import { createStyles, WithStyles, withStyles } from '@mui/styles';
import CloseIcon from '@mui/icons-material/Close';

const styles = (theme: Theme) => {
  return createStyles({
    root: {
      width: 'clamp(550px ,40vw, 700px)',
      margin: 'auto',
    },
    contentWrapper: {
      backgroundColor: '#fff',
      padding: '40px',
      borderRadius: 5,
    },
    bottomWrapper: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    textField: {
      marginTop: '0.8rem',
      width: '100%',
      color: '#5f5f5f8a',
      fontSize: '0.875rem',
      '& .MuiOutlinedInput-input': {
        fontSize: '0.875rem',
        color: '#5f5f5f8a',
        padding: '5px 7px',
      },
      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#DAE3FA',
      },
      '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
        borderColor: '#DAE3FA',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#DAE3FA !important',
      },
    },
    modalTitle: {
      color: '#5F5F5F',
      paddingBottom: '10px',
    },
    startButton: {
      textTransform: 'capitalize !important' as 'capitalize',
      '&.MuiButton-root': {
        backgroundColor: '#4A74E9',
      },
      '& .MuiButton-root.Mui-disabled': {
        backgroundColor: '#0000001f !important',
      },
    },
    closeButton: {
      position: 'absolute !important' as 'absolute',
      top: 0,
      right: 0,
    },
  });
};

interface SetupModalProps extends WithStyles<ModalProps & typeof styles> {
  open: boolean;
  email: string;
  onEmailChange: (email: string) => void;
  startLabel: string;
  onStart: () => void;
}

const SetupModal = (props: SetupModalProps) => {
  const [closeModal, setCloseModal] = useState<boolean>(props.open);
  return (
    <Modal
      open={closeModal}
      className={props.classes.root}
      disableEnforceFocus
      aria-labelledby="test-modal-title"
      aria-describedby="test-modal-description"
    >
      <Box className={props.classes.contentWrapper}>
        <IconButton 
          aria-label="close" 
          className={props.classes.closeButton}
          onClick={() => setCloseModal(false)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <Typography id="setup-modal-title" variant="h5" className={props.classes.modalTitle}>
          Enter Email ID
        </Typography>
        <Typography
          id="setup-modal-description"
          variant="body1"
          color="#A9A9A9"
        >
          Please do not close this window until the test completes
        </Typography>
        <div style={{padding:'10px 0px 20px'}}>
          <TextField
            className={props.classes.textField}
            type="email"
            id="test-modal-title"
            value={props.email}
            onChange={ev => props.onEmailChange(ev.target.value)}
          />
        </div>
        <div className={props.classes.bottomWrapper}>
          <Button 
            variant='contained' 
            disableElevation 
            disabled={!props.email.match(/^(.+)@(.+)$/) } 
            onClick={props.onStart} 
            className={props.classes.startButton}
          >
            {props.startLabel}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default withStyles(styles)(SetupModal);
