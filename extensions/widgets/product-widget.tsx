// Import necessary hooks and libraries from React, Axios, and Material UI
import React, { useState } from "react";
import axios from "axios";
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { Button } from "@medusajs/ui"
import type { WidgetConfig, ProductDetailsWidgetProps } from "@medusajs/admin";

// Define the ProductWidget component
const ProductWidget = ({
  product,
  notify,
}: ProductDetailsWidgetProps) => {
  // State for managing input field visibility
  const [showInputFields, setShowInputFields] = useState(false);
  // State for managing the 'X' value
  const [xValue, setXValue] = useState("");
  // State for managing the 'Y' value
  const [yValue, setYValue] = useState("");

  // Handler for toggling input fields
  const handleSwitchClick = () => {
    setShowInputFields(!showInputFields);
  };

  // console.log("product widhget ",product)
  // Handler for the update button click
  const handleUpdateClick = () => {
    // console.log("product id ", product.id);
    if (xValue && yValue) {
      // Making Axios POST requests to update the product's buy_get_offer and buy_get_number
      axios
      .post("http://localhost:9000/store/updateBuyNumber", {
        id: product.id,
        buy_get_number: xValue,
      })
      .then((response) => {
        notify.success("Success", "Buy Get Number updated!");
      })
      .catch((error) => {
        notify.error("Error", "Failed to update Buy Get Number.");
      });
      axios
        .post("http://localhost:9000/store/updateBuyOffer", {
          id: product.id,
          buy_get_offer: yValue,
        })
        .then((response) => {
          notify.success("Success", "Buy Get Offer updated!");
        })
        .catch((error) => {
          notify.error("Error", "Failed to update Buy Get Offer.");
        });

     
    } else {
      notify.error("Error", "Please enter X and Y values.");
    }
  };

  // Render the component
  return (
    <div className="bg-white p-8 border border-gray-200 rounded-lg">
      <div className="flex justify-between items-center">
        <h1 style={{fontWeight: 600}}>Enable Buy X Get Y Offer for {product.title}</h1>
        <div className="flex items-center">
          <Switch
            checked={showInputFields}
            onChange={handleSwitchClick}
          />
        </div>
      </div>

      {showInputFields && (
        <div>
          <div className="mb-2" style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
            {/* Input fields for X and Y values */}
            <TextField
              label="Enter X value"
              type="text"
              value={xValue}
              onChange={(e) => setXValue(e.target.value)}
              variant="outlined"
              margin="normal"
              style={{paddingRight:"15%"}}
            />
            <TextField
              label="Enter Y value"
              type="text"
              value={yValue}
              onChange={(e) => setYValue(e.target.value)}
              variant="outlined"
              margin="normal"
            />
          </div>
          <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
            {/* Update button */}
            <Button onClick={handleUpdateClick}>
              Update
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Configuration for the widget
export const config: WidgetConfig = {
  zone: "product.details.before",
};

// Export the ProductWidget component
export default ProductWidget;
