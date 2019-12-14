import React from 'react';
import { isAuthenticated } from '../components/index';
import { create } from './apiPost';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
    Grid,
    Form,
    Segment,
    Card,
    Button,
    Header,
    Dimmer,
    Image,
    Modal,
    Icon,
    Loader,
    Container,
    GridColumn
} from "semantic-ui-react";

class CreatePost extends React.Component {
    constructor() {
        super();
        this.state = {
            title: "",
            body: "",
            photo: "",
            error: "",
            fileSize: 0,
            loading: false,
            redirectToProfile: false,
            user: {},
            open: false,
        }
    }
    show = (dimmer) => () => this.setState({ dimmer, open: true });

    close = () => this.setState({ open: false });

    componentDidMount() {
        this.postData = new FormData();
        this.setState({ user: isAuthenticated().user });
    }
    isFormValid = () => {
        const { body, title, fileSize } = this.state;
        if (fileSize > 1000000) {
            this.setState({
                error: "File size should be less than 100kb",
                loading: false
            });
            return false;
        }
        if (title.length === 0 || body.length === 0) {
            this.setState({ error: "All fields are required", loading: false });
            return false;
        }
        return true;

    }
    handleChange = name => event => {
        this.setState({ error: "" });
        const value =
            name === "photo" ? event.target.files[0] : event.target.value;
        const fileSize = name === "photo" ? event.target.files[0].size : 0;
        this.postData.set(name, value);
        this.setState({ [name]: value, fileSize });

    }
    handleSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        if (this.isFormValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;

            create(userId, token, this.postData).then(data => {
                if (data.error) this.setState({ error: data.error });
                else {
                    this.setState({ loading: false, title: "", body: "", photo: "", redirectToProfile: true, open: false });
                }
            });
        }
    }
    newPostForm = (title, body) => {
        const { open, dimmer } = this.state
        return (
            <div className="ali">
                <Modal dimmer={dimmer} open={open} onClose={this.close}>
                    <Modal.Header>Create Post</Modal.Header>
                    <Modal.Content image>
                        <Modal.Description>
                            <Grid>
                                <Grid.Column>
                                    <Grid columns={1} divided>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Form>
                                                    <Form.Input fluid name="title"
                                                        icon="user"
                                                        iconPosition="left"
                                                        placeholder="Title"
                                                        onChange={this.handleChange("title")}
                                                        value={title}
                                                    />
                                                    <Form.TextArea name="body"
                                                        icon="user"
                                                        iconPosition="left"
                                                        placeholder="Body"
                                                        onChange={this.handleChange("body")}
                                                        value={body}
                                                    />
                                                    <Form.Input fluid name="photo"
                                                        type="file"
                                                        icon="photo"
                                                        iconPosition="left"
                                                        placeholder="Profile photo"
                                                        accept="image/*"
                                                        onChange={this.handleChange("photo")}
                                                    />
                                                </Form>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Grid.Column>
                            </Grid>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.handleSubmit} color='blue'>Create</Button>
                        <Button
                            positive
                            icon='checkmark'
                            labelPosition='right'
                            content="Yep, that's me"
                            onClick={this.close}
                        />
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
    render() {
        const { open, dimmer, title, body, user, photo, redirectToProfile, error, loading } = this.state;
        if (redirectToProfile) {
            return <Redirect to={`/user/${user._id}`} />
        }
        const photoUrl = user._id
            ? `${
            process.env.REACT_APP_API_URL
            }/user/photo/${user._id}?${new Date().getTime()}`
            : <Image src={`https://react.semantic-ui.com/images/wireframe/image.png`} size='small' />;
        ;
        const imageProps = {
            avatar: true,
            spaced: 'right',
            src: '/images/avatar/small/elliot.jpg',
        }
        return (
            <Container>
                <Segment>
                    <Grid columns='equal'>
                        <Grid.Column>
                        <Image src={photoUrl} style={{width:"40px",height:"40px"}} avatar/>
                                <Link className="link" to={`/user/${isAuthenticated().user._id}`}>{`${isAuthenticated().user.name} 's Profile`}</Link>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            
                        </Grid.Column>
                        <Grid.Column>
                        <Button color="blue" floated="right" onClick={this.show('inverted')} content='Create post' icon='add' labelPosition='left' />
                        </Grid.Column>
                    </Grid>
                </Segment>
                {this.newPostForm(title, body)}
                {error}
                {loading ? (

                    <Dimmer active>
                        <Loader size="huge" inverted>Loading, Post created...</Loader>
                    </Dimmer>

                ) : ""}
            </Container>

        )
    }
}
export default CreatePost;