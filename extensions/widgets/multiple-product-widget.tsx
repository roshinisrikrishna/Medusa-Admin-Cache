import type { 
    WidgetConfig, 
    ProductDetailsWidgetProps,
  } from "@medusajs/admin";
  import { Product, ProductVariant } from "@medusajs/medusa";
  import Medusa from "@medusajs/medusa-js";
import React, { useState, useEffect } from 'react';
import { useProducts } from "medusa-react";

const ProductWidget = ({ product, notify }: ProductDetailsWidgetProps) => {
    // Fetch all products using useProducts hook
    const { products, isLoading } = useProducts();
    let handles: string[] = [];

    useEffect(() => {
      if (!isLoading && products) {
        // Extract and log handles of all products
        products.forEach(product => {
          // console.log(`Handle for product '${product.title}': ${product.handle}`);
        });
     
        // Generate handles and check if any handle exists in the products array
        const handles = generateHandles();
        console.log('handles', handles)
        console.log('products', products)
        const existingHandles = handles.filter(handle => products.some(product => product.handle === handle));
        console.log('Existing handles:', existingHandles);
      }
     }, [isLoading, products]);
     
  
    // Function to generate all possible handles
    const generateHandles = () => {
      const colorValues = getAllColorValues();
      for (const color of colorValues) {
        const handle = `${product.title.replace(/ /g, '-').toLowerCase()}-${color}`;
        handles.push(handle);
      }
      return handles; // Ensure that the function returns the handles array
     };
     
 
 // Call generateHandles when the component mounts
 useEffect(() => {
  generateHandles();
 }, []);
 
    
    // Function to find the option value for "Color" in each variant
    const getColorOptionValue = (variant: ProductVariant, colorOptionId: string | undefined) => {
      return variant.options.find(option => option.option_id === colorOptionId)?.value;
    };
  
    // Find the ID of the option titled "Color"
    const colorOptionId = product.options.find(option => option.title.toLowerCase() === "color")?.id;
  
    // Function to render product variants
    const renderVariants = () => {
      return product.variants.map((variant: ProductVariant, index: number) => {
        const colorValue = getColorOptionValue(variant, colorOptionId);
  
        // Log the variant, product details, and color option value
        // console.log(`Variant Details ${index + 1}:`, variant);
        // console.log(`Product Details for Variant ${index + 1}:`, product);
        // console.log(`Color Option Value for Variant ${index + 1}:`, colorValue);
  
        return (
          <div key={index}>
            
          </div>
        );
      });
    };
    // Function to collect all unique color values
  const getAllColorValues = () => {
    const colorValues = new Set();
    product.variants.forEach((variant) => {
      const colorValue = getColorOptionValue(variant, colorOptionId);
      if (colorValue) {
        colorValues.add(colorValue.toLowerCase());
      }
    });
    return Array.from(colorValues);
  };

  // Function to handle button click
  const createProductsForAllColors = async () => {
    const colorValues = getAllColorValues();
    for (const color of colorValues) {
      try {
        const response = await fetch('http://localhost:9000/store/multipleProducts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: product.id, color: color }),
        });
        const data = await response.json();
        console.log('Response for color', color, ':', data);
      } catch (error) {
        console.error('Error creating product for color', color, ':', error);
      }
    }
  };
  
    return (
        <div className="bg-white p-8 border border-gray-200 rounded-lg">
          <h1>{product.title}</h1>
          {renderVariants()}
          <button 
            className="bg-black rounded p-1 text-white"
            onClick={() => {
              createProductsForAllColors();
              notify.success("success", "Creating products for all colors");
            }}
          >
            Create Products for All Colors
          </button>
        </div>
      );
    };

  export const config: WidgetConfig = {
    zone: "product.details.after",
  }
  
  export default ProductWidget;
  