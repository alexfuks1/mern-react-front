import React from 'react';
import { Button, Icon } from 'semantic-ui-react'
import { follow,unfollow } from './Userapi';


class FollowBtnProfile extends React.Component {
    followClick = () => {
        this.props.onButtonClick(follow);
    }
    unFollowClick = () => {
        this.props.onButtonClick(unfollow);
    }
    render() {
        return (
            <div>
                {
                    !this.props.following ? 
                    (
                        <Button onClick={this.followClick} basic primary><Icon name='check' />Follow</Button>
                    ):(
                        <Button onClick={this.unFollowClick} color="red"><Icon name='remove' /> UnFollow</Button>
                    )
                }

            </div>
        )
    }
}
export default FollowBtnProfile;