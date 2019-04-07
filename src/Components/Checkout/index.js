import React, { Component } from 'react';
import { Col } from 'react-bootstrap';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Registration from '../Registration';
import Contact from '../Profile/Contact';
import Payment from './Payment';
import Finish from './Finish';
import Cart from '../Cart';

export default class Checkout extends Component {
  state = {
    steps: ['Confirmation', 'Contact Information', 'Payment', 'Finish'],
    activeStep:0,
    showDialog:false
  }
  componentDidMount () {
    this.confirmUserStatus ()
  }
  confirmUserStatus = () => {
    let token = localStorage.getItem('token');
    if (token) {
      this.setState({token, loggedIn:true});
    }else{
      this.setState({showDialog:true})
    }
  }
  getStepperContent (activeStep) {
    //Determine what contnt to show basd on activeStep
    switch (activeStep) {
      case 0:
        return <Cart onNext={this.onNext} checkout={true} />
        break;
      case 1:
        return <Contact onNext={this.onNext} />
        break;
      case 2:
        return <Payment onNext={this.onNext} />
        break;
      case 3:
        return <Finish />
        break;
      default:
        return null;
    }
  }
  onNext = () => {
    this.setState(prevState => ({activeStep:prevState.activeStep + 1}));
  }
  onBack = () => {
    this.setState(prevState => ({activeStep:prevState.activeStep - 1}));
  }
  handleClose = () => {
    //Do nothing. Don't close unless logged in
  }
  render () {
    let { steps, activeStep } = this.state;
    return (
      <Col style={{marginTop:30}}>
        <Col md={{span:10, offset:1}}>
          <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {this.getStepperContent(activeStep)}
        </Col>
        <Registration showDialog={this.state.showDialog} handleClose={this.handleClose} />
      </Col>

    )
  }
}
