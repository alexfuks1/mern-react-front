import React from 'react';
import { Container, Header, Grid, Image, Card, Button, Loader, Icon, Menu, Label } from 'semantic-ui-react';
import { getAllPosts,singlePost } from './apiPost';
import { Link } from 'react-router-dom';
import CreateComment from './CreateComment';

class Posts extends React.Component {
    constructor() {
        super();
        this.state = {
            posts: [],
            title:false
        }
    }
    componentDidMount() {
        getAllPosts().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ posts: data });
            }
        })
        .catch(err => console.log(err));
    }
    createComment=()=>{
        this.setState({title:true})
    }
    displayPosts = posts => {
        return (
            <div>
                <Card.Group itemsPerRow={1}>
                    {posts.map((post, i) => {
                        const posterId = post.postedBy ? post.postedBy._id : ""
                        const posterName = post.postedBy ? post.postedBy.name : ""
                        return (
                            <Card key={i}>
                                <Card.Content>
                                    <Image
                                        floated='left'
                                        circular
                                        style={{ width: "40px", height: "40px" }}
                                        src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                                    />
                                    <Card.Header color="blue">
                                        <Link to={`/user/${posterId}`}>{posterName}</Link>
                                    </Card.Header>
                                    <Card.Meta><Icon name="clock" /><strong>{new Date(post.created).toDateString()}</strong></Card.Meta>
                                    <Card.Meta>{post.title}</Card.Meta>
                                    <Card.Content color="black">{post.body.substring(0, 200)}</Card.Content>

                                </Card.Content>
                                <Card.Content extra>
                                    <div>
                                        <Button basic color='blue' floated="left">
                                            <Link to={`/post/${post._id}`}>
                                                Read More
                                            </Link>
                                        </Button>
                                    </div>
                                </Card.Content>
                            </Card>
                        )
                    })}
                </Card.Group>
            </div>
        )
    }
    render() {
        const { posts } = this.state;
        return (
            <Container style={{ margin: '5px 0px' }} floated="right">
                <Header as="h2">{!posts.length ? <Loader active inline='centered'>Loading</Loader> : "Posts"}</Header>
                {this.displayPosts(posts)}
            </Container>
        )
    }
}
export default Posts;
