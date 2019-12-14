import React from 'react';
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../components/index';
import { read, update,updateUserData } from './Userapi';
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

class updateProfile extends React.Component {
    constructor() {
        super();
        this.state = {
            id: "",
            name: "",
            email: "",
            password: "",
            about:"",
            redirectToProfile: false,
            error: "",
            fileSize: 0,
            loading: false
        }
    }
    init = userId => {
        const token = isAuthenticated().token;
        read(userId, token)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToProfile: true });
                }
                else {
                    this.setState({
                        id: data._id,
                        name: data.name,
                        email: data.email,
                        error: "",
                        about:data.about
                    });
                }
            })
    }
    componentDidMount() {
        this.userData = new FormData();
        const userId = this.props.match.params.userId;
        this.init(userId);
    }
    isFormValid = () => {
        const { name, email, password, fileSize } = this.state;
        if (fileSize > 1000000) {
            this.setState({
                error: "File size should be less than 100kb",
                loading: false
            });
            return false;
        }
        if (name.length === 0) {
            this.setState({ error: "Name is required", loading: false });
            return false;
        }
        // email@domain.com
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            this.setState({
                error: "A valid Email is required",
                loading: false
            });
            return false;
        }
        if (password.length >= 1 && password.length <= 5) {
            this.setState({
                error: "Password must be at least 6 characters long",
                loading: false
            });
            return false;
        }
        return true;

    }
    handleChange = name => event => {
        this.setState({ error: "" });
        const value =
            name === "photo" ? event.target.files[0] : event.target.value;
        const fileSize = name === "photo" ? event.target.files[0].size : 0;
        this.userData.set(name, value);
        this.setState({ [name]: value, fileSize });

    }
    handleSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });
        if (this.isFormValid()) {
            const userId = this.props.match.params.userId
            const token = isAuthenticated().token;

            update(userId, token, this.userData).then(data => {
                if (data.error) this.setState({ error: data.error });
                else {
                    updateUserData(data,()=>{
                        this.setState({ redirectToProfile: true });
                    });
                }
            });
        }
    }
    updateUser = (name, email, password, loading,about) => (
        <div>
            <Grid textAlign="center" verticalAlign="middle" className="app" style={{ marginTop: '85px' }}>
                <Grid.Column style={{ maxWidth: 1000 }}>
                    <Form size="large">
                        <Segment>
                            <Header as="h2" icon color="blue" textAlign="center" color="blue">
                                Registretion
                                <Icon name="signup" />
                            </Header>
                            <Form.Input fluid name="name"
                                icon="user"
                                iconPosition="left"
                                placeholder="Username"
                                onChange={this.handleChange("name")}
                                value={name}
                            />
                            <Form.Input fluid name="email"
                                icon="mail"
                                type="email"
                                iconPosition="left"
                                placeholder="Email"
                                onChange={this.handleChange("email")}
                                value={email}
                            />
                            <Form.Input fluid name="About"
                                icon="user"
                                iconPosition="left"
                                placeholder="About"
                                onChange={this.handleChange("about")}
                                value={about}
                            />
                            <Form.Input fluid name="password"
                                type="password"
                                icon="lock"
                                iconPosition="left"
                                placeholder="Password"
                                onChange={this.handleChange("password")}
                                value={password}
                            />
                            <Form.Input fluid name="password"
                                type="file"
                                icon="photo"
                                iconPosition="left"
                                placeholder="Profile photo"
                                accept="image/*"
                                onChange={this.handleChange("photo")}
                            />
                            <Button onClick={this.handleSubmit} color="blue" fluid size="large">Update</Button>
                        </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        </div>
    );

    render() {
        const { id, name, email, password, redirectToProfile, error, loading } = this.state;
        if (redirectToProfile) {
            return <Redirect to={`/user/${id}`} />
        }
        const photoUrl = id
            ? `${
            process.env.REACT_APP_API_URL
            }/user/photo/${id}?${new Date().getTime()}`
            : <Image src='https://react.semantic-ui.com/images/wireframe/image.png' size='small' rounded/>;
        ;
        return (
            <Container>
                {this.updateUser(name, email, password)}
                {error}
                {loading ? (

                    <Dimmer active>
                        <Loader size="huge" inverted>Loading, Update User Profile</Loader>
                    </Dimmer>

                ) : ""}
            </Container>
        )
    }
}
export default updateProfile;