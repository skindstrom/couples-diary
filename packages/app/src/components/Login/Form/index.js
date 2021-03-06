import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class LoginForm extends PureComponent {
  onSubmit = event => {
    event.preventDefault();
    this.props.onSubmit();
  };

  render() {
    return <form onSubmit={this.onSubmit}>{this.props.children}</form>;
  }
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.array,
};
