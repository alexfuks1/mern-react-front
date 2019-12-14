import React from 'react';
import {
  Container,
  Menu,
  Icon,
  Image,
  Search
} from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom';
import { signOut, isAuthenticated } from '../components/index';

const Navbar = ({ history }) => (
  <Menu size='huge' inverted color={'blue'} fixed="top">
    <Container>
      {!isAuthenticated() && (
        <>
          <Menu.Item>
            <Link to="/signin">SIGNIN</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/signup">SIGNUP</Link>
          </Menu.Item>
        </>
      )}
      {isAuthenticated() && (
        <>
          <Menu.Item>
            <Link to="/">HOME</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/users">USERS</Link>
          </Menu.Item>

          <Menu.Item>
            <Link onClick={() => signOut(() => history.push("/signin"))} to="/signin">SIGNOUT</Link>
          </Menu.Item>
          <Menu.Menu position='right'>
            <Menu.Item>
              <Link to={`/user/${isAuthenticated().user._id}`}>
                <Icon name="user" />
                {`${isAuthenticated().user.name} 's Profile`}
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link to={`/findpeople`}>
                <Icon name="search" />
                FIND USERS
              </Link>
            </Menu.Item>
          </Menu.Menu>
        </>
      )}
    </Container>
  </Menu>
)
export default withRouter(Navbar);
