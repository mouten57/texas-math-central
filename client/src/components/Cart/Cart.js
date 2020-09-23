import React from "react";
import axios from "axios";

import { Link } from "react-router-dom";
import { createMedia } from "@artsy/fresnel";
import createNotification from "../Resources/Notification";
import NotLoggedIn from "../NotLoggedIn";
import {
  Grid,
  Image,
  Label,
  Container,
  Header,
  Button,
  Icon,
  Popup,
  Segment,
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

            <Grid columns={2} centered="true">
              {props.cart?.products?.map((product) => {
                var first_file = product.resource_id.files[0];
                if (product.resource_id) {
                  return (
                    <Grid.Column key={product._id}>
                      <Popup
                        trigger={
                          first_file?.mimetype?.includes("image") ? (
                            <Grid.Column>
                              <Label ribbon={true}>{product.name}</Label>
                              <Image
                                size="big"
                                bordered
                                // label={{
                                //   color: "black",
                                //   content: product.name,
                                //   icon: "hotel",
                                //   ribbon: true,
                                // }}
                                src={renderImage(first_file)}
                              />
                            </Grid.Column>
                          ) : first_file?.previewLink ? (
                            <Grid.Column style={{ height: "100%" }}>
                              <Label ribbon={true}>{product.name}</Label>
                              <iframe
                                style={{ width: "100%", height: "95%" }}
                                src={`https://docs.google.com/gview?url=${first_file?.previewLink}&embedded=true`}
                              />
                            </Grid.Column>
                          ) : (
                            <Image
                              size="big"
                              bordered
                              label={{
                                color: "black",
                                content: product.name,
                                icon: "hotel",
                                ribbon: true,
                              }}
                              src={img}
                            />
                          )
                        }
                        content={
                          <Button.Group>
                            <Button
                              color="grey"
                              content="View"
                              as="a"
                              href={`/units/${product.resource_id.unit}/${product.resource_id._id}`}
                            />
                            <Button
                              color="red"
                              as="a"
                              onClick={() =>
                                onRemoveItem(product.resource_id._id)
                              }
                            >
                              Remove
                            </Button>
                          </Button.Group>
                        }
                        on="click"
                        position="top left"
                      />
                    </Grid.Column>
                  );
                }
              })}
            </Grid>
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
