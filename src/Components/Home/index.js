import React, {Component} from 'react';
import {Row, Col, Container} from 'react-bootstrap';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../Resources/css/home.css';
import Products from '../Products';
const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  card: {
    float:'left',
    margin: '4%',
    width:280
  },

  media: {
    height: 200,
  },
  chip: {
    margin: '5px',
  },

});
 class Home extends Component {
  constructor () {
    super();
    this.state = {
      products:[],
      pages:0,
      showing:20,
      currentPage:1,
      departments:[],
      categories:[],
      url:'https://backendapi.turing.com/products'
    }
  }
  componentDidMount () {
    this.fetchProductsByPage();
    this.fetchDepartments();
    this.fetchCategories();
  }
  fetchDepartments = () => {
    fetch('https://backendapi.turing.com/departments').then(response => response.json()).then(results => {
      if (!results.error) {
        this.setState({departments:results})
      }else{
        this.errorNotification(results.error.message)
      }
    })
  }
  fetchCategories = () => {
    fetch('https://backendapi.turing.com/categories').then(response => response.json()).then(results => {
      if (!results.error) {
        this.setState({categories:results.rows})
      }else{
        this.errorNotification(results.error.message)
      }
    })
  }
  fetchData = (page) => {
    //Fetch products and attributes by page
    let { url } = this.state;
    this.setState({loading:true, products:[]});
    fetch(url+'?page='+page)
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
        }).catch(error => {
          this.errorNotification("Encountered an error. Please try again.");
          this.setState({loading:false})
        })
      })
      //Set pages for pagination
      if (this.state.byDepartment){
        this.setPagination(result.count.count);
      }else{
        this.setPagination(result.count);
      }
    })
    .catch(error => {
      this.errorNotification("Encountered an error. Please try again.");
      this.setState({loading:false})
    })
  }
  errorNotification = (message) => {
    toast.error(message, {
        position: toast.POSITION.TOP_RIGHT
      });
  }
  async fetchProductsByPage (page = 1) {
    await this.setState(prevState => ({url:'https://backendapi.turing.com/products', filterOrder:'All Items', byDepartment:false}));
    this.fetchData(page)
  }
  setPagination = (count) => {
    //Get pages as an integer
    let pages = Math.floor(count/this.state.showing);
    //If any reminders, add one to pages
    if (count%20 !== 0) {
      pages++;
    }
    this.setState({pages});

  }
  showNextSet = () => {
    let {currentPage} = this.state;
    this.fetchProductsByPage(currentPage+1);
  }
  showPrevSet = () => {
    let {currentPage} = this.state;
    this.fetchProductsByPage(currentPage-1);
  }
  async fetchProductsByDepartment (department_id, department_name) {
    await this.setState(prevState => ({byDepartment:true, filterOrder:department_name, url:'https://backendapi.turing.com/products/inDepartment/'+department_id}));
    this.fetchData(1);
  }
  async fetchProductsByCategory (category_id, category_name) {
    await this.setState(prevState => ({filterOrder:category_name, url:'https://backendapi.turing.com/products/inCategory/'+category_id, byDepartment:false}));
    this.fetchData(1);
  }
  render () {
    const { classes } = this.props;
    let {products, pages, departments, categories} = this.state;
    let pagination = [];
    for(let i=1; i<=pages; i++){
      pagination.push(<div key={i}
        className={this.state.currentPage === i ? 'page-item-active' : 'page-item' }
        onClick={()=>this.fetchData(i)}>{i}</div>);
    }
    return (
      <div>
        <Row>
          <Col>
            <img className='banner' src={require('../../Resources/images/img_hero.jpg')} alt='Banner'/>
            <h1 className='header_text'>Amazing clothings, at amazing prices</h1>
          </Col>
        </Row>
        <Col>
          <Row>
            <Col sm={12}>
              <Row>
                <Col sm={3}>
                  <Paper className={classes.root} elevation={1}>
                    <p className='link-item' onClick={()=>this.fetchProductsByPage(1)}>Show All</p>
                    <h5>Departments</h5>
                      {departments.map((department, key)=>
                        <p key={key} className='link-item' onClick={()=>this.fetchProductsByDepartment(department.department_id, department.name)}>{department.name}</p>
                      )}
                    <h5>Categories</h5>
                    {categories.map((category, key)=>
                      <p key={key} className='link-item' onClick={()=>this.fetchProductsByCategory(category.category_id, category.name)}>{category.name}</p>
                    )}
                  </Paper>
                </Col>
                <Col sm={9}>
                  <Container>
                    <Row style={{marginTop:40}}>
                      <Col md={{ span: 6, offset: 3 }}>
                        <p>Showing results for: {this.state.filterOrder}</p>
                      </Col>
                      <Col md={{ span: 6, offset: 3 }}>
                        <Row>
                          {this.state.currentPage > 1 &&
                            <div onClick={this.showPrevSet}><p className='navigation'>Back</p></div>
                          }
                            {pagination}
                          {this.state.currentPage < this.state.pages &&
                            <div onClick={this.showNextSet}><p className='navigation'>Forward</p></div>
                          }
                        </Row>
                      </Col>
                    </Row>
                    <Products products={products} loading={this.state.loading} />
                  </Container>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>

          <ToastContainer autoClose={4000} />
      </div>

    )
  }
}

export default withStyles(styles)(Home)
