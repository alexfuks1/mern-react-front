import React from 'react';
import { signin,authenticate } from '../components';
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
  Dimmer,
  Loader,
  Confirm
} from "semantic-ui-react";

import { Link, Redirect } from "react-router-dom";


class SignIn extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      error: "",
      redirectUser: false,
      loading: false
    }
  }
  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });

  }
  
  handleSubmit = event => {
    event.preventDefault();
    this.setState({loading:true})
    const { email, password } = this.state;
    const user = {
      email,
      password
    };

    signin(user)
      .then(data => {
        if (data.error) this.setState({ error: data.error,loading:false});

        else {
          authenticate(data, () => {
            this.setState({ redirectUser: true });
          });
        }
      })
  }
  render() {
    const { name, email, password, error, redirectUser, loading } = this.state;
    if (redirectUser) {
      return <Redirect to="/"/>
    }
    console.log(loading);
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 550 }}>
          <Form size="large">
            <Segment raised>
              <Header as="h2" icon color="blue" textAlign="center" color="blue">
                Signin
                <Icon name="sign-in" />
              </Header>
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
              <h5>Dont have a account? <Link to="/signup">Registration</Link></h5>
            </Segment>
            {
              error ? <Segment>
                <Header as='h5' color='red'>{error}</Header>
              </Segment> : (
                  <span></span>
                )
            }
          </Form>
          {
              loading ? 
              <Dimmer active>
                <Loader size='huge'>Loading</Loader>
              </Dimmer>:(
                <div></div>
              )
            }
        </Grid.Column>
      </Grid>
    );
  }
}
export default SignIn;