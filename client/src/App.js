import React, { Component } from 'react';
import './css/global.css';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import config from './config';

import CourseDetail from './components/CourseDetail';
import Courses from './components/Courses';
import CreateCourse from './components/CreateCourse';
import Header from './components/Header';
import Forbidden from './components/Forbidden';
import NotFound from './components/NotFound';
import UnhandledError from './components/UnhandledError';
import UpdateCourse from './components/UpdateCourse';
import UserSignUp from './components/UserSignUp';
import UserSignIn from './components/UserSignIn';
import UserSignOut from './components/UserSignOut';

import { Provider } from './Context';
import PrivateRoute from './PrivateRoute';
import withContext from './Context';

const CourseDetailWithContext = withContext(CourseDetail);
const CreateCourseWithContext = withContext(CreateCourse);
const HeaderWithContext = withContext(Header);
const UpdateCourseWithContext = withContext(UpdateCourse);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);

export default class App extends Component {

  state = {
    baseURL: config.apiBaseURL,
  };

  render() {
    return (
      <Provider>
        <BrowserRouter>
          <div>
            <HeaderWithContext />
              <Switch>
                <Redirect exact from='/' to='/courses' />
                <Route exact path='/courses' render={ () => <Courses baseURL={this.state.baseURL} /> } />
                <PrivateRoute path='/courses/create' component={CreateCourseWithContext} baseURL={this.state.baseURL} />
                <PrivateRoute exact path='/courses/:id/update' component={UpdateCourseWithContext} />
                <Route path='/courses/:id' render= { props => <CourseDetailWithContext {...props} baseURL={this.state.baseURL} />} />
                <Route path='/signin' component={UserSignInWithContext} />
                <Route path='/signup' component={UserSignUpWithContext} />
                <Route path='/signout' component={UserSignOutWithContext} />
                <Route path='/error' component={UnhandledError} />
                <Route path='/forbidden' component={ Forbidden } />
                <Route component={ NotFound } />
              </Switch>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}
