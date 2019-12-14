import React from 'react';
import { Container, Header, Grid, Image, Card, Button, Segment, Icon,Search } from 'semantic-ui-react';
import { usersList } from './Userapi';
import { Link } from 'react-router-dom';

class Users extends React.Component {
    constructor() {
        super();
        this.state = {
            users: []
        }
    }
    componentDidMount() {
        usersList().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ users: data });
            }
        })
            .catch(err => console.log(err));
    }
    render() {
        const { users } = this.state;
        return (
            <Container style={{ margin: '85px 25px' }} floated="right">
                <Header as="h2">Users</Header>
                <br />
                <Card.Group itemsPerRow={4}>
                    {users.map((user, i) => (
                        <Card key={i} floated="left">
                            <Image src={`${
                                process.env.REACT_APP_API_URL
                                }/user/photo/${user._id}`} alt={user.name}
                                onError={i => (i.target.src = `https://react.semantic-ui.com/images/wireframe/image.png`)}
                            />
                            <Card.Content>
                                <Card.Header>{user.name}</Card.Header>
                                <Card.Meta>
                                    <span className='date'>{user.email}</span>
                                </Card.Meta>
                            </Card.Content>
                            <Card.Content extra>
                                <a>
                                    <Icon name='user' />
                                    22 Friends
                                </a>
                            </Card.Content>
                            <Button basic color='blue'>
                                <Link to={`/user/${user._id}`}>VIEW PROFILE</Link>
                            </Button>
                        </Card>
                    ))}
                </Card.Group>

            </Container>
        )
    }
}
export default Users;

