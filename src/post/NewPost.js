import React from 'react';
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../components/index';
import {create} from './apiPost';
import {
    Grid,
    Form,
    Segment,
    Button,
    Header,
    Dimmer,
    Image,
    
    Icon,
    Loader,
    Container
} from "semantic-ui-react";

class NewPost extends React.Component {
    constructor() {
        super();
        this.state = {
           title:"",
           body:"",
           photo:"",
           error:"",
           fileSize:0,
           loading:false,
           redirectToProfile:false,
           user:{}
        }
    }
    componentDidMount() {
        this.postData = new FormData();
        this.setState({user:isAuthenticated().user});
    }
    isFormValid = () => {
        const { body,title,fileSize } = this.state;
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
                    this.setState({ loading:false,title:"",body:"",photo:"",redirectToProfile:true });
                }
            });
        }
    }
    newPostForm = (title,body) => (
        <div>
            <Grid textAlign="center" verticalAlign="middle" className="app" style={{ marginTop: '85px' }}>
                <Grid.Column style={{ maxWidth: 1000 }}>
                    <Form size="large">
                        <Segment>
                            <Header as="h2" icon color="blue" textAlign="center" color="blue">
                                Create New Post
                                <Icon name="signup" />
                            </Header>
                            <Form.Input fluid name="title"
                                icon="user"
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
                            <Button onClick={this.handleSubmit} color="blue" fluid size="large">Create post</Button>
                        </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        </div>
    );

    render() {
        const { title,body,user,photo,redirectToProfile,error,loading } = this.state;
        if (redirectToProfile) {
            return <Redirect to={`/user/${user._id}`} />
        }
        return (
            <Container>
                {this.newPostForm(title,body)}
                {error}
                {/* {loading ? (

                    <Dimmer active>
                        <Loader size="huge" inverted>Loading, Post created...</Loader>
                    </Dimmer>

                ) : ""} */}
            </Container>
        )
    }
}
export default NewPost;