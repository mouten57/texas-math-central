import React, { Component } from "react";
import { NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";

export default function createNotification(type, error) {
  switch (type) {
    case "add_fav":
      NotificationManager.success("", "Added to favorites!", 1500);
      break;
    case "remove_fav":
      NotificationManager.warning("", "Removed from favorites", 1500);
      break;
    case "add_to_cart":
      NotificationManager.success("", "Added to Shopping Cart!", 1500);
      break;
    case "remove_from_cart":
      NotificationManager.success("", "Removed from Shopping Cart", 1500);
      break;
    case "purchase_success":
      NotificationManager.success(
        "Thank you for your purchase!",
        "Success!",
        2000
      );
      break;
    case "purchase_failure":
      NotificationManager.error("", error, 1500);
      break;

    case "success":
      NotificationManager.success("Success!", "", 1500);
      break;
    case "warning":
      NotificationManager.warning(
        "Warning message",
        "Close after 3000ms",
        3000
      );
      break;
    case "error":
      NotificationManager.error("Error message", "Click me!", 5000, () => {
        alert("callback");
      });
      break;
    default:
      break;
  }
}
