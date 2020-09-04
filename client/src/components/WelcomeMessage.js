import React, { Component } from "react";
import { Message } from "semantic-ui-react";

class WelcomeMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      user: null,
    };
  }
  handleDismiss = () => {
    this.setState({ visible: false });
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ user: nextProps.user });
  }

  renderMessage() {
    if (!this.props.user || sessionStorage.getItem("userLogin")) {
      return null;
    } else {
      let content = `Welcome back, ${this.state.user.nickname}.`;
      sessionStorage.setItem("userLogin", Date.now());

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
    console.log(this.props);
    return <div>{this.state.visible ? this.renderMessage() : <p />}</div>;
  }
}

export default WelcomeMessage;
