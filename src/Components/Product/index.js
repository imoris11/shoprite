import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';
import Fab from '@material-ui/core/Fab';
import LinearIndeterminate from '../Extra/Loading';
import Button from '@material-ui/core/Button';
import Star from '@material-ui/icons/Star';
import Front from '@material-ui/icons/ArrowRight';
import Back from '@material-ui/icons/ArrowLeft';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../Resources/css/product.css';
import Reviews from './Reviews';

class Product extends Component {
  constructor (props) {
    super(props);
    this.state = {
      productId:this.props.match.params.id,
      token:'',
      product:[],
      sizes:[],
      colors:[],
      quantity:1,
      currentImage:'',
      showing:'',
      selectedSize:'S',
      selectedColor:'Black',
      loading:true,
      selectedRating:0,
      reviews:[],
      avgRating:0,
      isDiscounted:false,
    }
  }
  componentDidMount () {
    this.fetchProduct();
    this.fetchReviews();
  }
  fetchProduct = () => {
    //Fetch product details
    fetch('https://backendapi.turing.com/products/'+this.state.productId)
    .then(response => response.json())
    .then(product => {
      if (!product.error) {
        let { isDiscounted } = this.state;
        if (Number(product.discounted_price) > 0) {
          isDiscounted = true;
        }
        this.setState({
          product,
          currentImage:'https://backendapi.turing.com/images/products/'+product.image,
          showing:'image1',
          isDiscounted,
          loading:false
        });

      }else{
        this.setState({loading:false});
        this.errorNotification(product.error.message);
      }
    })
    .catch(error => {
      this.errorNotification("Oops, encountered an error. Please try again.");
      this.setState({loading:false, loadingError:true});
    });
    this.fetchAttributes()
  }
  errorNotification = (message) => {
    toast.error(message, {
        position: toast.POSITION.TOP_RIGHT
      });
  }
  fetchAttributes = () => {
    //Fetch product attributes
    fetch('https://backendapi.turing.com/attributes/inProduct/'+this.state.productId)
    .then(res => res.json())
    .then(attributes => {
      if (!attributes.error) {
        let sizes = attributes.filter((att => att.attribute_name === 'Size'));
        let colors = attributes.filter((att => att.attribute_name === 'Color'));
        this.setState({sizes, colors});
      }else{
        // TODO: Add Toats with error message
        this.setState({errorMessage:attributes.error.message});
        this.errorNotification(attributes.error.message);
      }

    }).catch(error => {
      this.errorNotification("Oops, encountered an error. Please try again.");
    })
  }
  fetchReviews = () => {
    //Fetch product reviews
    fetch('https://backendapi.turing.com/products/' + this.state.productId + '/reviews')
    .then(response => response.json())
    .then(reviews => {
      if (!reviews.error) {
        //Show only three reviews
        this.calculateAverageRating(reviews);
        this.setState({reviews:reviews.slice(0,2), totalReviews:reviews.length-1});
      }else{
        this.errorNotification(reviews.error.message);
      }
    })
    .catch(error => {
      // TODO: Use snackbar to display error
      this.setState({errorMessage:error.toString()})
      this.errorNotification("Oops, encountered an error. Please try again.");
    })
  }
  calculateAverageRating (reviews) {
    /*
    1. Sum up all ratings
    2. Divide by total number of reviews
    */
    let avgRating = 0;
    reviews.forEach((review)=> {
      avgRating += review.rating;
    })
    avgRating = Math.floor(avgRating/(reviews.length-1))
    this.setState({avgRating})
  }
  async getAPIToken () {
    let token = await localStorage.getItem('token');
    if (token) {
      this.setState({token});
    }
  }
  handleChange = (e) => {
    this.setState({[e.target.name]:e.target.value})
  }
  selectSize = (size) => {
    this.setState({selectedSize: size.attribute_value});
  }
  selectColor = (color) => {
    this.setState({selectedColor: color.attribute_value});
  }
  reloadPage = () => {
    window.location.reload();
  }
  imageSection () {
    let {product, currentImage, showing,} = this.state;
    return (
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <img alt="showing product" src={currentImage} style={{height:300, width:300}} />
          <div className='horizontal'>
            <div className='image-item'
              style={{border: showing === 'image1' && '1px solid #f62f5e'}}
              onClick={()=>this.setState({currentImage:'https://backendapi.turing.com/images/products/'+product.image, showing:'image1'})}>
              <img alt="product 1" src={'https://backendapi.turing.com/images/products/'+product.image} style={{height:80}} />
            </div>
            <div className='image-item'
              style={{border:showing === 'image2' && '1px solid #f62f5e'}}
              onClick={()=>this.setState({currentImage:'https://backendapi.turing.com/images/products/'+product.image_2, showing:'image2'})}>
              <img alt="product 2" src={'https://backendapi.turing.com/images/products/'+product.image_2} style={{height:80}} />
            </div>
          </div>

        </Col>
      </Row>
    )
  }
  addQuantity = () => {
    let {quantity} = this.state;
    quantity++;
    this.setState({quantity});
  }
  addToCart (product) {
    //Set Default product details
    let { isDiscounted } = this.state;
    product.quantity = this.state.quantity;
    product.size = this.state.selectedSize;
    product.color = this.state.selectedColor;
    product.sizes = this.state.sizes;
    product.colors = this.state.colors;
    product.subtotal = isDiscounted ? Number(product.discounted_price) * this.state.quantity : Number(product.price)* this.state.quantity;
    //Get badge and products from local storage
   let badgeValue = localStorage.getItem('badge');
   let products = localStorage.getItem('products');
   //Determine if products already exists, add product to products or create a products array
   if (products) {
     products = JSON.parse(products);
     products.push(product);
     localStorage.setItem('badge', Number(badgeValue) + 1);
     localStorage.setItem('products', JSON.stringify(products));
   }else{
     let productsArray = [];
     productsArray.push(product)
     localStorage.setItem('badge', 1);
     localStorage.setItem('products', JSON.stringify(productsArray));
   }
   this.successNotification("Successfully added to cart");
 }
  successNotification = (message) => {
   toast.success(message, {
       position: toast.POSITION.TOP_RIGHT
     });
 }
  reduceQuantity = () => {
    let {quantity} = this.state;
    if (quantity > 1) {
      quantity--;
      this.setState({quantity})
    }
  }
  detailsSection () {
    let {product, selectedSize, selectedColor, avgRating, isDiscounted} = this.state;
    return (
      <Col>
        <Star style={{color: avgRating >=1 ? 'orange' :'grey'}} className='star' />
        <Star style={{color: avgRating >=2 ? 'orange' :'grey'}} className='star' />
        <Star style={{color: avgRating >=3 ? 'orange' :'grey'}} className='star' />
        <Star style={{color: avgRating >=4 ? 'orange' :'grey'}} className='star' />
        <Star style={{color: avgRating >=5 ? 'orange' : 'grey'}} className='star' />
        <h3 className='product-name'>{product.name}</h3>
        {isDiscounted ? <span className='price discounted'>${product.price}</span> : <span className='price'>${product.price}</span>} &nbsp;&nbsp;
        {isDiscounted && <span className='price'>${product.discounted_price}</span>}
        <p className='section-header'>Color</p>
        <div className='vertical'>
          <div className='horizontal'>
            {this.state.colors.map((color, key)=>
              <div key={key}
                onClick={()=>this.selectColor(color)}
                className='color-circle'
                style={{backgroundColor:color.attribute_value, border: selectedColor === color.attribute_value && '2px solid green', padding:5}}>
              </div>
            )}
          </div>
        </div>
        <br />
          <p className='section-header'>Size</p>
          <div className='vertical'>
          <div className='horizontal'>
            {this.state.sizes.map((size, key)=>
              <div key={key}
                onClick={()=>this.selectSize(size)}
                className='text-center size-item'
                style={{ backgroundColor: selectedSize === size.attribute_value ? '#f62f5e' : '#EEEEEE'}}>{size.attribute_value}</div>
            )}
          </div>
        </div>
        <br />
        <div>
          <br />
          <p className='section-header'>Quantity</p>
          <Row style={{marginLeft:20}}>
            <div onClick={this.reduceQuantity} className='text-center directions' style={{marginRight:10}}>
              <Back style={{fontSize:30}} />
            </div>
            <p style={{marginTop:3}}>{this.state.quantity}</p>
            <div onClick={this.addQuantity} className='text-center directions' style={{marginLeft:10}}>
              <Front style={{ fontSize:30}} />
            </div>
          </Row>
          <p className='section-header'>Product Description</p>
          <Row>
            <Col>
              <p>{product.description}</p>
            </Col>
          </Row>
          <div style={{marginTop:30}}>
            <Fab onClick={()=>this.addToCart(product)} variant="extended" color="secondary">
              Add To Cart
            </Fab>
          </div>
        </div>
      </Col>
    )
  }
  render () {
    let { loading, loadingError } = this.state;
    return (
      <div style={{marginTop:60}}>
        {loading ?
          <Row>
            <Col md={{ span: 8, offset: 2 }}>
              <LinearIndeterminate />
            </Col>
          </Row> :
          loadingError ? <Col md={{ span: 8, offset: 2 }}>
            <h2>Opps, encountered an error. Please try again.</h2>
            <Button onClick={this.reloadPage} color="secondary" variant='contained' >
              Reload
            </Button>
          </Col> :
          <div>
            <Row md={{ span: 10, offset: 1 }} >
                <Col>
                  {this.imageSection()}
                </Col>
                <Col>
                  {this.detailsSection()}
                </Col>
              </Row>
              <hr />
              <Reviews productId={this.state.productId} reviews={this.state.reviews} totalReviews={this.state.totalReviews} />
          </div>

          }
          <ToastContainer autoClose={4000} />
      </div>
    );
  }
}

export default Product;
