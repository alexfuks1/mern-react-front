import React from 'react';
import { Tab, Button, List, Image, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import DefaultImg from '../components/DefaultImg';
class UserProTabs extends React.Component {
    constructor() {
        super();
        this.state = {
            errorFollowing: "This user without following"
        }
    }

    render() {
        const { following, followers, errorFollowing,posts } = this.props;
        const panes = [
            {
                menuItem: 'Followers',
                render: () => <Tab.Pane attached={false}>{followers.map((person, i) =>
                    (
                        <Link to={`/user/${person._id}`} key={i}>
                            <List animated selection verticalAlign='middle'>
                                <List.Item>
                                    <List.Content floated='right'>
                                        <Button color="blue">Add</Button>
                                    </List.Content>
                                    <Image avatar size="mini" src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                                         />
                                    <List.Content>{person.name}</List.Content>
                                </List.Item>
                            </List>
                        </Link>
                    )
                )}</Tab.Pane>,
            },
            {
                menuItem: 'Following',
                render: () => <Tab.Pane attached={false}>{following.map((person, i) =>
                    (
                        <Link to={`/user/${person._id}`} key={i}>
                            <List selection verticalAlign='middle'>
                                <List.Item>
                                    <List.Content floated='right'>
                                        <Button color="blue">Add</Button>
                                    </List.Content>
                                    <Image avatar size="mini" src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}/>
                                    <List.Content>{person.name}</List.Content>
                                </List.Item>
                            </List>
                        </Link>
                    )
                )}</Tab.Pane>,
            },
            {
                menuItem: 'Posts',
                render: () => <Tab.Pane attached={false}>{posts.map((post, i) =>
                    (
                        <Link to={`/post/${post._id}`} key={i}>
                        <List animated selection verticalAlign='middle'>
                            <List.Item>
                                <List.Content floated='right'>
                                    <Button color="blue">Show post</Button>
                                </List.Content>
                                <Header as="h5">{post.title}</Header>
                            </List.Item>
                        </List>
                    </Link>
                    )
                )}</Tab.Pane>,
            }
        ]
        return (
            <div className="ale">
                <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
            </div>
        )
    }
}
export default UserProTabs;