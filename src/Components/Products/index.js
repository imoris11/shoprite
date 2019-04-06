import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import LinearIndeterminate from '../Extra/Loading';
import {Link} from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';
import { Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
class Products extends Component {
   addToCart (product) {
     //Set Default product details
     product.quantity = 1;
     product.size = 'S';
     product.color = product.colors[0].attribute_value;
     product.subtotal = product.price;
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
  render () {
    let { classes } = this.props;
    return (
      <Row>
        {this.props.loading &&
          <LinearIndeterminate /> }
        {this.props.products.map((product, key)=>
          <Col key={key} sm={4}>
            <div className='flip-container'>
              <div className="flipper">
                <div className="front">
                  <Card className={classes.card}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image={'https://backendapi.turing.com/images/products/'+product.thumbnail}
                      title={product.thumbnail}
                    />
                    <CardContent>
                      <Typography gutterBottom variant='h5' component='h2'>
                        {product.name}
                      </Typography>
                      <Chip label={'$' + product.price} className={classes.chip} />
                      <Chip label={'Sizes: '} className={classes.chip} />
                      {product.sizes.map((size, key)=>
                        <span key={key}>{size.attribute_value}&nbsp;</span>
                      )}
                      <CardActions>
                        {product.colors.map((color, key)=>
                          <div key={key} className='color-circle' style={{backgroundColor:color.attribute_value}}></div>
                        )}
                      </CardActions>
                    </CardContent>
                  </CardActionArea>

                </Card>
                </div>
                <div className="back">
                  <Card className={classes.card}>
                    <CardActionArea>
                      <CardMedia
                        className={classes.media}
                        image={' https://backendapi.turing.com/images/products/'+product.thumbnail}
                        title={product.thumbnail}
                      />
                      <CardContent>
                        <Typography gutterBottom variant='h5' component='h2'>
                          {product.name}
                        </Typography>
                        <p>
                          {product.description}
                        </p>
                        <CardActions>
                          <Link to={'/products/'+product.product_id}>
                            <Button color="secondary" variant='contained'>
                              View Item
                           </Button>
                          </Link>

                         <Button onClick={()=>this.addToCart(product)} color="secondary" variant='contained' >
                           Add to Cart
                        </Button>
                    </CardActions>
                      </CardContent>
                    </CardActionArea>
                </Card>
                </div>
              </div>
            </div>
        </Col>
        )}
        <ToastContainer autoClose={4000} />
      </Row>
    )
  }
}
export default withStyles(styles)(Products)
