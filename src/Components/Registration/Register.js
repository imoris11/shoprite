import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {Row, Col} from 'react-bootstrap';
class Register extends Component {
  state = {
    loading:false
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState(prevState => ({loading:!prevState.loading, form_submitted:true}));
    let data = {
      name:this.state.name,
      email:this.state.email,
      password:this.state.password
    };
    let url = 'https://backendapi.turing.com/customers/';
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
        localStorage.setItem('customer_id', result.customer.customer_id)
        result.customer.firstName = result.customer.name.split(" ")[0];
        result.customer.lastName = result.customer.name.split(" ")[1];
        localStorage.setItem('customer', JSON.stringify(result.customer));
        console.log(result);
        window.location.reload();
      }
      this.setState(prevState => ({loading:!prevState.loading}));
    })
    .catch(error => {
      this.setState({errorMessage:"Error registering, please try again.", loading:false});
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
              id="standard-name"
              label="Name"
              name="name"
              margin="normal"
              style={{width:320}}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <TextField
              id="standard-email"
              label="Email"
              name="email"
              margin="normal"
              onChange={this.handleChange}
              style={{width:320}}
            />
          </div>
          <div>
            <TextField
              id="standard-password-input"
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              margin="normal"
              onChange={this.handleChange}
              style={{width:320}}
            />
          </div>
          <Row style={{marginTop:20}}>
            <Col>
                <span className='text-danger'>{this.state.errorMessage}</span>
              {this.state.loading ? <Button className='float-right' variant="contained" color="secondary" >
                Signing up...
              </Button> :
              <Button id="submit_form" className='float-right' type='submit' variant="contained" color="secondary" >
                Sign Up
              </Button>}

            </Col>
          </Row>
        </div>
      </form>
    )
  }
}

export default Register;
