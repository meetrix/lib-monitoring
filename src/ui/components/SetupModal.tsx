import { Box, Button, TextField, Modal, ModalProps, Theme, Typography } from '@mui/material';
import { createStyles, WithStyles, withStyles } from '@mui/styles';

const styles = (theme: Theme) => {
  return createStyles({
    formHeading: {
      marginBottom: '2vh',
      fontSize: '1.8rem',
      fontWeight: 'bolder',
    },
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
      alignItems: 'flex-start',
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
        <div className={props.classes.formHeading}>Enter your email</div>
        <TextField
          type="email"
          id="test-modal-title"
          value={props.email}
          onChange={ev => props.onEmailChange(ev.target.value)}
        />
        <div className={props.classes.bottomWrapper}>
          <Button disabled={!props.email.includes('@')} onClick={props.onStart}>
            {props.startLabel}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default withStyles(styles)(SetupModal);
