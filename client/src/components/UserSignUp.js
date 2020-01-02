import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

export default class UserSignUp extends Component {

  state = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    confirmPassword: '',
    errors: '',
  }

  render() {
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword,
      errors,
    } = this.state;

    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign Up</h1>
          <Form
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Sign Up"
            elements={() => (
              <React.Fragment>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={this.change} />
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={this.change} />
                <input
                  id="emailAddress"
                  name="emailAddress"
                  type="text"
                  placeholder="Email Address"
                  value={emailAddress}
                  onChange={this.change} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={this.change} />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={this.change} />
              </React.Fragment>
            )} />
          <p>
            Already have a user account? <Link to="/signin">Click here</Link> to sign in!
          </p>
        </div>
      </div>
    );
  }

  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  submit = () => {
    const { context } = this.props;
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword
    } = this.state;

    // Create user
    const user = {
      firstName,
      lastName,
      emailAddress,
      password,
    };

    if(!firstName) {
      this.setState({
        errors: 'A first name is required'
      })
    } else if(!lastName) {
      this.setState({
        errors: 'A last name is required'
      })
    } else if(!emailAddress) {
      this.setState({
        errors: 'An email is required'
      })
    } else if(!password) {
      this.setState({
        errors: 'A password is required'
      })
    } else if (password !== confirmPassword) {
      this.setState({
        errors: 'Passwords must match.'
      })
    } else {

    context.data.createUser(user)
      .then( errors => {
        if (errors.length) {
          this.setState({ errors });
        } else {
          context.actions.signIn(emailAddress, password)
            .then(() => {
              this.props.history.push('/courses');
            }).catch((errors) => {
              this.props.history.push('/error');
            });
        }
      })
      .catch((errors) => {
        this.props.history.push('/error');
      });
    }
  }

  cancel = () => {
   this.props.history.push('/');
  }
}
