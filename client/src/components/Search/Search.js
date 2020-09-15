import PropTypes from "prop-types";
import _ from "lodash";
import { Link } from "react-router-dom";
import faker from "faker";
import React, { Component } from "react";
import { Search, Grid, Header, Segment, Label } from "semantic-ui-react";

const resultRenderer = ({ name, subject, _id, unit }) => {
  return (
    <Link to={`/units/${unit}/${_id}`}>
      <div>{name}</div>
    </Link>
  );
};

resultRenderer.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
};

const initialState = { isLoading: false, results: [], value: "" };

const source = _.times(5, () => ({
  title: faker.company.companyName(),
  description: faker.company.catchPhrase(),
  image: faker.internet.avatar(),
  price: faker.finance.amount(0, 100, 2, "$"),
}));

export default class SearchExample extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleResultSelect = (e, { result }) => {
    this.setState({ value: result.name });
  };

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(initialState);

      const re = new RegExp(_.escapeRegExp(this.state.value), "i");
      const isMatch = (result) => re.test(result.name);
      const filtered_resources = this.props.resources.filter(
        (resource) => resource?.subject?.toLowerCase() == this.props.subject
      );
      console.log(filtered_resources);
      this.setState({
        isLoading: false,
        results: _.filter(filtered_resources, isMatch),
      });
    }, 300);
  };

  render() {
    console.log(this.props);
    const { isLoading, value, results } = this.state;

    return (
      <Search
        style={{
          width: "50%",
          marginLeft: "15px",

          display: "inline-block",
        }}
        loading={isLoading}
        onResultSelect={this.handleResultSelect}
        onSearchChange={_.debounce(this.handleSearchChange, 500, {
          leading: true,
        })}
        resultRenderer={resultRenderer}
        results={results}
        value={value}
      />
    );
  }
}
