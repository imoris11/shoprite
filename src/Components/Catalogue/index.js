import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Products from '../Products';
import { getProductsApi } from '../Products/ProductsApi';
export default class Search extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading:true,
      departmentId:this.props.match.params.id,
      name:this.props.match.params.name,
      products:[],
      showing:20,
    }
  }
  componentDidMount () {
    this.searchProducts(this.state.departmentId)
  }
  async componentWillReceiveProps (newProps) {
    if (this.state.departmentId !== newProps.match.params.id) {
      this.setState(prevState => ({
        loading: !prevState.loading,
        name: newProps.match.params.name,
        departmentId: newProps.match.params.id
      }))
      this.searchProducts(newProps.match.params.id)
    }
  }
  searchProducts = async (departmentId, page=1) => {
    let url = 'https://backendapi.turing.com/products/inDepartment/'+departmentId;
    let result = await getProductsApi(url, page, false);
    this.setState({products:result.products, count:result.count, loading:false, currentPage:page});
    //Set pages for pagination
    this.setPagination(result.count);
  }
  errorNotification = (message) => {
    toast.error(message, {
        position: toast.POSITION.TOP_RIGHT
      });
  }
  setPagination = (count) => {
    let pages = Math.floor(count/this.state.showing);
    if (count%20 !== 0) {
      pages++;
    }
    this.setState({pages});
  }
  render () {
    let { products, loading, pages } = this.state;
    let pagination = [];
    for(let i=1; i<=pages; i++){
      pagination.push(<div key={i}
        className={this.state.currentPage === i ? 'page-item-active' : 'page-item' }
        onClick={()=>this.searchProducts(this.state.departmentId, i)}>{i}</div>);
    }
    return (
      <div style={{marginTop:30}}>
        <h3 className='text-center'>
          {this.state.name}
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
