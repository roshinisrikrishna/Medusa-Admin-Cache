// import type { 
//   WidgetConfig, 
//   ProductDetailsWidgetProps,
// } from "@medusajs/admin";
// import React, { useState, useEffect } from "react"; // Import useState and useEffect

// import { Product, ProductVariant } from "@medusajs/medusa";
// import axios from 'axios'
// import Medusa from "@medusajs/medusa-js"
// const medusa = new Medusa({ baseUrl: "http://localhost:9000", maxRetries: 3 })

// const ProductWidget = ({
//   product,
//   notify,
// }: ProductDetailsWidgetProps) => {

//   const [multiple_product, setMultipleProduct] = useState(false);
//   const [colorValues, setColorValues] = useState<string[]>([]); // Define colorValues as state

//   // useEffect(() => {
//   //   medusa.products.retrieve(product.id).then(({ product }) => {
//   //     console.log(product);
//   //     setMultipleProduct(product.multiple_product);
//   //     console.log("multiple_product", product.multiple_product);
//   //     updateColorValues(); // Call to update colorValues on component mount
//   //   });
//   // }, []); 

//   // Function to update colorValues
//   const updateColorValues = () => {
//     const colorOptionId = product.options.find(option => option.title.toLowerCase() === "color")?.id;
//     const newColorValues = new Set<string>();

//     product.variants.forEach((variant) => {
//       const colorValue = getColorOptionValue(variant, colorOptionId);
//       if (colorValue) {
//         newColorValues.add(colorValue.toLowerCase());
//       }
//     });

//     setColorValues(Array.from(newColorValues));
//   };

//   const getColorOptionValue = (variant: ProductVariant, colorOptionId: string | undefined) => {
//     return variant.options.find(option => option.option_id === colorOptionId)?.value;
//   };

//   // Find the ID of the option titled "Color"
//   const colorOptionId = product.options.find(option => option.title.toLowerCase() === "color")?.id;

//   // Function to render product variants
//   const renderVariants = () => {
//     return product.variants.map((variant: ProductVariant, index: number) => {
//       const colorValue = getColorOptionValue(variant, colorOptionId);

//       // Log the variant, product details, and color option value
//       // console.log(`Variant Details ${index + 1}:`, variant);
//       // console.log(`Product Details for Variant ${index + 1}:`, product);
//       // console.log(`Color Option Value for Variant ${index + 1}:`, colorValue);

//       return (
//         <div key={index}>
          
//         </div>
//       );
//     });
//   };
//   // Function to collect all unique color values
// const getAllColorValues = () => {
//   const colorValues = new Set();
//   product.variants.forEach((variant) => {
//     const colorValue = getColorOptionValue(variant, colorOptionId);
//     if (colorValue) {
//       colorValues.add(colorValue.toLowerCase());
//     }
//   });
//   return Array.from(colorValues);
// };

// // Function to handle button click
// const createProductsForAllColors = async () => {
// const colorValues = getAllColorValues();
// for (let i = 0; i < colorValues.length; i++) {
//   const color = colorValues[i];
//   try {
//     if (i === 0) {
//       // Skip the first color value
//       continue;
//     }
    
//     const response = await fetch('http://localhost:9000/store/multipleProducts', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ id: product.id, color: color }),
//     });
//     const data = await response.json();
//     console.log('Response for color', color, ':', data);
//   } catch (error) {
//     console.error('Error creating product for color', color, ':', error);
//   }
// }

// // Call createProductsForFirstColor after all colors have been processed
// };


//   return (
//       <>
//         {colorValues.length >1 && !multiple_product ? (
//           <div className="bg-white p-8 border border-gray-200 rounded-lg">
//           {renderVariants()}
//             <h1>{product.title}</h1>
//       <button
//         className="bg-black rounded p-1 text-white"
//         onClick={() => {
//           createProductsForAllColors();
//           notify.success("success", "Creating products for all colors");
//         }}
//       >
//         Create Products for All Colors
//       </button>
//       </div>
//     ):
//     (
//       <div style={{background:"#F9FAFB"}}> </div>
//     )}
//       </>
//     );
//   };

// export const config: WidgetConfig = {
//   zone: "product.details.after",
// }

// export default ProductWidget;
