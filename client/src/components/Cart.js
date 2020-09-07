import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { createMedia } from "@artsy/fresnel";
import createNotification from "./Resources/Notification";
import NotLoggedIn from "./NotLoggedIn";
import {
  Grid,
  Image,
  Container,
  Header,
  Button,
  Icon,
  Popup,
  Segment,
} from "semantic-ui-react";
import { connect } from "react-redux";
import img from "../images/no-image-available.jpg";

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
  console.log(props);
  const onRemoveItem = async (id) => {
    let result = await axios.post(`/api/cart/${id}/remove`);
    createNotification("remove_from_cart");
    props.fetchCart();
  };

  const renderImage = (product) => {
    if (
      product.resource_id.files[0] &&
      product.resource_id.files[0].mimetype?.includes("image") &&
      product.resource_id.files[0].s3Link
    ) {
      return product.resource_id.files[0].s3Link;
    } else if (product.resource_id.files[0]?.previewLink) {
      return product.resource_id.files[0]?.previewLink;
    } else {
      return img;
    }
  };
  const renderForm = () => {
    switch (props.auth) {
      case null:
        return null;
      case false:
        return <NotLoggedIn />;
        break;
      default:
        return (
          <Container>
            <style>{mediaStyles}</style>
            <Grid columns={12} centered as={Media} at="mobile">
              <Grid.Row>
                <Grid.Column width={7}>
                  <Header textAlign="center" style={{ marginBottom: "0" }}>
                    Shopping Cart
                  </Header>
                  <Header as="h4" textAlign="center" style={{ marginTop: "0" }}>
                    {props.cart?.products?.length} Items - $
                    {props.cart?.products?.length}
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
                    {props.cart?.products?.length} Items - $
                    {props.cart?.products?.length}
                  </Header>
                </Grid.Column>
                <Grid.Column width={4}>
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

            <Grid columns={2} centered="true">
              {props.cart?.products?.map((product) => {
                if (product.resource_id) {
                  return (
                    <Grid.Column key={product._id}>
                      <Popup
                        trigger={
                          <Image
                            size="big"
                            bordered
                            label={{
                              color: "black",
                              content: product.name,
                              icon: "hotel",
                              ribbon: true,
                            }}
                            src={renderImage(product)}
                          />
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
