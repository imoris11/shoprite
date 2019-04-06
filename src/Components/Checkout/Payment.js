import React, {Component} from 'react';
import StripeCheckout from './Form';
import { Row, Col } from 'react-bootstrap';
import '../../Resources/css/payment.css';
import LinearIndeterminate from '../Extra/Loading';
export default class Payment extends Component {
  state = {
    payment:'card',
    tax_sum:0,
    total:0,
    subtotal:0,
    tax_id:0,
    shipping_cost:0,
  }
  componentDidMount () {
    this.getTotalCost();
  }
  getTotalCost () {
    let { total, subtotal, tax_sum, shipping_cost } = 0;
    tax_sum = Number(localStorage.getItem('tax_sum'));
    subtotal = Number(localStorage.getItem('subtotal'));
    shipping_cost = Number(localStorage.getItem('shipping_cost'));
    total = Number(localStorage.getItem('total')) + shipping_cost;
    this.setState({total, subtotal, tax_sum, shipping_cost});
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
            <h6 >SubTotal: ${this.state.subtotal.toFixed(2)}</h6>
            <h6 >Tax: ${this.state.tax_sum.toFixed(2)}</h6>
            <h6 >Shipping: ${this.state.shipping_cost.toFixed(2)}</h6>
            <h5 >Total: ${this.state.total.toFixed(2)}</h5>
            {payment === 'card' &&
            <StripeCheckout isLoading={this.setIsLoading} onNext={this.onNext} />}
          </Col>}
          {this.state.loading && <LinearIndeterminate />}
        </Col>
      </Row>
    )
  }
}
