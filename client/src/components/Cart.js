import React from "react";
import { Grid, Image, Container, Header, Button } from "semantic-ui-react";

import { connect } from "react-redux";
import img from "../images/sample_doc.png";

const Cart = (props) => {
  return (
    <Container>
      <Grid columns={16} centered>
        <Grid.Row>
          <Grid.Column width={12}>
            <Header textAlign="center" style={{ marginBottom: "0" }}>
              Shopping Cart
            </Header>
            <Header as="h4" textAlign="center" style={{ marginTop: "0" }}>
              {props.cart?.products.length} Items - $
              {props.cart?.products.length}
            </Header>
          </Grid.Column>
          <Grid.Column width={2}>
            <Button.Group>
              <Button color="blue">Checkout</Button>
            </Button.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Grid columns={2} centered="true">
        {props.cart?.products?.map((product) => {
          if (product.resource_id) {
            console.log(product.resource_id.files[0]);
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
                    product.resource_id.files[0]
                      ? product.resource_id.files[0].s3Link
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
