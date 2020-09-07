import React from "react";
import { Link } from "react-router-dom";
import { Container, Segment, Form, Button, Icon } from "semantic-ui-react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import CardSection from "./CardSection";
import createNotification from "../Resources/Notification";

const CheckoutForm = (props) => {
  console.log(props);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    const cardElement = elements.getElement(CardElement);

    //blur card when submitted
    cardElement.blur();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make  sure to disable form submission until Stripe.js has loaded.
      return;
    }
    let totals = props.cart;
    const response = await axios.post("/api/stripe", {
      amount: props.cart.products.length,
    });
    console.log(response.data);
    let clientSecret = response.data.client_secret;

    // Call stripe.confirmCardPayment() with the client secret.

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: "Jenny Rosen",
        },
      },
    });
    console.log(result);

    if (result.error) {
      createNotification("purchase_failure", result.error.message);
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === "succeeded") {
        //handle post-charge
        cardElement.clear();
        //success message
        createNotification("purchase_success");
        //do DB stuff - hit 'api/stripe/postcharge'
        //add purchased items to user
        //find and clear current user's cart
        //redirect to their profile when finished. should have "Purchased Items" populated
        setTimeout(() => {
          props.history.push({
            pathname: `/profile`,
          });
        }, 2000);

        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  };
  return (
    <Container>
      <Button labelPosition="arrow circle left" as={Link} to="/cart">
        <Icon name="arrow circle left" />
        Back to cart
      </Button>
      <Segment>Your total is: ${props?.cart?.products.length} </Segment>
      <Segment>
        <Form onSubmit={handleSubmit}>
          <CardSection />
          <Button
            style={{ marginTop: "10px" }}
            disabled={!stripe || !props.cart?.products}
          >
            Confirm order
          </Button>
        </Form>
      </Segment>
    </Container>
  );
};

export default CheckoutForm;
