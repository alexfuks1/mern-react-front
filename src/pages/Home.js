import React from 'react';
import { Container, Header, Segment } from 'semantic-ui-react'
import Posts from '../post/Posts';
import CreatePost from '../post/CreatePost';
const Home = () => (
  <div>
    <Container style={{ marginTop: '85px' }}>
    <CreatePost/>
      <Segment>
        <Posts/>
        </Segment>
    </Container>
  </div>
)
export default Home;