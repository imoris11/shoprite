import React, {Component} from 'react';
import { Row, Col } from 'react-bootstrap';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default class Delivery extends Component {
  state = {
    regions:[],
    shipping:[],
    delivery:0,
  }
  componentDidMount () {
    this.getCustomerDetails();
    this.fetchRegions();
  }
  fetchRegions = () => {
    fetch('https://backendapi.turing.com/shipping/regions')
    .then(response => response.json())
    .then(regions => {
      this.setState({regions})
    })
    .catch(error => {
      this.errorNotification("Oops!, encountered an error. Please try again");
    })
  }
  getCustomerDetails = () => {
    let user = localStorage.getItem('customer');
    user = JSON.parse(user);
    this.setState({
      firstName:user.firstName,
      lastName:user.lastName,
      address_1:user.address_1,
      city:user.city,
      country:user.country,
      shipping_region:user.shipping_region,
      mob_phone:user.mob_phone,
      postal_code:user.postal_code,
      state:user.region,
      email:user.email,
      customer_id:user.customer_id
    })

  }
  errorNotification = (message) => {
    toast.error(message, {
        position: toast.POSITION.TOP_RIGHT
      });
  }
  successNotification = (message) => {
    toast.success(message, {
        position: toast.POSITION.TOP_RIGHT
      });
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]:e.target.value,
      hasChanges:true
    })
  }
  handleChangeShippingRegion = (e) => {
    //Hack...
    ///value is stored as id/region_name. Split and assign as needful
    let id = e.target.value.split("/")[0];
    let region = e.target.value.split("/")[1];
    this.setState({
      [e.target.name]:e.target.value,
      region:region,
      hasChanges:true
    });
    //Get shipping details based on shipping id
    this.fetchShippingDetails(id);
  }
  handleChangeRadio = (e) => {
    let shipping = this.state.shipping.filter((item)=> item.shipping_id === Number(e.target.value));
    this.setState({
      delivery:Number(e.target.value),
      hasChanges:true,
      shipping_cost:shipping[0].shipping_cost,
    });
    localStorage.setItem('shipping_cost', shipping[0].shipping_cost);
  }
  fetchShippingDetails = (id) => {
    fetch('https://backendapi.turing.com/shipping/regions/' + id)
    .then(response => response.json())
    .then(shipping => {
      this.setState({shipping});
    })
    .catch(error => {
      this.errorNotification("Oops!, encountered an error. Please try again");
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({loading:true})
    let data = {
      customer_id:this.state.customer_id,
      firstName:this.state.firstName,
      lastName:this.state.lastName,
      address_1:this.state.address_1,
      city:this.state.city,
      shipping_region:this.state.shipping_region.split("/")[0],
      mob_phone:this.state.mob_phone,
      postal_code:this.state.postal_code,
      country:this.state.country,
      region:this.state.region,
      email:this.state.email,
    };
    this.updatCustomerInfo(data);
    localStorage.setItem('customer', JSON.stringify(data));
  }
  updatCustomerInfo = (data) => {
    let user = {
      name:data.firstName +  ' ' + data.lastName,
      email:data.email,
      mob_phone:data.mob_phone
    }
    let token = localStorage.getItem('token');
    fetch('https://backendapi.turing.com/customer', {
      method:'PUT',
      body:JSON.stringify(user),
      headers:{
        'Accept':'application/json',
        'content-type':'application/json',
        'user-key': token
      }
    })
    .then(response => {
      this.updateAddressInfo(data)
    })
    .catch(error => {
      console.log(error);
    })
  }
  updateAddressInfo = (data) => {
    let address = {
      address_1: data.address_1,
      city: data.city,
      region:data.region,
      postal_code:data.postal_code,
      shipping_region_id:data.shipping_region,
      country:data.country
    }
    let token = localStorage.getItem('token');
    fetch('https://backendapi.turing.com/customers/address', {
      method:'PUT',
      body:JSON.stringify(address),
      headers:{
        'Accept':'application/json',
        'content-type':'application/json',
        'user-key': token
      }
    })
    .then(response => {
      localStorage.setItem('shipping_id', this.state.delivery);
      if (!this.props.contact){
        this.setState({loading:false})
        this.props.onNext();
      }else{
        this.successNotification("Successfully saved contact information")
      }
    })
    .catch(error => {
      console.log(error);
    })
  }
  render () {
    let state = this.state;
    return (
      <div >
        <form onSubmit={this.handleSubmit}>
          <Row>
            <Col>
              <span>First Name</span>
              <TextField
                id="outlined-name"
                name="firstName"
                placeholder="Enter first name"
                onChange={this.handleChange}
                margin="normal"
                value={state.firstName}
                required
                variant="outlined"
                fullWidth
              />
            </Col>
            <Col>
              <span>Last Name</span>
              <TextField
                id="outlined-name"
                name="lastName"
                placeholder="Enter last name"
                onChange={this.handleChange}
                value={state.lastName}
                margin="normal"
                required
                fullWidth
                variant="outlined"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <span>Street Address</span>
              <TextField
                id="outlined-name"
                name="address_1"
                fullWidth
                placeholder="Enter address"
                onChange={this.handleChange}
                value={state.address_1}
                margin="normal"
                required
                variant="outlined"
              />
            </Col>
            <Col>
              <span>City</span>
              <TextField
                id="outlined-name"
                name="city"
                value={state.city}
                placeholder="Enter City"
                onChange={this.handleChange}
                margin="normal"
                variant="outlined"
                fullWidth
                required
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <span>Country</span>
              <TextField
                id="outlined-name"
                name="country"
                placeholder="Enter country"
                onChange={this.handleChange}
                value={state.country}
                margin="normal"
                variant="outlined"
                fullWidth
                required
              />
            </Col>
            <Col>
              <span>Post Code</span>
              <TextField
                id="outlined-name"
                name="postal_code"
                placeholder="Enter postal code"
                onChange={this.handleChange}
                margin="normal"
                value={state.postal_code}
                variant="outlined"
                fullWidth
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <span>Mobile Phone</span>
              <TextField
                id="outlined-name"
                name="mob_phone"
                placeholder="Enter Phone"
                onChange={this.handleChange}
                value={state.mob_phone}
                margin="normal"
                variant="outlined"
                fullWidth
                required
              />
            </Col>
             <Col>
               <span>Shipping Region</span>
              <Select
                value={this.state.shipping_region}
                onChange={this.handleChangeShippingRegion}
                inputProps={{
                  name: 'shipping_region',
                  label:'Shipping Region'
                }}
              >
                {state.regions.map((region)=>
                  <MenuItem key={region.shipping_region_id} value={region.shipping_region_id + '/' + region.shipping_region}>{region.shipping_region}</MenuItem>
                )}

              </Select>
            </Col>
          </Row>

          <Row>
            <Col>
              <h5>Delivery options</h5>
              <Row>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="Gender"
                    name="delivery"
                    value={state.delivery}
                    onChange={this.handleChangeRadio}
                  >
                      {state.shipping.map((detail)=>
                        <FormControlLabel key={detail.shipping_id} value={detail.shipping_id} control={<Radio />} label={detail.shipping_type} />
                      )}

                  </RadioGroup>
                </FormControl>
              </Row>
            </Col>
          </Row>
          <Row style={{marginTop:20}} >
            <Col >
              <Row className='float-right'>
                <Col>
                  {this.props.contact  && this.state.hasChanges && <Button type='submit' variant='contained' color="secondary">
                    Save
                  </Button>}
                  {!this.props.contact && this.state.hasChanges && <div>
                    {this.state.loading ? <Button variant='contained' color="secondary">
                      Saving...
                    </Button> : <Button type='submit' variant='contained' color="secondary">
                      Next
                    </Button>}
                  </div>}

                </Col>
              </Row>
            </Col>
          </Row>
        </form>
        <ToastContainer autoClose={4000} />
      </div>
    )
  }
}
