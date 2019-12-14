import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './userAuth/Signup';
import SignIn from './userAuth/SignIn';
import Navbar from './pages/Navbar';
import UserProfile from './userAuth/UserProfile';
import Users from './userAuth/Users';
import updateProfile from './userAuth/updateProfile';
import PrivateRoute from './components/PrivateRoute';
import FindUsers from './userAuth/FindUsers';
import NewPost from './post/NewPost';
import SinglePost from './post/SinglePost';
import UpdatePost from './post/UpdatePost';
const MainRouter = () => (
    <div> 
        <Navbar/>
        <Switch>
            <Route exact path="/" component={Home} />
            <PrivateRoute exact path="/post/create" component={NewPost} />
            <Route exact path="/post/:postId" component={SinglePost} />
            <PrivateRoute exact path="/post/edit/:postId" component={UpdatePost}/>
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/users" component={Users} />
            <PrivateRoute exact path="/user/:userId" component={UserProfile} />
            <PrivateRoute exact path="/user/edit/:userId" component={updateProfile}/>
            <PrivateRoute exact path="/findpeople" component={FindUsers} />
        </Switch>
    </div>
)
export default MainRouter;