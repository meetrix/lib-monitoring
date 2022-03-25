import * as React from 'react';
import { Box, Grid, Theme, Typography } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import WarningIcon from '@mui/icons-material/Warning';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
const styles = (theme: Theme) => {
};

interface IWebrtcSubTestGridView {
  title: string;
  statusText: string;
}

const getIcon = (iconType: string) => {
  let icon;
  if (iconType === 'success') {
    icon = <DoneIcon />;
  } else if (iconType === 'failure') {
    icon = <ClearIcon />;
  } else if (iconType === 'warning') {
    icon = <WarningIcon />;
  } else if (iconType === 'running') {
    icon = <MoreHorizIcon />;
  } else {
    icon = '';
  }
  return icon;
};

const WebrtcSubTestGrid: React.FC<IWebrtcSubTestGridView> = ({
  title,
  statusText,
}: IWebrtcSubTestGridView) => {


  return (
    <Grid container direction="row" alignItems="left">
      <Grid item xs={1}>
        {getIcon('success')}
      </Grid>
      <Grid item xs={5}>
        <Typography>{title}</Typography>
      </Grid>
      <Grid item xs={5}>
        <Typography>{statusText}</Typography>
      </Grid>
    </Grid>
  );
};

export default React.memo(WebrtcSubTestGrid);
