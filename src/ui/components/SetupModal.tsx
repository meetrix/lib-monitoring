import { Box, Button, TextField, Modal, ModalProps, Theme, Typography } from '@mui/material';
import { createStyles, WithStyles, withStyles } from '@mui/styles';

const styles = (theme: Theme) => {
  return createStyles({
    root: {
      width: 'clamp(550px ,40vw, 700px)',
      margin: 'auto',
    },
    contentWrapper: {
      backgroundColor: '#fff',
      padding: '3vw',
      borderRadius: 5,
    },
    bottomWrapper: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    textField: {
      marginTop: '0.8rem',
      width: '100%',
      color: '#5f5f5f8a',
      fontSize: '1rem',
      '& .MuiOutlinedInput-input': {
        fontSize: '1rem',
        color: '#5f5f5f8a',
        padding: '5px 7px',
      },
      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#DAE3FA',
      },
      '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
        borderColor: '#DAE3FA',
      },
      '&:hover': {
        borderColor: '#DAE3FA',
      },
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
  return (
    <Modal
      open={props.open}
      className={props.classes.root}
      disableEnforceFocus
      aria-labelledby="test-modal-title"
      aria-describedby="test-modal-description"
    >
      <Box className={props.classes.contentWrapper}>
        <Typography id="setup-modal-title" variant="h6" color="darkslategray">
          Enter your email
        </Typography>
        <Typography
          id="setup-modal-description"
          variant="caption"
          marginTop="0.8rem"
          marginBottom="0.8rem"
          color="darkgray"
        >
          Please do not close this window until the test completes
        </Typography>
        <TextField
          className={props.classes.textField}
          type="email"
          id="test-modal-title"
          value={props.email}
          onChange={ev => props.onEmailChange(ev.target.value)}
        />
        <div className={props.classes.bottomWrapper}>
          <Button variant='contained' disableElevation disabled={!props.email.includes('@')} onClick={props.onStart}>
            {props.startLabel}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default withStyles(styles)(SetupModal);
