import React from 'react';
import { isAuthenticated } from '../components/index';
import { singlepost, update } from './apiPost';
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

class UpdatePost extends React.Component {
    constructor() {
        super();
        this.state = {
            open: false,
            id: "",
            title: "",
            body: "",
            error: "",
            fileSize: 0,
            loading: false,
            redirectToProfile: false
        }
    }
    init = postId => {
        singlepost(postId)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToProfile: true });
                }
                else {
                    this.setState({
                        id: data._id,
                        title: data.title,
                        body: data.body,
                        error: "",
                    });
                }
            })
    }
    componentDidMount() {
        this.postData = new FormData();
        const postId = this.props.match.params.postId;
        this.init(postId);
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
            const postId = this.state.id;
            const token = isAuthenticated().token;

            update(postId, token, this.postData).then(data => {
                if (data.error) this.setState({ error: data.error });
                else {
                    this.setState({
                        loading: false,
                        title: "",
                        body: "",
                        redirectToProfile: true
                    })
                }
            });
        }
    }
    newPostForm = (title, body) => (
        <div>
            <Grid textAlign="center" verticalAlign="middle" className="app" style={{ marginTop: '85px' }}>
                <Grid.Column style={{ maxWidth: 1000 }}>
                    <Form size="large">
                        <Segment>
                            <Header as="h2" icon color="blue" textAlign="center" color="blue">
                                Update post
                                <Icon name="undo" />
                            </Header>
                            <Form.Input fluid name="title"
                                icon="pencil alternate"
                                iconPosition="left"
                                placeholder="Title"
                                onChange={this.handleChange("title")}
                                value={title}
                            />
                            <Form.Input fluid name="body"
                                icon="mail"
                                type="email"
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
                            <Button onClick={this.handleSubmit} color="blue" fluid size="large">Update post</Button>
                        </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        </div>
    );
    render() {
        const { title, body, redirectToProfile, id,loading } = this.state;
        if (redirectToProfile) {
            return <Redirect to={`/user/${isAuthenticated().user._id}`} />
        }
        const photoUrl = id
            ? `${
            process.env.REACT_APP_API_URL
            }/user/photo/${id}`
            : <Image src='https://react.semantic-ui.com/images/wireframe/image.png' size='small' rounded />;
        ;
        return (
            <Container style={{ marginTop: '85px' }}>
                {this.newPostForm(title, body)}
                <Image size="mini" onError={i => (i.target.src = `https://react.semantic-ui.com/images/wireframe/image.png`)}
                    src={`${
                        process.env.REACT_APP_API_URL
                        }/post/photo/${id}`}
                />
                {loading ? (

                    <Dimmer active>
                        <Loader size="huge" inverted>Loading, Update Post</Loader>
                    </Dimmer>

                ) : ""}
            </Container>
        )
    }
}
export default UpdatePost;