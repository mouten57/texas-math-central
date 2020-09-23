import React from "react";
import axios from "axios";

import { Link } from "react-router-dom";
import { createMedia } from "@artsy/fresnel";
import createNotification from "../Resources/Notification";
import NotLoggedIn from "../NotLoggedIn";
// import PopupContent from "./PopupContent";
import {
  Grid,
  Image,
  Container,
  Header,
  Button,
  Icon,
  Popup,
  Table,
} from "semantic-ui-react";
import { connect } from "react-redux";
import img from "../../images/no-image-available.jpg";

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
const { Media } = AppMedia;
const Cart = (props) => {
  const onRemoveItem = async (id) => {
    let result = await axios.post(`/api/cart/${id}/remove`);
    createNotification("remove_from_cart");
    props.fetchCart();
  };

  const renderImage = (first_file) => {
    if (
      first_file &&
      first_file.mimetype?.includes("image") &&
      first_file.s3Link
    ) {
      return first_file.s3Link;
    } else if (
      first_file?.previewLink &&
      first_file.mimetype?.includes("image")
    ) {
      return first_file?.previewLink;
    } else {
      return img;
    }
  };
  const renderForm = () => {
    const prods = props.cart?.products;
    const number_of_goods = prods ? prods.length : 0;

    switch (props.auth) {
      case null:
        return null;
      case false:
        return <NotLoggedIn />;
        break;
      default:
        return (
          <Container style={{ marginBottom: "40px" }}>
            <style>{mediaStyles}</style>
            <Grid columns={12} centered as={Media} at="mobile">
              <Grid.Row>
                <Grid.Column width={7}>
                  <Header textAlign="center" style={{ marginBottom: "0" }}>
                    Shopping Cart
                  </Header>
                  <Header as="h4" textAlign="center" style={{ marginTop: "0" }}>
                    {number_of_goods} Items - ${number_of_goods}
                  </Header>
                </Grid.Column>
                <Grid.Column width={5}>
                  <Button
                    labelPosition="arrow circle right"
                    as={Link}
                    to="/checkout"
                    disabled={!props.cart?.products?.length > 0}
                  >
                    Checkout
                    <Icon
                      name="arrow circle right"
                      style={{ marginRight: "5px" }}
                    />
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Grid columns={16} centered as={Media} greaterThanOrEqual="tablet">
              <Grid.Row>
                <Grid.Column
                  width={8}
                  floated="right"
                  style={{ textAlign: "center" }}
                >
                  <Header>Shopping Cart</Header>
                  <Header as="h4" style={{ marginTop: "0" }}>
                    {number_of_goods} Items - ${number_of_goods}
                  </Header>
                </Grid.Column>
                <Grid.Column width={4}>
                  <Button
                    labelPosition="arrow circle right"
                    as={Link}
                    to="/checkout"
                    disabled={!number_of_goods > 0}
                  >
                    Checkout
                    <Icon
                      name="arrow circle right"
                      style={{ marginRight: "5px" }}
                    />
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>

            <Table striped selectable unstackable compact size="small">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Grade</Table.HeaderCell>
                  <Table.HeaderCell>Subject</Table.HeaderCell>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                  <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {props.cart?.products?.map((product) => {
                  const { name, grade, subject, description, unit, _id } =
                    product.resource_id || false;
                  return (
                    <Table.Row key={product._id}>
                      <Table.Cell>{name}</Table.Cell>
                      <Table.Cell>{grade}</Table.Cell>
                      <Table.Cell>{subject}</Table.Cell>
                      <Table.Cell>{description}</Table.Cell>
                      <Table.Cell>
                        <Button.Group basic size="mini" compact floated="right">
                          <Button icon as="a" href={`/units/${unit}/${_id}`}>
                            <Icon name="eye" color="blue"></Icon>
                          </Button>
                          <Button icon onClick={() => onRemoveItem(_id)}>
                            <Icon name="delete" color="red"></Icon>
                          </Button>
                        </Button.Group>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </Container>
        );
    }
  };

  return renderForm();
};

const mapStateToProps = (state) => {
  return { auth: state.auth, cart: state.cart };
};
export default connect(mapStateToProps)(Cart);
