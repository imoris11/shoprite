import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Products from '../Products';
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
  searchProducts = (departmentId, page=1) => {
    fetch('https://backendapi.turing.com/products/inDepartment/'+departmentId+"?page="+page)
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
          this.setState({products, count:result.count, loading:false, currentPage:page});
          this.setPagination(result.count.count);
        }).catch(error => {
          this.errorNotification("Oops, encountered an error. Please try again.");
          this.setState({loadingError:true, loading:false});
        })
      })
    })
    .catch(error => {
      this.errorNotification("Oops, encountered an error. Please try again.");
      this.setState({loadingError:true, loading:false});
    })
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
