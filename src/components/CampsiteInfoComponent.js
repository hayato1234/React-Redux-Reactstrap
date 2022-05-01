import React, {Component/*, useState*/} from 'react';
import {
  Card,
  CardBody,
  CardImg,
  CardText,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
} from 'reactstrap';
import {Link} from 'react-router-dom';
import {Control, LocalForm, Errors} from 'react-redux-form';
import {Loading} from './LoadingComponent';
import {baseUrl} from '../shared/baseUrl';
import {FadeTransform, Fade, Stagger} from 'react-animation-components';
// import {useSpring, animated} from 'react-spring';

const required = val => val && val.length;
const maxLength = len => val => !val || val.length <= len;
const minLength = len => val => !val || val.length >= len;

function RenderCampsite({campsite}) {
  // this is for animation exercise
  // const [flipped, set] = useState(false);
  // const {transform, opacity} = useSpring({
  //   opacity: flipped ? 1 : 0,
  //   transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
  //   config: {mass: 5, tension: 500, friction: 80},
  // });
  return (
    <div className="col-md-5 m-1">
      <FadeTransform
        in
        transformProps={{
          exitTransform: 'scale(0.5) translateY(-50%)',
        }}
      >
        <Card>
          <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
          <CardBody>
            <CardText>{campsite.description}</CardText>
          </CardBody>
        </Card>
      </FadeTransform>
    </div>

    // this is for animation exercise
    // <div className="col-md-5 m-1">
    //   <FadeTransform
    //     in
    //     transformProps={{
    //       exitTransform: 'scale(0.5) translateY(-50%)',
    //     }}
    //   >
    //     <Card>
    //       <div onClick={() => set(state => !state)}>
    //         <animated.img
    //           width="100%"
    //           src={baseUrl + campsite.image}
    //           style={{opacity: opacity.to(o => 1 - o), transform, position: 'absolute'}}
    //           alt={campsite.name}
    //         />
    //         <animated.img
    //           width="100%"
    //           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF5srwri1hTb5WQEqBIRntLCf7umaiwhLgHw&usqp=CAU"
    //           style={{
    //             opacity,
    //             transform,
    //             rotateX: '180deg',
    //             position: 'relative',
    //           }}
    //           alt={campsite.name}
    //         />
    //       </div>
    //       <CardBody>
    //         <CardText>{campsite.description}</CardText>
    //       </CardBody>
    //     </Card>
    //   </FadeTransform>
    // </div>
  );
}

function RenderComments({comments, campsiteId, postComment}) {
  if (comments) {
    return (
      <div className="col-md-5 m-1">
        <h4>Comments</h4>
        <Stagger in>
          {comments.map(comment => {
            return (
              <Fade in key={comment.id}>
                <div>
                  <p>{comment.text}</p>
                  <p>
                    -- {comment.author},{' '}
                    {new Intl.DateTimeFormat('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                    }).format(new Date(Date.parse(comment.date)))}
                  </p>
                </div>
              </Fade>
            );
          })}
        </Stagger>
        <CommentForm campsiteId={campsiteId} postComment={postComment} />
      </div>
    );
  }
  return <div />;
}

function CampsiteInfo(props) {
  if (props.isLoading) {
    return (
      <div className="container">
        <div className="row">
          <Loading />
        </div>
      </div>
    );
  }
  if (props.errMess) {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <h4>{props.errMess}</h4>
          </div>
        </div>
      </div>
    );
  }
  if (props.campsite) {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/directory">Directory</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
            </Breadcrumb>
            <h2>{props.campsite.name}</h2>
            <hr />
          </div>
        </div>
        <div className="row">
          <RenderCampsite campsite={props.campsite} />
          <RenderComments
            comments={props.comments}
            postComment={props.postComment}
            campsiteId={props.campsite.id}
          />
        </div>
      </div>
    );
  } else {
    return <div />;
  }
}

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: '',
      author: '',
      text: '',
      isCommentModalOpen: false,
      touched: {
        author: false,
        message: false,
      },
    };
    this.toggleCommentModal = this.toggleCommentModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleCommentModal() {
    this.setState({
      isCommentModalOpen: !this.state.isCommentModalOpen,
    });
  }

  handleSubmit(values) {
    // alert('Submitted: ' + JSON.stringify(values));
    this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text);
    this.toggleCommentModal();
  }

  render() {
    return (
      <React.Fragment>
        <Button onClick={this.toggleCommentModal} outline>
          <i className="fa fa-pencil fa-lg" />
          Submit Comment
        </Button>
        <Modal isOpen={this.state.isCommentModalOpen} toggleModal={this.toggleCommentModal}>
          <ModalHeader toggle={this.toggleCommentModal}>Submit Comment</ModalHeader>
          <ModalBody>
            <LocalForm onSubmit={values => this.handleSubmit(values)}>
              <div className="form-group">
                <Label htmlFor="rating">Rating</Label>
                <Control.select
                  model=".rating"
                  id="rating"
                  name="rating"
                  className="form-control"
                  validators={{
                    required,
                  }}
                >
                  <option defaultValue>Choose...</option>
                  <option>★☆☆☆☆(1)</option>
                  <option>★★☆☆☆(2)</option>
                  <option>★★★☆☆(3)</option>
                  <option>★★★★☆(4)</option>
                  <option>★★★★★(5)</option>
                </Control.select>
                <Errors
                  className="text-danger"
                  model=".rating"
                  show="touched"
                  component="div"
                  messages={{
                    required: 'Required',
                  }}
                />
              </div>
              <div className="form-group">
                <Label htmlFor="author">Your Name</Label>
                <Control.text
                  model=".author"
                  id="author"
                  name="author"
                  className="form-control"
                  placeholder="Your name"
                  validators={{
                    required,
                    minLength: minLength(2),
                    maxLength: maxLength(15),
                  }}
                />
                <Errors
                  className="text-danger"
                  model=".author"
                  show="touched"
                  component="div"
                  messages={{
                    required: 'Required',
                    minLength: 'Must be at least 2 characters',
                    maxLength: 'Must be 15 characters or less',
                  }}
                />
              </div>
              <div className="form-group">
                <Label htmlFor="text">Comment</Label>
                <Control.textarea
                  model=".text"
                  id="text"
                  name="text"
                  rows={6}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <Button type="submit" value="submit" color="primary">
                  Submit
                </Button>
              </div>
            </LocalForm>
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}

export default CampsiteInfo;
