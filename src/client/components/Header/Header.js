import React, { Component } from 'react';
import PropTypes from 'prop-types';

import logo from './Logo.svg';
import './Header.scss';

class Header extends Component {
  render() {
    const { visitorName = '' } = this.props;

    return (
      <div className="app">
        <header className="app-header">
          <img src={logo} className="app-logo" alt="logo" />
          <h1 id="id-message">{visitorName ? `Welcome to DNA, ${visitorName}!` : 'Welcome to DNA!'}</h1>
        </header>
      </div>
    );
  }
}

export default Header;

Header.propTypes = {
  visitorName: PropTypes.string.isRequired,
};
