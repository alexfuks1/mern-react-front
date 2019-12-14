import React from 'react';
import { Grid, Loader, Image, Segment, Button } from 'semantic-ui-react'

import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../components/index';
import { removeUser } from './Userapi';
import { signOut } from '../components/index';

class DeleteUser extends React.Component {
    state = {
        deleteRedirect: false
    }
    deleteUserAcc = () => {
        const token = isAuthenticated().token;
        const userId = this.props.userId;
        removeUser(userId, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                }
                else {
                    signOut(() => console.log("User Deleted!"));
                    this.setState({ deleteRedirect: true });
                }
            })
    }
    deleteUser = () => {
        let deleteAnswer = (window.confirm("Are you sure you want to delete your account?"));
        if (deleteAnswer) {
            this.deleteUserAcc();
        }
    }
    render() {
        if (this.state.deleteRedirect) {
            return <Redirect to="/signup" />
        }
        return (
            <div>
                <Button color='red' onClick={this.deleteUser} content="Delete Profile"/>
            </div>
        )
    }
}
export default DeleteUser;