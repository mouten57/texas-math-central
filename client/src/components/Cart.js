import React, { useState, useEffect } from "react";
import { Grid, Image } from "semantic-ui-react";
import axios from "axios";
import { connect } from "react-redux";

const Cart = (props) => {
  return (
    <Grid columns={2} centered={true}>
      {props.cart?.products?.map((product) => {
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
              src={product.resource_id.files[0].s3Link}
            />
          </Grid.Column>
        );
      })}
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return { auth: state.auth, cart: state.cart };
};
export default connect(mapStateToProps)(Cart);
