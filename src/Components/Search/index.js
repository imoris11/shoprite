import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import Products from '../Products';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { searcApi } from './SearchApi';
export default class Search extends Component {
  constructor (props) {
    super(props);
    this.state = {
      searchString:this.props.match.params.value,
      loading:true,
      products:[],
      pages:0,
      showing:20
    }
  }
  componentDidMount () {
    this.searchProducts()
  }
  searchProducts = async (page = 1) => {
    let url = 'https://backendapi.turing.com/products/search?query_string=' + this.state.searchString + '&all_words=on';
    let result = await searcApi(url, page);
    this.setState({products:result.products, count:result.count, loading:false, currentPage:page});
    //Set pages for pagination
    this.setPagination(result.count);
  }
  setPagination = (count) => {
    let pages = Math.floor(count/this.state.showing);
    if (count%20 !== 0) {
      pages++;
    }
    this.setState({pages});
  }
  errorNotification = (message) => {
    toast.error(message, {
        position: toast.POSITION.TOP_RIGHT
      });
  }
  render () {
    let { products, loading, pages } = this.state;
    let pagination = [];
    for(let i=1; i<=pages; i++){
      pagination.push(<div key={i}
        className={this.state.currentPage === i ? 'page-item-active' : 'page-item' }
        onClick={()=>this.searchProducts(i)}>{i}</div>);
    }
    return (
      <div style={{marginTop:30}}>
        <h3 className='text-center'>
          Showing results for "{this.state.searchString}"
        </h3>
        <Col sm={{ span: 6, offset: 3 }} >
          <Row  style={{justifyContent:'center'}}>
            {pagination}
          </Row>
        </Col>
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
