import React, { Component } from "react";
import { Message, Icon } from "semantic-ui-react";

class WelcomeMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
  }
  handleDismiss = () => {
    this.setState({ visible: false });
    sessionStorage.setItem(
      "userLogin",
      `${this.props?.user?.email}-${Date.now()}`
    );
  };

  renderMessage() {
    let { nickname, firstname } = this.props.user;
    let already_seen = sessionStorage.getItem("userLogin");
    //console.log(already_seen);

    if (!this.props.user || already_seen?.includes(this.props.user?.email)) {
      return null;
    } else {
      let content = `Welcome back, ${nickname || firstname}.`;
      setTimeout(() => this.setState({ visible: false }), 3000);
      return (
        <Message onDismiss={this.handleDismiss} icon>
          {/* <Icon name="circle notched" loading /> */}
          <Message.Content>
            <Message.Header>"Hello again!"</Message.Header>
            {content}
          </Message.Content>
        </Message>
      );
    }
  }

  render() {
    console.log("STATE IS:", this.state, "PROPS ARE:", this.props);
    return (
      <div>
        {this.state.visible && this.props.user ? this.renderMessage() : null}
      </div>
    );
  }
}

export default WelcomeMessage;
