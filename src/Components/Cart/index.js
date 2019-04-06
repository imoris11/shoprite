import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Front from '@material-ui/icons/ArrowRight';
import Back from '@material-ui/icons/ArrowLeft';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import '../../Resources/css/cart.css';
import { getTaxApi } from '../Checkout/CheckoutApi';
import { createCartIdApi, addItemToCartApi } from './CartApi';
const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});
class Cart extends Component{
  constructor () {
    super();
    this.state = {
      products:[],
      subtotal:0,
      tax_sum:0,
      total:0
    }
  }
  componentDidMount () {
    this.getProducts();
  }
  getProducts () {
    //Get products from localStorage
    let products = localStorage.getItem('products');
    if (products) {
      products = JSON.parse(products);
      this.setState({products});
      this.fetchTaxInfo();
    }
  }
  async fetchTaxInfo () {
    //Get tax info, and calculate initial costs
    let url = 'https://backendapi.turing.com/tax';
    let result = await getTaxApi(url);
      if (result) {
        this.setState({tax: result[0].tax_percentage});
        this.calculateTotal(result[0].tax_percentage);
      }
  }
  calculateTotal = (tax) => {
    /*
    1. Get subtotal of all products
    2. Caculate tax on subtotal
    3. Set state of total (tax+subtotal), subtotal, and tax value
    */
    let subtotal = 0;
    let { products } = this.state;
    products.forEach((product)=> {
      subtotal += Number(product.subtotal);
    })
    let tax_sum = subtotal * (tax/100);
    let total = subtotal + Number(tax_sum);
    this.setState({subtotal, tax_sum, total});
  }
  upDateTotal = (price) => {
    //Given a price  (negative or positive), recalculate costs
    let {subtotal, total, tax } = this.state;
    subtotal += price;
    let tax_sum = (subtotal * (tax/100));
    total = subtotal + Number(tax_sum);
    this.setState({subtotal, tax_sum, total});
  }
  addQuantity = (product, key) => {
    /*
    1. Increment the qunatity of products by 1
    2. Increase subtotal,recalculate the total cost
    */
    let {products} = this.state;
    product.quantity += 1;
    product.subtotal = Number(product.subtotal);
    product.subtotal =  (product.subtotal + Number(product.price));
    products[key] = product;
    this.setState({products});
    this.upDateTotal(Number(product.price));
  }
  reduceQuantity = (product, key) => {
    /*
    1. Decrease the qunatity of products by 1
    2. Increase subtotal,recalculate the total cost
    */
    if (product.quantity > 1) {
      let {products} = this.state;
      product.subtotal = Number(product.subtotal);
      product.quantity -= 1;
      product.subtotal = (product.subtotal - Number(product.price)).toFixed(2);
      products[key] = product;
      this.setState({products});
      this.upDateTotal(-Number(product.price));
    }
  }
  handleChangeSize = (e, product, key) => {
    let { products } = this.state;
    product.size = e.target.value;
    products[key] = product;
    this.setState({
      [e.target.name]:e.target.value,
      products
    })
  }
  handleChangeColor = (e, product, key) => {
    let { products } = this.state;
    product.color = e.target.value;
    products[key] = product;
    this.setState({
      [e.target.name]:e.target.value,
      products
    })
  }
  updateProducts = () => {
    localStorage.setItem('products', JSON.stringify(this.state.products));
    this.props.handleClose()
  }
  saveFinalCost = () => {
    localStorage.setItem('total', JSON.stringify(this.state.total));
    localStorage.removeItem('badge');
    localStorage.removeItem('products');
    localStorage.setItem('tax_sum', JSON.stringify(this.state.tax_sum));
    localStorage.setItem('subtotal', JSON.stringify(this.state.subtotal));
  }
  removeItemFromCart (product) {
   let badgeValue = localStorage.getItem('badge');
   let {products} = this.state;
   products = products.filter((p)=> p.product_id !== product.product_id )
   if (Number(badgeValue) > 1){
     localStorage.setItem('badge', Number(badgeValue) - 1);
     localStorage.setItem('products', JSON.stringify(products));
   }else{
     localStorage.setItem('badge', '');
     localStorage.setItem('products', JSON.stringify([]));
   }
   this.setState({products})
   this.upDateTotal(-Number(product.subtotal));
  }
  addToCart = async () => {
    let { products } = this.state;
    this.setState({loading:true})
    //generate cart id
    let url = 'https://backendapi.turing.com/shoppingcart/generateUniqueId'
    let cart = await createCartIdApi(url);
    localStorage.setItem('cart_id', cart.cart_id);
    this.setState({cart_id:cart.cart_id})
    //add items to cart
    products.forEach((product)=> {
      this.addItem(product, cart.cart_id);
    })
    //save total costs to localStorage
    this.saveFinalCost();
    this.setState({loading:false})
    this.props.onNext()
  }
  addItem = async (product, cart_id) => {
    for (let i=0; i<product.quantity; i++) {
      let data = {
        cart_id:cart_id,
        product_id:product.product_id,
        attributes: product.size + " " + product.color
      }
      let url = 'https://backendapi.turing.com/shoppingcart/add';
      let item =  await addItemToCartApi(url, data);
    }
  }
  render () {
    let { classes } = this.props;
    let { products } = this.state;
    return (
      <div>
        <Row>
          <Col>
            <Row>
              <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Size</TableCell>
                  <TableCell align="right">Color</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product, key) => (
                  <TableRow key={product.product_id}>
                    <TableCell component="th" scope="row">
                      <Row>
                        <img alt={product.thumbnail} src={'https://backendapi.turing.com/images/products/'+product.thumbnail} style={{width:60, height:60}} />
                        <Col>
                          <p className='cart-product cart-item'>&nbsp;&nbsp;{product.name}</p>
                          <span className='cart-item'>Color: {product.color}</span>
                        </Col>
                      </Row>
                    </TableCell>
                    <TableCell align="right">
                      <FormControl>
                         <Select
                           value={product.size}
                           onChange={(e)=>this.handleChangeSize(e, product, key)}
                           inputProps={{
                             name: 'size',
                           }}
                         >
                           {product.sizes.map((size, key)=>
                             <MenuItem value={size.attribute_value}>{size.attribute_value}</MenuItem>
                           )}
                         </Select>
                       </FormControl>
                     </TableCell>
                     <TableCell align="right">
                       <FormControl>
                          <Select
                            value={product.color}
                            onChange={(e)=>this.handleChangeColor(e, product, key)}
                            inputProps={{
                              name: 'color',
                            }}
                          >
                            {product.colors.map((color, key)=>
                              <MenuItem value={color.attribute_value}>{color.attribute_value}</MenuItem>
                            )}
                          </Select>
                        </FormControl>
                      </TableCell>
                    <TableCell align="right">
                      <Row>
                        <Back style={{fontSize:30, cursor:'pointer'}} onClick={()=>this.reduceQuantity(product, key)} />
                        <p style={{marginTop:3}} className='cart-product cart-item'>{product.quantity}</p>
                        <Front style={{ fontSize:30, cursor:'pointer'}} onClick={()=>this.addQuantity(product, key)} />
                      </Row>

                    </TableCell>
                    <TableCell align="right"><p className='cart-product cart-item'>{Number(product.subtotal).toFixed(2)}</p></TableCell>
                    <TableCell align="right">
                      <IconButton onClick={()=>this.removeItemFromCart(product)}>
                      <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </Row>
          </Col>
        </Row>
        <Row style={{marginTop:20}} >
          <Col >
            <Row className='float-right'>
              <Col>
                <h6 >SubTotal: ${this.state.subtotal.toFixed(2)}</h6>
                <h6 >Tax: ${this.state.tax_sum.toFixed(2)}</h6>
                <h5 >Total: ${this.state.total.toFixed(2)}</h5>
                {this.props.checkout ? this.state.loading ?
                  <Button variant='contained' color="secondary">
                    Saving...
                  </Button> : <Button onClick={this.addToCart} variant='contained' color="secondary">
                    Continue
                  </Button>
                :<Link to='/checkout' onClick={this.updateProducts}>
                  <Button variant='contained' color="secondary">
                    Checkout
                  </Button>
                </Link>}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

    )
  }
}
export default withStyles(styles)(Cart);
