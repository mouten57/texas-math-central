import React from "react";
import { createMedia } from "@artsy/fresnel";
import { Grid, Image, Container, Header, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import img from "../images/sample_doc.png";
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
              {props.cart?.products.length} Items - $
              {props.cart?.products.length}
            </Header>
          </Grid.Column>
          <Grid.Column width={5}>
            <Button color="blue">Checkout</Button>
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
              {props.cart?.products.length} Items - $
              {props.cart?.products.length}
            </Header>
          </Grid.Column>
          <Grid.Column width={4}>
            <Button color="blue">Checkout</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Grid columns={2} centered="true">
        {props.cart?.products?.map((product) => {
          if (product.resource_id) {
            return (
              <Grid.Column key={product._id} centered={true}>
                <Image
                  fluid
                  size="big"
                  as="a"
                  href={`/units/${product.resource_id.unit}/${product.resource_id._id}`}
                  label={{
                    as: "a",

                    color: "black",
                    content: product.name,
                    icon: "hotel",
                    ribbon: true,
                  }}
                  style={{ margin: "0 auto" }}
                  src={
                    product.resource_id.files[0]?.mimetype?.includes("image")
                      ? product.resource_id.files[0].s3Link
                      : product.resource_id.files[0].previewLink
                      ? product.resource_id.files[0].previewLink
                      : img
                  }
                />
              </Grid.Column>
            );
          }
        })}
      </Grid>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return { auth: state.auth, cart: state.cart };
};
export default connect(mapStateToProps)(Cart);
