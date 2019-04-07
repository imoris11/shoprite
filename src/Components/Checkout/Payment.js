import React, {Component} from 'react';
import StripeCheckout from './Form';
import { Row, Col } from 'react-bootstrap';
import '../../Resources/css/payment.css';
import { getTotalCostApi } from './CheckoutApi';
import LinearIndeterminate from '../Extra/Loading';
export default class Payment extends Component {
  state = {
    payment:'card',
    total:0,
  }
  componentDidMount () {
    this.getTotalCost();
  }
  async getTotalCost () {
    let { total } = this.state;
    //Get total cost from online cart
    let cart_id = localStorage.getItem('cart_id');
    let url = 'https://backendapi.turing.com/shoppingcart/totalAmount/'+cart_id;
    let res = await getTotalCostApi(url);
    total = Number(res.total_amount);

    this.setState({total});
  }
  onNext = () => this.props.onNext();
  setIsLoading = () => this.setState({loading:true})
  render () {
    let {payment} = this.state;
    return (
      <Row>
        <Col md={{span:8, offset:2}}>
          <Row>
            <Col onClick={()=>this.setState({payment:'card'})} className='text-center payment-method' style={{backgroundColor: payment === 'card' && 'lightblue'}} >
              <img src={require('../../Resources/images/logos-visa.png')} className='payment-image' alt="Visa" />
              <img src={require('../../Resources/images/logos-mastercard.png')} className='payment-image' alt="Mastercard" />
            </Col>
            <Col onClick={()=>this.setState({payment:'paypal'})} className='text-center payment-method' style={{backgroundColor: payment === 'paypal' && 'lightblue'}}>
              <img src={require('../../Resources/images/logos-PayPal.png')} className='payment-image' alt="Paypal" />
            </Col>
          </Row>
          {!this.state.loading && <Col>
            <h6 >Total: ${this.state.total.toFixed(2)}</h6>
            {payment === 'card' &&
            <StripeCheckout isLoading={this.setIsLoading} onNext={this.onNext} />}
          </Col>}
          {this.state.loading && <LinearIndeterminate />}
        </Col>
      </Row>
    )
  }
}
