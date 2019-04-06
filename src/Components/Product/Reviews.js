import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Star from '@material-ui/icons/Star';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TimeStamp from '../Extra/Timestamp';
import Registration from '../Registration';
import moment from 'moment';
export default class Reviews extends Component {
  constructor (props) {
    super(props);
    this.state = {
      productId:this.props.productId,
      selectedRating:0,
      token:'',
      review:'',
      loading:false,
      showDialog:false
    }
  }
  componentDidMount () {
    this.getAPIToken();
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
  showReviewForm () {
    let {selectedRating} = this.state;
    return (
      <Row>
        <Col>
          <Typography variant="h6" color="inherit">
            Add a review
          </Typography>
          <form onSubmit={this.handleSubmit}>
            <div className='form-group'>
              <Row>
                <Col sm={4}>
                  <p>Your review</p>
                </Col>
                <Col sm={8}>
                  <textarea className='form-control' rows={4} name='review' onChange={this.handleChange} required value={this.state.review}/>
                </Col>
              </Row>
            </div>
            <div className='form-group'>
              <Row>
                <Col sm={4}>
                  <p>Overall Rating</p>
                </Col>
                <Col sm={8}>
                  <Star style={{color:selectedRating >=1 && 'orange', cursor:'pointer'}} onClick={()=>this.setRating(1)} />
                  <Star style={{color:selectedRating >=2 && 'orange', cursor:'pointer'}} onClick={()=>this.setRating(2)} />
                  <Star style={{color:selectedRating >=3 && 'orange', cursor:'pointer'}} onClick={()=>this.setRating(3)} />
                  <Star style={{color:selectedRating >=4 && 'orange', cursor:'pointer'}} onClick={()=>this.setRating(4)} />
                  <Star style={{color:selectedRating >=5 && 'orange', cursor:'pointer'}} onClick={()=>this.setRating(5)} />
                </Col>
              </Row>
            </div>
            <div>
              <Row>
                <Col sm={4}>
                </Col>
                <Col sm={8} style={{paddingBottom:20}}>
                  {this.state.loading ? <Button disabled color="secondary" variant='contained' >
                    Saving...
                 </Button> :
                 <Button type='submit' color="secondary" variant='contained' >
                   Submit
                </Button> }
                </Col>
              </Row>
            </div>
          </form>
        </Col>
      </Row>
    );
  }
  setRating (rating) {
    this.setState({selectedRating:rating});
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState( prevState => ({loading:!prevState.loading}));
    let data = {
      product_id:this.state.productId,
      review:this.state.review,
      rating:this.state.selectedRating
    };
    fetch('https://backendapi.turing.com/products/' + this.props.productId + '/reviews', {
      method:'POST',
      headers:{
        'content-type':'application/json',
        'Accept': 'application/json',
        'user-key': this.state.token
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      this.setState({review:'', loading:false})
      this.successNotification("Successfully submitted review");
    })
    .catch(error => {
      // TODO: Use snackbar to display error message
      this.setState({errorMessage: 'Encountered an error'})
    })
  }
  successNotification = (message) => {
    toast.success(message, {
        position: toast.POSITION.TOP_RIGHT
      });
  }
  toggleDialog = () => {
    this.setState(prevState => ({showDialog:true}))
  }
  handleClose = () => {
    this.setState(prevState => ({showDialog:false}))
  }
  render () {
    return (
      <Row style={{ backgroundColor:'#EEEEEE'}}>
        <Col md={{ span: 10, offset: 1 }} style={{marginTop:30,}}>
          <Typography variant="h5" color="inherit" style={{marginLeft:10}}>
            Product Reviews
          </Typography>
        </Col>
        <Col style={{marginTop:30,}} md={{ span: 10, offset: 1 }}>
          {this.props.reviews.map((review, key)=>
            <Row key={key}>
              <Col sm={3}>
                <Col md={{ span: 10, offset: 1 }}>
                  <Star style={{color:Number(review.rating) >=1 ? 'orange' :'grey'}} className='star' />
                  <Star style={{color:Number(review.rating) >=2 ? 'orange' :'grey'}} className='star' />
                  <Star style={{color:Number(review.rating) >=3 ? 'orange' :'grey'}} className='star' />
                  <Star style={{color:Number(review.rating) >=4 ? 'orange' :'grey'}} className='star' />
                  <Star style={{color:Number(review.rating) >=5 ? 'orange' : 'grey'}} className='star' />
                  <p className='username'>{review.name}</p>
                  <p className='timestamp'>{TimeStamp(moment(review.created_on))}</p>
                </Col>
              </Col>
              <Col sm={9}>
                  <Col>
                    <p>{review.review}</p>
                  </Col>
              </Col>
            </Row>
          )}
          {this.props.totalReviews > this.props.reviews.length && <h5 className='text-center'>See All Reviews ({this.props.totalReviews})</h5>}
        </Col>
        <Col style={{marginTop:30,}} md={{ span: 10, offset: 1 }}>
          {this.state.token ? this.showReviewForm() : <p style={{marginTop:10}}>Hi! <span className='span-link' onClick={this.toggleDialog}>Sign in</span>
          &nbsp; Or <span className='span-link' onClick={this.toggleDialog}>Register</span> to add a review</p>}
        </Col>
          <Registration showDialog={this.state.showDialog} handleClose={this.handleClose} />
          <ToastContainer autoClose={4000} />
      </Row>
    );
  }
}
