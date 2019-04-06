import React, {Component} from 'react';
import { Row, Col } from 'react-bootstrap';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import { getOrdersApi} from './ProfileApi';
export default class Orders extends Component {
  state = {
    orders:[]
  }
  componentDidMount () {
    this.fetchOrders();
  }
  fetchOrders = async () => {
    let token = localStorage.getItem('token');
    let url = 'https://backendapi.turing.com/orders/inCustomer';
    let orders = await getOrdersApi(url, token);
    this.setState({ orders })
  }
  render () {
    let { orders } = this.state
    return (
      <Row>
        <Col>
          <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Id</TableCell>
              <TableCell>Total Amount ($)</TableCell>
              <TableCell align="right">Created On</TableCell>
              <TableCell align="right">Shipped On</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, key) => (
              <TableRow key={order.order_id}>
                <TableCell component="th" scope="row">
                  <p>{order.order_id}</p>
                </TableCell>
                <TableCell component="th" scope="row">
                  <p>{order.total_amount}</p>
                </TableCell>
                <TableCell align="right">
                  <p>{moment(order.created_on).format('ll')}</p>
                 </TableCell>
                 <TableCell align="right">
                   <p>{order.shipped_on}</p>
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </Col>
      </Row>
    )
  }
}
