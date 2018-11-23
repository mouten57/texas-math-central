import React, { Component } from 'react';
import { Message } from 'semantic-ui-react';

class WelcomeMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      user: null
    };
  }
  handleDismiss = () => {
    this.setState({ visible: false });
  };
  componentWillReceiveProps(nextProps) {
    this.setState({ user: nextProps.user });
  }

  renderMessage() {
    if (!this.state.user) {
      return null;
    } else {
      let content = `Welcome back, ${this.state.user.nickname}.`;
      return (
        <Message
          onDismiss={this.handleDismiss}
          header="Hello again!"
          content={content}
        />
      );
    }
  }

  render() {
    return <div>{this.state.visible ? this.renderMessage() : <p />}</div>;
  }
}

export default WelcomeMessage;
