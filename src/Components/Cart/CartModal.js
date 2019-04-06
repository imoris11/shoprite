import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Cart from './';


const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
  }))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon style={{color:'#f62f5e'}} />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent);

class CartModal extends Component {
  state = {
    value:0,
    items:0
  };
  handleClose = () => {
    this.props.handleClose()
  }
  render () {
    return (
      <div>
        <Dialog
          onClose={this.handleClose}
          fullWidth={true}
          maxWidth={'xl'}
          scroll={'paper'}
          aria-labelledby="customized-dialog-title"
          open={this.props.showDialog}
        >
          <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
              {this.props.items} items in Your Cart
          </DialogTitle>
          <DialogContent>
          <Cart handleClose={this.handleClose} />
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}
export default CartModal;
