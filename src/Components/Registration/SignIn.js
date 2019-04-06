import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {Row, Col} from 'react-bootstrap';
import { loginApi } from './AuthApi';
class SignIn extends Component {
  state = {
    loading:false
  }
  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState(prevState => ({loading:!prevState.loading}));
    let data = {
      email:this.state.email,
      password:this.state.password
    };

    let url = 'https://backendapi.turing.com/customers/login';
    let result = await loginApi(url, data);
    if (result.error) {
        this.setState({errorMessage:result.error.message, loading:false});
      }
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
