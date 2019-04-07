import React, {Component} from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { makeOrderApi, chargeOrderApi, getTaxApi, getTotalCostApi } from './CheckoutApi';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total:0
    }
    this.submit = this.submit.bind(this);
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

  async submit(token) {
    this.props.isLoading(true);
    this.fetchTaxInfo(token);
  }
  async fetchTaxInfo (stripeToken) {
    //Get tax info, and calculate initial costs
    let url = 'https://backendapi.turing.com/tax';
    let result = await getTaxApi(url);
    if (result) {
      this.setState({tax_id: result[0].tax_id});
      this.makeOrder(stripeToken, result[0].tax_id);
    }
  }
  makeOrder = async (stripeToken, tax_id) => {
    //Get required details for API
    let cart_id = localStorage.getItem('cart_id');
    let customer_id = localStorage.getItem('customer_id');
    let shipping_id = localStorage.getItem('shipping_id');
    let token = localStorage.getItem('token');
    let data = {
      customer_id:customer_id,
      shipping_id:shipping_id,
      cart_id:cart_id,
      tax_id:tax_id
    }
    //Make API call to orders
    let url = 'https://backendapi.turing.com/orders';
    let order = await makeOrderApi(url, data, token);
    if (!order.error){
      this.chargeOrder(stripeToken, order);
    }else{

    }
  }
  async chargeOrder (stripeToken, orderId) {
    //Get total amount to be charged to card
    let total = Number(localStorage.getItem('total'));
    let data = {
      stripeToken: stripeToken.id,
      order_id: Number(orderId.order_id),
      description: "Payment for items",
      amount: Math.floor(total * 100),
    }
    //Make API call to stripe/charge with token id retrieved from StripeCheckout
    let url = 'https://backendapi.turing.com/stripe/charge';
    let order = await chargeOrderApi(url, data);
    this.props.onNext();
  }
  render() {
    return (
      <div className="checkout">
        <StripeCheckout
          token={this.submit}
          name="SHOPRITE" // the pop-in header title
          description="Amazing clothings, amazing prices"
          amount={this.state.total * 100} // cents
          currency="USD"
          stripeKey="pk_test_NcwpaplBCuTL6I0THD44heRe"
        />
      </div>
    );
  }
}

export default Form;
