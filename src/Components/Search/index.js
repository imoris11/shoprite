import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import Products from '../Products';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default class Search extends Component {
  constructor (props) {
    super(props);
    this.state = {
      searchString:this.props.match.params.value,
      loading:true,
      products:[]
    }
  }
  componentDidMount () {
    this.searchProducts()
  }
  searchProducts = () => {
    fetch('https://backendapi.turing.com/products/search?query_string=' + this.state.searchString + '&all_words=on')
    .then(response => response.json())
    .then(result => {
      let products = [];
      result.rows.forEach((product)=> {
        fetch('https://backendapi.turing.com/attributes/inProduct/'+product.product_id)
        .then(res => res.json())
        .then(attributes => {
          let sizes = attributes.filter((att => att.attribute_name === 'Size'));
          let colors = attributes.filter((att => att.attribute_name === 'Color'));
          let item = product;
          item['sizes'] = sizes;
          item['colors'] = colors;
          products.push(item);
          this.setState({products, count:result.count, loading:false});
        }).catch(error => {
          this.errorNotification("Oops, encountered an error. Please try again.");
        })
      })
    })
    .catch(error => {
      this.setState({ loadingError:true, loading:false})
      this.errorNotification("Oops, encountered an error. Please try again.");
    })
  }
  errorNotification = (message) => {
    toast.error(message, {
        position: toast.POSITION.TOP_RIGHT
      });
  }
  render () {
    let { products, loading } = this.state;
    return (
      <div style={{marginTop:30}}>
        <h3 className='text-center'>
          Showing results for "{this.state.searchString}"
        </h3>
        <Row>
          <Col md={{ span: 10, offset: 1 }}>
            <Products products={products} loading={loading} />
          </Col>
        </Row>
        <ToastContainer autoClose={4000} />
      </div>
    )
  }
}
