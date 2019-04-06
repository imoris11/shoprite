import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Contact from './Contact';
import Orders from './Orders';
function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
export default class Profile extends Component {
  state = {
    value:0
  }
  handleChange = (e, value) => this.setState({value})
  render () {
    let {value} = this.state;
    return (
      <Row>
        <Col md={{ span:8, offset:2}}>
          <Row>
            <Col style={{marginTop:20}}>
              <Tabs variant="fullWidth"
                value={value}
                onChange={this.handleChange}>
                <Tab label="Contact Info" />
                <Tab label="My Orders" />
              </Tabs>
              {value === 0 && <TabContainer>
                <div>
                  <h3 className='text-center text-info'>Contact Info</h3>
                  <Contact contact={true} />
                </div>
              </TabContainer>}
              {value === 1 && <TabContainer>
                <div>
                  <h3 className='text-center text-info'>Orders</h3>
                  <Orders contact={true} />
                </div>
              </TabContainer>}

            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
