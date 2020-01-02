import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Data from './Data';

const Context = React.createContext();

export class Provider extends Component {

  state = {
    authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
    authenticatedUserPassword: Cookies.getJSON('userPassword') || null
  };

  constructor() {
    super();
    this.data = new Data();
  }

  signIn = async (emailAddress, password) => {
    const user = await this.data.getUser(emailAddress, password);
    if (user !== null) {
      this.setState(() => {
        return {
          authenticatedUser: user,
          authenticatedUserPassword: password
        };
      });
      Cookies.set('authenticatedUser', JSON.stringify(user), {expires: 1});
      Cookies.set('userPassword', JSON.stringify(password), {expires: 1});
    }
    return user;
  }

  signOut = () => {
    this.setState({
      authenticatedUser: null,
      authenticatedUserPassword: null
    });
    Cookies.remove('authenticatedUser');
    Cookies.remove('authenticatedUserPassword');
  }

  render() {
    const { authenticatedUser, authenticatedUserPassword } = this.state;
    const value = {
      authenticatedUser,
      authenticatedUserPassword,
      data: this.data,
      actions: {
        signIn: this.signIn,
        signOut: this.signOut
      },
    };
    return (
      <Context.Provider value={value}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }
}
