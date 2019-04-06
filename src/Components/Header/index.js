import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CartIcon from '@material-ui/icons/ShoppingCart';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import Badge from '@material-ui/core/Badge';
import AppBar from './Appbar';
import {Row, Col} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Registration from '../Registration';
import CartModal from '../Cart/Cart-modal';
import '../../Resources/css/header.css';
const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  menuItems:{
    marginTop:10,
  },
  margin: {
    margin: theme.spacing.unit * 2,
  },
});

class Header extends Component{
  constructor (props) {
    super(props);
    this.state = {
      showDialog:false,
      badgeValue:0,
      showCart:false
    }
    this.handleScroll = this.handleScroll.bind(this);
    this.localStorageUpdated = this.localStorageUpdated.bind(this);
  }
  componentDidMount() {
    //Add listener to show scroll to top UI
    window.addEventListener("scroll", this.handleScroll);
    //Add listener to localStorage on document
    this.addLocalStorageListener();
    //Get last stored number of products in cart
    this.getLocalBadgeValue();
    //Confirm if user is logged in
    this.confirmUserStatus();
  }
  addLocalStorageListener () {
    var originalSetItem = localStorage.setItem;
    localStorage.setItem = function() {
      var event = new Event('itemInserted');
      document.dispatchEvent(event);
      originalSetItem.apply(this, arguments);
    }
    document.addEventListener("itemInserted", this.localStorageUpdated, false);
  }
  confirmUserStatus () {
    let token = localStorage.getItem('token');
    let user = localStorage.getItem('customer');
    if (token) {
      user = JSON.parse(user);
      this.setState({token, loggedIn:true, name: user.firstName + " " + user.lastName});
    }
  }
  getLocalBadgeValue () {
    let badgeValue = localStorage.getItem('badge');
    if (badgeValue) {
      this.setState({badgeValue});
    }
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener('itemInserted', this.localStorageUpdated);
  }
  localStorageUpdated(e){
    let badgeValue = localStorage.getItem('badge');
    if (badgeValue && Number(badgeValue) !== this.state.badgeValue) {
      this.setState({badgeValue});
    }else if (!badgeValue){
      this.setState({badgeValue});
    }
  }
  toggleDialog = () => {
    this.setState(prevState => ({showDialog:true}))
  }
  toggleCartModal = () => {
    this.setState(prevState => ({showCart:true}))
  }
  handleClose = () => {
    this.setState(prevState => ({showCart:false, showDialog:false}))
  }
  handleScroll() {
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {
      this.setState({
        isAtBottom:true
      });
    }
  }
  scrollToTop = () => {
    window.scrollTo(0, 0);
  }
  render () {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Col style={{backgroundColor:'#2e2e2e', color:'white'}}>
          <Row>
            <Col sm={3} xs={10}>
              {!this.state.token ?
                 <p style={{marginTop:10}}>Hi! <span className='span-link' onClick={this.toggleDialog}>Sign in</span>
                 &nbsp; Or <span className='span-link' onClick={this.toggleDialog}>Register</span>
               </p> : <p style={{marginTop:10}}>Hi! <span className='span-link'>{this.state.name}</span></p>
             }
            </Col>
            <Col sm={8} className='d-none d-sm-block'>
              <Row>
                <Col md={2} sm={3}>
                  <Link to="/deals" className='primary-link'>
                  <p className={classes.menuItems}>Daily Deals</p></Link>
                </Col>
                <Col md={1} sm={1}>
                  <Link to="/sell" className='primary-link' >
                  <p className={classes.menuItems} style={{marginTop:10}}>Sell</p>
                  </Link>
                </Col>
                <Col md={3} sm={3}>
                  <Link to="/contact" className='primary-link' >
                  <p className={classes.menuItems} style={{marginTop:10}}>Help & Contact</p>
                </Link>
                </Col>
                <Col md={6} sm={5}></Col>
              </Row>
            </Col>
            <Col sm={1} xs={2}>
              <IconButton onClick={this.toggleCartModal} className={classes.menuButton} color="inherit" aria-label="Menu">
                <Badge badgeContent={this.state.badgeValue} color="primary">
                  <CartIcon />
                </Badge>
            </IconButton>
          </Col>
          </Row>
        </Col>
        <AppBar />
        {this.state.isAtBottom && <div onClick={this.scrollToTop} className='text-center floating-button'>
          <ArrowDropUp className='floating-icon' style={{fontSize:'50px'}} />
        </div> }
        <Registration showDialog={this.state.showDialog} handleClose={this.handleClose} />
        <CartModal showDialog={this.state.showCart} handleClose={this.handleClose} items={this.state.badgeValue} />
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
