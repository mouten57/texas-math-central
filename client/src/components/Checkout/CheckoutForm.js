import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Segment,
  Form,
  Button,
  Icon,
  Modal,
  Loader,
  Header,
} from "semantic-ui-react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import CardSection from "./CardSection";
import createNotification from "../Resources/Notification";
import NotLoggedIn from "../NotLoggedIn";

const CheckoutForm = (props) => {
  const [open, setOpen] = React.useState(false);

  if (props.history?.location?.state?.fromAllAccess == true) {
    var amount = 40,
      allAccess = true,
      backPath = "/upgrade";
  } else {
    var amount = props.cart?.products?.length,
      allAccess = false,
      products = props.cart?.products,
      resourceIDs = products?.map((p) => p.resource_id._id),
      backPath = "/cart";
  }

  console.log(products, resourceIDs);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    //show modal
    setOpen(true);
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
      amount,
    });
    console.log(response.data);
    let clientSecret = response.data.client_secret;

    // Call stripe.confirmCardPayment() with the client secret.

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: props.auth.name,
        },
      },
    });

    if (result.error) {
      setOpen(false);
      createNotification("purchase_failure", result.error.message);
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === "succeeded") {
        //handle post-charge
        cardElement.clear();
        //close modal
        setOpen(false);
        //success message
        createNotification("purchase_success");
        //do DB stuff - hit 'api/stripe/postcharge'
        await axios.post("/api/stripe/postcharge", {
          resourceIDs,
          allAccess,
        });
        //add purchased items to user
        //find and clear current user's cart
        props.fetchCart();
        props.fetchUser();
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
            <Button labelPosition="arrow circle left" as={Link} to={backPath}>
              <Icon name="arrow circle left" />
              Back
            </Button>
            <Segment>
              <Header>Your total is: ${amount}</Header>{" "}
            </Segment>

            <Segment>
              <Form onSubmit={handleSubmit}>
                <CardSection />
                <Button
                  style={{ marginTop: "10px" }}
                  disabled={!stripe || !props.cart?.products}
                >
                  Confirm order
                </Button>
                <Modal
                  basic
                  onClose={() => setOpen(false)}
                  onOpen={() => setOpen(true)}
                  open={open}
                  size="small"
                >
                  <Header icon>
                    <Icon name="world" />
                    Processing...
                  </Header>
                </Modal>
              </Form>
            </Segment>
          </Container>
        );
    }
  };
  return renderForm();
};

export default CheckoutForm;
