import React from 'react';
import { Container, Header, Grid, Image, Card, Button, Segment, Icon,Message } from 'semantic-ui-react';
import { findUser,follow } from './Userapi';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../components/index';

class FindUsers extends React.Component {
    constructor() {
        super();
        this.state = {
            users: [],
            error:"",
            open:false
        }
    }
    componentDidMount() {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        findUser(userId,token)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ users: data });
            }
        })
            .catch(err => console.log(err));
    }
    followClick=(user,i)=>{
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        follow(userId, token, user._id).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                let toFollow = this.state.users;
                toFollow.splice(i, 1);
                this.setState({
                    users: toFollow,
                    open: true,
                    followMessage: `Following ${user.name}`
                });
            }
        });

    }
    displayUsers = users =>(
        <Container style={{ margin: '85px 25px' }} floated="right">
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
                            <Button onClick={()=> this.followClick(user,i)} basic primary><Icon name='check' />Follow</Button>
                            </Card.Content>
                            <Button basic color='blue'>
                                <Link to={`/user/${user._id}`}>VIEW PROFILE</Link>
                            </Button>
                        </Card>
                    ))}
                </Card.Group>
        </Container>
    )
    render() {
        const { users,open,followMessage } = this.state;
        return (
            <Container style={{ margin: '85px 25px' }} floated="right">
                <Header as="h2">Find Users</Header>
                    <div>{open && (<Message floating>{followMessage}</Message>)}</div>
                    {this.displayUsers(users)}
            </Container>
        )
    }
}
export default FindUsers;

