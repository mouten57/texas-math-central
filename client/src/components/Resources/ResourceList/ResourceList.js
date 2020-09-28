//ResourceList lists out all the resources from mongo
//  /units/:name/
// this is inside resource index
import { connect } from "react-redux";
import React, { Component } from "react";
import _ from "lodash";
import {
  Table,
  Icon,
  Confirm,
  Popup,
  Grid,
  Input,
  Button,
  Form,
} from "semantic-ui-react";
import axios from "axios";
import { Link } from "react-router-dom";
import unitFields from "../data/unitFields.js";
import "./ResourceList.css";
import { createMedia } from "@artsy/fresnel";
import IconForResourceList from "./IconForResourceList";
import getVoteTotal from "../getVoteTotal";
import MobileView from "./Views/Mobile";
import TabletOrHigherView from "./Views/TabletOrHigher";

const AppMedia = createMedia({
  breakpoints: {
    mobile: 320,
    tablet: 768,
    computer: 992,
    largeScreen: 1200,
    widescreen: 1920,
  },
});
const mediaStyles = AppMedia.createMediaStyle();
const { Media, MediaContextProvider } = AppMedia;

class ResourceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      column: "voteTotal",
      unit: props.unit,
      data: _.sortBy(props.resources, ["voteTotal"]).reverse(),
      direction: "descending",
      resourceToDelete: null,
      nameSearchVal: "",
      typeSearchVal: [],
      gradeSearchVal: [],
      namePopupOpen: false,
      typePopupOpen: false,
      gradePopupOpen: false,
    };
  }

  // componentWillReceiveProps(nextProps) {
  //   //console.log(nextProps.resources);
  //   this.setState({
  //     data: nextProps.resources,
  //     column: "voteTotal",
  //     data: _.sortBy(nextProps.resources, ["voteTotal"]).reverse(),
  //     direction: "descending",
  //   });
  // }
  show = (resource) =>
    this.setState({ open: true, resourceToDelete: resource });

  handleConfirm = () => {
    var resourceId = this.state.resourceToDelete;
    let updated_resources = this.state.data.filter(function (el) {
      return el._id !== resourceId;
    });
    this.setState({ data: updated_resources, open: false });
    this.props.onDeleteResource(this.state.resourceToDelete, (err, result) => {
      if (err) throw err;
      //are we doing this (using un-used callback) to make sure fetchCart gets called after resource is removed? I think so
      this.props.fetchCart();
    });
  };
  handleCancel = () => this.setState({ result: "cancelled", open: false });

  match(resource) {
    //need to add subject
    let sub = resource.subject.toLowerCase();
    for (let i = 0; i < unitFields[sub].length; i++) {
      if (resource.unit === unitFields[sub][i].param) {
        return unitFields[sub][i].param;
      }
    }
  }
  handleSort = (clickedColumn) => () => {
    const { column, data, direction } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data, [clickedColumn]).reverse(),
        direction: "descending",
      });
      return;
    }

    this.setState({
      data: data.reverse(),
      direction: direction === "ascending" ? "descending" : "ascending",
    });
  };

  handlePopup = (popuptype, val) => {
    this.setState({ [popuptype]: val == "open" });
    if (val == "close") {
      this.getFilteredResults();
    }
  };

  getFilteredResults = () => {
    axios
      .get(`/api/units/${this.state.unit}`, {
        params: {
          name: this.state.nameSearchVal.toLowerCase(),
          type: this.state.typeSearchVal.map((v) => v.toLowerCase()).join("|"),
          grade: this.state.gradeSearchVal
            .map((v) => v.toLowerCase())
            .join("|"),
        },
      })
      .then((res) => {
        let data = res.data;
        data = getVoteTotal(res.data);
        this.setState({
          data: _.sortBy(data, ["voteTotal"]).reverse(),
          column: "voteTotal",
          direction: "descending",
        });
      })
      .catch((err) => console.log(err));
  };

  onChange = (e, data) => {
    console.log(data.name);
    //if val is coming from semantic dropdown, do this
    if (data.name == "gradeSearchVal" || data.name == "typeSearchVal") {
      this.setState({ [data.name]: data.value });
      //otherwise, do this
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  clearSearch = (searchValToClear) => {
    this.setState({
      namePopupOpen: false,
      [searchValToClear]:
        searchValToClear.includes("grade") || searchValToClear.includes("type")
          ? []
          : "",
      //resources on resourceIndex will keep main running list of unfiltered resources
    });
    this.getFilteredResults();
  };

  render() {
    const {
      data,
      open,
      column,
      nameSearchVal,
      typeSearchVal,
      direction,
      namePopupOpen,
      typePopupOpen,
      gradeSearchVal,
      gradePopupOpen,
    } = this.state;
    console.log(this.state);
    return (
      <>
        <style>{mediaStyles}</style>
        <MediaContextProvider>
          {/* RENDER FOR MOBILE */}
          <MobileView
            Media={Media}
            handleSort={this.handleSort}
            match={this.match}
            data={data}
            show={this.show}
            direction={direction}
            column={column}
            open={open}
            auth={this.props.auth}
            handleConfirm={this.handleConfirm}
            handleCancel={this.handleCancel}
          />

          {/* RENDER FOR TABLET OR GREATER */}
          <TabletOrHigherView
            Media={Media}
            handleSort={this.handleSort}
            match={this.match}
            data={data}
            show={this.show}
            direction={direction}
            column={column}
            open={open}
            auth={this.props.auth}
            handleConfirm={this.handleConfirm}
            handleCancel={this.handleCancel}
            handlePopup={this.handlePopup}
            onChange={this.onChange}
            namePopupOpen={namePopupOpen}
            nameSearchVal={nameSearchVal}
            typePopupOpen={typePopupOpen}
            typeSearchVal={typeSearchVal}
            clearSearch={this.clearSearch}
            gradeSearchVal={gradeSearchVal}
            gradePopupOpen={gradePopupOpen}
          />
        </MediaContextProvider>
      </>
    );
  }
}
function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(mapStateToProps)(ResourceList);
