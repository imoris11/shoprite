import React, {Component} from 'react';
import StripeCheckout from 'react-stripe-checkout';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total:0
    }
    this.submit = this.submit.bind(this);
  }
  componentDidMount () {
    let total = Number(localStorage.getItem('total'));
    this.setState({total})
  }

  async submit(token) {
    this.props.isLoading(true);
    this.fetchTaxInfo(token);
  }
  fetchTaxInfo (stripeToken) {
    //Get tax info, and calculate initial costs
    fetch('https://backendapi.turing.com/tax')
    .then(response => response.json())
    .then(result => {
      if (result) {
        this.setState({tax_id: result[0].tax_id});
        this.makeOrder(stripeToken, result[0].tax_id);
      }
    })
    .catch(error => {
      console.log("Oops!, encountered an error");
    })
  }
  makeOrder = (stripeToken, tax_id) => {
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
    fetch('https://backendapi.turing.com/orders', {
      method:'POST',
      body: JSON.stringify(data),
      headers:{
        'Accept':'application/json',
        'content-type':'application/json',
        'user-key':token
      }
    })
    .then(response => response.json())
    .then(result => {
      //Make charge on the card provided
      this.chargeOrder(stripeToken, result);
    })
    .catch(error => {
      console.log(error);
    })
  }
  chargeOrder (stripeToken, orderId) {
    //Get total amount to be charged to card
    let total = Number(localStorage.getItem('total'));
    let data = {
      stripeToken: stripeToken.id,
      order_id: Number(orderId.order_id),
      description: "Payment for items",
      amount: Math.floor(total * 100),
    }
    //Make API call to stripe/charge with token id retrieved from StripeCheckout
    fetch('https://backendapi.turing.com/stripe/charge', {
      method:'POST',
      headers:{
        'content-type':'application/json',
        'Accept':'application/json',
      },
      body:JSON.stringify(data)
    })
    .then(response => {
      return response.json();
    })
    .then(res => {
      //Proceed to next on success
      this.props.onNext();
    })
    .catch(error => {
      console.log(error);
    })

  }
  render() {
    return (
      <div className="checkout">
        <StripeCheckout
          token={this.submit}
          name="SHOPMATE" // the pop-in header title
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
