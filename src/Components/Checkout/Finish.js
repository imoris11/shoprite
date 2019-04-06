import React, {Component} from 'react';
import { Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
export default class Delivery extends Component {
  render () {
    return (
      <div>
        <Row>
          <Col>
            <img alt="rocket" src={require('../../Resources/images/icons-rocket.png')}/>
          </Col>
          <Col>
            <h3 style={{marginTop:30}}>Success!</h3>
            <p>Your items will be shipped shortly. Check your email for more details.</p>
          </Col>
        </Row>
        <Row >
          <Col >
            <Row className='float-right'>
              <Col>
                <Link to="/">
                  <Button  variant='contained' color="secondary">
                    Go Home
                  </Button>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

    )
  }
}
