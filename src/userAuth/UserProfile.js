import React from 'react';
import { Container, Header, Icon, Label, Grid, List, Image, Menu, Segment, Button } from 'semantic-ui-react'
import { isAuthenticated } from '../components';
import { Redirect, Link } from 'react-router-dom';
import { read } from '../userAuth/Userapi';
import {postByUser} from '../post/apiPost';
import DeleteUser from './DeleteUser';
import FollowBtnProfile from '../userAuth/FollowBtnProfile';
import UserProTabs from './UserProTabs';


class UserProfile extends React.Component {
    constructor() {
        super();
        this.state = {
            user:{ following:[], followers:[]},
            redirectToSignin: false,
            following:false,
            error:"",
            posts: []
        }
    }
    checkFollow = user => {
        const jwt = isAuthenticated();
        const match = user.followers.find(follower => {
          return follower._id === jwt.user._id;
        });
        return match
    };

    clickFollowButton = callApi => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
    
        callApi(userId, token, this.state.user._id).then(data => {
          if (data.error) {
            this.setState({ error: data.error });
          } else {
            this.setState({ user: data, following: !this.state.following });
          }
        });
    };
    init = userId => {
        const token = isAuthenticated().token;
        read(userId, token)
            .then(data => {
                if (data.error) {
                    return this.setState({ redirectToSignin: true });
                }
                else {
                    let following = this.checkFollow(data)
                    this.setState({ user:data,following});
                    this.loadPostByUser(data._id)
                }
            })
    }
    loadPostByUser = userId => {
        const token = isAuthenticated().token;
        postByUser(userId,token).then(data=>{
            if(data.error) console.log(data.error);
            else{
                this.setState({posts:data});
            }
        })
        
    }
    componentDidMount() {
        const userId = this.props.match.params.userId
        this.init(userId);
    }
    componentWillReceiveProps(props) {
        const userId = props.match.params.userId
        this.init(userId);
    }
    render() {
        const { redirectToSignin, user,following,followers,posts } = this.state;

        if (redirectToSignin) return <Redirect to="/signin" />
        const photoUrl = user._id
            ? `${
            process.env.REACT_APP_API_URL
            }/user/photo/${user._id}?${new Date().getTime()}`
            : <Image src={`https://react.semantic-ui.com/images/wireframe/image.png`} size='small' />;
        ;
        return (
            <Container style={{ marginTop: '85px' }}>
                <Header as='h1'>My Profile</Header>
                <Grid celled>
                    <Grid.Row>
                        <Grid.Column width={3}>
                        <Image onError={i => (i.target.src=`https://react.semantic-ui.com/images/wireframe/image.png`)} src={photoUrl} />

                        </Grid.Column>
                        <Grid.Column width={13}>
                            <Menu text vertical>
                                <List divided relaxed>
                                    <List.Item>
                                        <List.Icon name='user' size='large' verticalAlign='middle' />
                                        <List.Content>
                                            <List.Description as='a'>{user.name}</List.Description>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <List.Icon name='mail' size='large' verticalAlign='middle' />
                                        <List.Content>
                                            <List.Description as='a'>{user.email}</List.Description>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <List.Icon name='star' color="black" size='large' verticalAlign='middle' />
                                        <List.Content>
                                            <List.Description as='a'>{user.about}</List.Description>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <List.Icon name='clock' size='large' verticalAlign='middle' />
                                        <List.Content>
                                            <List.Description as='a'>{`Joined ${new Date(user.created).toDateString()}`}</List.Description>
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </Menu>
                            {
                            isAuthenticated().user && isAuthenticated().user._id == user._id ? (
                                <div className='ui two buttons'>
                                    <Menu text compact floated="right">
                                        <Menu.Item as='a'>
                                            <Link to={`/user/edit/${user._id}`}>
                                                <Button color='blue'>
                                                    Edit profile
                                                </Button>
                                            </Link>
                                            <DeleteUser userId={user._id}/>
                                    </Menu.Item>
                                    </Menu>
                                </div>
                            ) :(
                               <FollowBtnProfile 
                                following={this.state.following}
                                onButtonClick={this.clickFollowButton}
                                />
                            )}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <UserProTabs posts={posts} followers={user.followers} following={user.following}/>
            </Container>
        )
    }
}
export default UserProfile;
