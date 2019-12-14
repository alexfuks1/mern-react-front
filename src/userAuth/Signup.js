import React from 'react';
import { signup } from '../components';
import {Redirect} from 'react-router-dom';
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
  Divider
} from "semantic-ui-react";
import { Link } from "react-router-dom";

class Signup extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      error: "",
      redirectToSignIn:false
    }
  }
  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });

  }
  handleSubmit = event => {
    event.preventDefault();
    const { name, email, password } = this.state;
    const user = {
      name,
      email,
      password
    };

    signup(user)
      .then(data => {
        if (data.error){
          this.setState({ error: data.error,redirectToSignIn:true });
        } 

        else {
          this.setState({ name: "", email: "", password: "", error: "" });
        }
      })
  }
  render() {
    const { name, email, password, error,redirectToSignIn } = this.state;
    if(redirectToSignIn){
      return <Redirect to="/signin"/>
    }
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 550 }}>
          <Form size="large">
            <Segment raised>
              <Header as="h2" icon color="blue" textAlign="center" color="blue">
                Registration
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
              <Form.Input fluid name="password"
                type="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange("password")}
                value={password}
              />
              <Button onClick={this.handleSubmit} color="blue" fluid size="large">Submit</Button>
              <h5>Already a user? <Link to="/signin">Signin</Link></h5>
            </Segment>
            {
            error ? <Segment>
              <Header as='h5' color='red'>{error}</Header>
            </Segment> : (
                ""
              )
            }
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}
export default Signup;