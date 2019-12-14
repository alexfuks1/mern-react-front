import React from 'react';
import { isAuthenticated } from '../components/index';
import { comment, uncomment } from './apiPost';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
    Grid,
    Form,
    Image,
    Header,
    Button,
    Comment,
    Dimmer,
    Tab,
    Modal,
    List,
    Loader,
    Container,
    TextArea,
    Segment
} from "semantic-ui-react";
class CreateComment extends React.Component {
    constructor() {
        super();
        this.state = {
            text: "",
            error: "",
            loading: false,
            redirectToProfile: false,
            open: false,
        }
    }
    show = (dimmer) => () => this.setState({ dimmer, open: true });
    close = () => this.setState({ open: false });

    handleChange = event => {
        this.setState({ text: event.target.value })

    }
    addComment = e => {
        e.preventDefault();
        const userId = isAuthenticated().user._id;
        const postId = this.props.postId;
        const token = isAuthenticated().token;
        comment(userId, token, postId, { text: this.state.text })
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                }
                else {
                    this.setState({ text: "", open: false })
                    this.props.updateComment(data.comments);
                }
            })
    }
    deleteComment = comment => {
        const userId = isAuthenticated().user._id;
        const postId = this.props.postId;
        const token = isAuthenticated().token;
        uncomment(userId, token, postId, comment)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                }
                else {
                    this.setState({ text: "", open: false })
                    this.props.updateComment(data.comments);
                }
            })
    };

    deleteConfirmed = comment => {
        let answer = window.confirm('Are you sure you want to delete your comment?');
        if (answer) {
            this.deleteComment(comment);
        }
    };

    newPostForm = () => {
        const { dimmer, text } = this.state
        const { open } = this.props
        return (
            <div className="ali">
                <Modal dimmer={dimmer} open={open} onClose={this.close}>
                    <Modal.Header>Create comment</Modal.Header>
                    <Modal.Content image>
                        <Modal.Description>
                            <Grid>
                                <Grid.Column>
                                    <Grid columns={1} divided>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Form onSubmit={this.addComment}>
                                                    <TextArea placeholder='Comment body' onChange={this.handleChange} />
                                                </Form>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Grid.Column>
                            </Grid>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.addComment} color='blue'>Create</Button>
                        <Button
                            positive
                            icon='checkmark'
                            labelPosition='right'
                            content="Next time..."
                            onClick={this.close}
                        />
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }

    render() {
        const { user, redirectToProfile, error, loading } = this.state;
        if (redirectToProfile) {
            return <Redirect to={`/user/${user._id}`} />
        }
        const { comments } = this.props
        const panes = [
            {
                menuItem: 'Comments',
                render: () => <Tab.Pane attached={false}>{comments.map((comment, i) =>
                    (
                        <List>
                                <List.Item>
                                    <List.Content floated='right'>
                                    {isAuthenticated().user &&
                                                isAuthenticated().user._id ===
                                                    comment.postedBy._id && (
                                                    <>
                                                        <Button onClick={()=>{this.deleteConfirmed(comment)}} color="blue">Delete comment</Button>
                                                    </>
                                                )}
                                    </List.Content>
                                    <Image floated="left" avatar size="mini" src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}/>
                                    <Header as="h4">{comment.postedBy.name}</Header>
                                    <List.Content>{new Date(comment.created).toDateString()}</List.Content>
                                    <Header as="h4">{comment.text}</Header>
                                </List.Item>
                            </List>
                    )
                )}</Tab.Pane>,
            }
        ]
        return (
            <Container>
                {this.newPostForm()}
                {error}
                <Tab menu={{ text: true }} panes={panes} />
                {loading ? (

                    <Dimmer active>
                        <Loader size="huge" inverted>Loading, Post created...</Loader>
                    </Dimmer>

                ) : ""}
            </Container>

        )
    }
}
export default CreateComment;