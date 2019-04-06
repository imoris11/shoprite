import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import '../../Resources/css/footer.css';
import moment from 'moment';
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
    margin:10,
    padding:5
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    color:'#f62f5e',
    marginTop:5
  },
});
class Footer extends Component {
  state = {
    departments:[]
  }
  componentDidMount () {
    this.fetchData();
  }
  fetchData = () => {
    fetch("https://backendapi.turing.com/departments").then(response => response.json()).then(results => {
      if (!results.error) {
        this.setState({departments:results})
      }
    })
  }
  render () {
    let { classes } = this.props;
    let {departments} = this.state;
    return (
      <div style={{marginTop:20, backgroundColor:'#EEEEEE'}} >
        <Col>
          <Row>
            <Col sm={3}>
              <Link to='/'>
                <Typography className={classes.title} variant="h6" color="inherit" noWrap>
                  SHOPMATE
                </Typography>
              </Link>
            </Col>
            <Col sm={3}>
              <p className='footer-links'>
                About
              </p>
            </Col>
            <Col sm={3}>
              <p className='footer-links'>
                Contact Us
              </p>
            </Col>
            <Col sm={3}>
              <p className='footer-links'>
                Terms and Conditions
              </p>
            </Col>

          </Row>
        </Col>
        <Col style={{backgroundColor:'#2e2e2e', color:'white', height:200}}>
            <Col md={{span:6, offset:3}}>
              <Row>
                {departments.map((department, key)=>
                  <Col key={key} sm={4}>
                    <Link  to={"/catalogue/" + department.department_id + "/" +department.name}>
                      <Typography variant="h6" color="inherit" className={classes.menuItems}>
                        {department.name}
                      </Typography>
                    </Link>
                </Col>
                )}
                <Col md={{span:6, offset:3}}>
                  <a href="https://web.facebook.com/imorobebh" target="_blank" rel="noopener noreferrer">
                    <img src={require('../../Resources/images/fb.png')} style={{margin:10}} alt="facebook logo" />
                  </a>
                  <a href="https://www.instagram.com/richard_igbiriki/" rel="noopener noreferrer" target="_blank">
                  <img src={require('../../Resources/images/ig.png')} style={{margin:10}} alt="facebook logo" />
                  </a>
                  <a href="https://web.facebook.com/imorobebh" rel="noopener noreferrer" target="_blank">
                    <img src={require('../../Resources/images/p.png')} style={{margin:10}} alt="facebook logo" />
                  </a>
                  <a href="https://twitter.com/RichardIgbiriki" rel="noopener noreferrer" target="_blank">
                    <img src={require('../../Resources/images/twitter.png')} style={{margin:10}} alt="facebook logo" />
                  </a>
                </Col>
              </Row>
            </Col>
        </Col>
        <Col className='text-center' style={{backgroundColor:'black', color:'grey', height:40}}>
            <p style={{paddingTop:10}} className='text-center'>Copyright @Richard Igbiriki, {moment().format('ll').split(',')[1] }</p>
        </Col>
      </div>
    )
  }
}

export default withStyles(styles)(Footer);
