import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../components/index';
import { singlepost, remove, like, unlike, comment,uncomment } from './apiPost';
import CreateComment from './CreateComment';
import _ from 'lodash';
import {
  Grid,
  Comment,
  Tab,
  Button,
  Header,
  List,
  Menu,
  Label,
  Image,
  Card,
  Icon,
  Loader,
  Container
} from "semantic-ui-react";

class SinglePost extends React.Component {
  state = {
    post: "",
    redirectToHome: false,
    postDeleted: false,
    deleted: false,
    open: false,
    like: false,
    likes: 0,
    comments: []
  }
  componentDidMount = () => {
    const postId = this.props.match.params.postId;
    singlepost(postId).then(data => {
      if (data.error) {
        console.log(data.error);
      }
      else {
        this.setState({ post: data, likes: data.likes.length, comments: data.comments });
      }
    })
  }
  handleLike = () => {
    let callApi = this.state.like ? unlike : like
    const userId = isAuthenticated().user._id;
    const postId = this.state.post._id;
    const token = isAuthenticated().token;

    callApi(userId, token, postId)
      .then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({
            like: !this.state.like,
            likes: data.likes.length
          });
        }
      });
  }
  updateComment = comments => {
    this.setState({ comments })
  }
  displaySingleComment = post => {
    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : '';
    const posterName = post.postedBy ? post.postedBy.name : ' Unknown';
    const { like, likes, comments,open } = this.state;
    return (
      <Card>
        <Card.Content>
          <Image
            floated='left'
            circular
            style={{ width: "50px", height: "50px" }}
            src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
          />
          <Card.Header color="blue">
            <Link to={`${posterId}`}>{posterName}</Link>
          </Card.Header>
          <Card.Meta><Icon name="clock" /><strong>{new Date(post.created).toDateString()}</strong></Card.Meta>
          <Card.Meta>{post.title}</Card.Meta>
          <Card.Description>{post.body}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Menu compact>
            <Menu.Item as='a' onClick={this.handleLike}>
              <Icon name='like' /> Like
              <Label color='blue' floating>
                {likes}
              </Label>
            </Menu.Item>
          </Menu>
          <Menu compact>
            <Menu.Item as='a' onClick={this.addComment}>
              <Icon name='add' /> Add comment
              <Label color='blue' floating>
                {comments.length}
              </Label>
            </Menu.Item>
          </Menu>
          <Button basic color='blue' floated="right">
            <Icon name="angle double left" />
            <Link to={`/`}> Back to posts</Link>
          </Button>
          {isAuthenticated().user && isAuthenticated().user._id === post.postedBy._id && (
                        <>
                              <Button basic color='blue' floated="right">
                                <Icon name="angle double top" />
                                <Link to={`/post/edit/${post._id}`}>Update Post</Link>
                              </Button>
                              <Button onClick={this.deleteConfirmed} basic color='blue' floated="right">
                                <Icon name="angle double top" />
                                Delete Post
                              </Button>
                        </>
                    )}
          <CreateComment updateComment={this.updateComment} comments={comments} postId={post._id} open={open}/>
        </Card.Content>
      </Card>
    )
  }
  addComment=()=>{
    this.setState({open:true})
  }
  showModal = () => {
    this.setState({ open: true })
  }
  deletePost = () => {
    const postId = this.props.match.params.postId;
    const token = isAuthenticated().token;
    remove(postId, token).then(data => {
        if (data.error) {
            console.log(data.error);
        } else {
            this.setState({ redirectToHome: true });
        }
    });
};

deleteConfirmed = () => {
    let answer = window.confirm('Are you sure you want to delete your post?');
    if (answer) {
        this.deletePost();
    }
};
  render() {
    const { post, redirectToHome, redirectToSignin, open, size, like, likes } = this.state;
    // if (redirectToHome) {
    //   return <Redirect to={`/`} />;
    // } else if (redirectToSignin) {
    //   return <Redirect to={`/signin`} />;
    // }
    return (
      <Container style={{ marginTop: '85px' }}>
        <Header as="h3">Single Post</Header>
        {/* <Card.Group itemsPerRow={1}>{this.displaySinglePost(post)}</Card.Group> */}
        {!post ? (
          <div>
            <Loader active inline='centered'>Loading</Loader>
          </div>
        ) : (
            <Card.Group itemsPerRow={1}>{this.displaySingleComment(post)}</Card.Group>

          )}
      </Container>
    )
  }
}
export default SinglePost;