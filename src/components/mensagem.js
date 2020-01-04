import React from 'react';
import InfoIcon from '@material-ui/icons/Info';
import { amber, green } from '@material-ui/core/colors';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles1 = makeStyles(theme => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.main
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: "flex",
    alignItems: "center"
  }
}));


const Mensagem = props => {
  
const classes = useStyles1();

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        open={props.open}
        message={
          <span id="client-snackbar" className={classes.message}>
            <InfoIcon />
            {props.mensagem}
          </span>
        }
        className={classes.success}
        autoHideDuration={6000}
        variant={props.variant}
        aria-describedby="client-snackbar"
        //onClose={handleClose}
      />
    </div>
  );
};

export default Mensagem;