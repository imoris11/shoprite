import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import Register from './Register';
import SignIn from './SignIn';
function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

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
          <CloseIcon />
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


class CustomizedDialog extends Component {
  state = {
    value:0,
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };
  render() {
    const { value } = this.state;
    return (
      <div>
        <Dialog
          onClose={()=>this.props.handleClose()}
          aria-labelledby="customized-dialog-title"
          open={this.props.showDialog}
        >
          <DialogTitle id="customized-dialog-title" onClose={()=>this.props.handleClose()}>
            <Tabs value={value} onChange={this.handleChange}>
              <Tab label="Sign in" />
              <Tab label="Register" />
            </Tabs>
          </DialogTitle>
          <DialogContent>
            {value === 0 && <TabContainer><SignIn /></TabContainer>}
            {value === 1 && <TabContainer><Register /></TabContainer>}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default CustomizedDialog;
