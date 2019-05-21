import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './App.scss';

export default class App extends Component {
  changeName = (evt) => {
    const { updateName } = this.props;

    updateName(evt.target.value);
  };

  render() {
    const { visitorName } = this.props;

    return (
      <div className="name-input">
        <span>Enter your name to change the greeting</span>
        <input onChange={this.changeName} value={visitorName} id="visitor-name" />
      </div>
    );
  }
}

App.propTypes = {
  updateName: PropTypes.func.isRequired,
  visitorName: PropTypes.string.isRequired,
};
