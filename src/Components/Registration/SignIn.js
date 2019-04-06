import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {Row, Col} from 'react-bootstrap';
class SignIn extends Component {
  state = {
    loading:false
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState(prevState => ({loading:!prevState.loading}));
    let data = {
      email:this.state.email,
      password:this.state.password
    };
    let url = 'https://backendapi.turing.com/customers/login';
    fetch(url, {
      method:'POST',
      body: JSON.stringify(data),
      headers:{'content-type': 'application/json'}
    })
    .then(response => response.json())
    .then(result => {
      if (result.error) {
        this.setState({errorMessage:result.error.message});
      }else{
        localStorage.setItem('token', result.accessToken);
        localStorage.setItem('customer_id', result.user.customer_id)
        result.user.firstName = result.user.name.split(" ")[0];
        result.user.lastName = result.user.name.split(" ")[1];
        localStorage.setItem('customer', JSON.stringify(result.user));
        window.location.reload();
      }
      this.setState(prevState => ({loading:!prevState.loading}));
    })
    .catch(error => {
      this.setState({errorMessage:"Error logging in, please try again.", loading:false});
    });

  }
  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }
  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <div style={{marginTop:-40}}>
          <div>
            <TextField
              id="standard-uncontrolled"
              label="Email"
              margin="normal"
              name='email'
              style={{width:320}}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <TextField
              id="standard-password-input"
              label="Password"
              type="password"
              name='password'
              autoComplete="current-password"
              margin="normal"
              style={{width:320}}
              onChange={this.handleChange}
            />
          </div>
          <Row style={{marginTop:20}}>
            <Col >
              <span className='text-danger'>{this.state.errorMessage}</span>
              {this.state.loading ? <Button className='float-right' variant="contained" color="secondary" >
                Signing in...
              </Button> :
              <Button className='float-right' type='submit' variant="contained" color="secondary" >
                Sign In
              </Button>}
            </Col>
          </Row>
        </div>
      </form>
    )
  }
}

export default SignIn;
