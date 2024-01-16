// import React, { useState, useEffect } from 'react';
// import type { 
//  WidgetConfig, 
//  ProductCollectionDetailsWidgetProps,
// } from "@medusajs/admin"

// import Medusa from "@medusajs/medusa-js"
// const medusa = new Medusa({ baseUrl:"http://localhost:9000", maxRetries: 3 })

// const OrderWidget = ({ notify }) => {
//  const [products, setProducts] = useState([]);

//  useEffect(() => {
//  medusa.products.list()
//    .then(({ products }) => {
//     console.log("products ",products)
//      setProducts(products);
//    });

//    medusa.shippingOptions.list()
// .then(({ shipping_options }) => {
//   console.log("shipping_options ",shipping_options);
// })
//  }, []);

//  return (
//  <div className="bg-white p-8 border border-gray-200 rounded-lg">
//    <h1 style={{fontWeight: 600,textAlign:"center"}}>Products</h1>
//    <table style={{width:"100%", marginTop:"8%"}}>
//    <thead style={{marginBottom:"8%"}}>
//  <tr>
//  <th style={{width: '250px', textAlign: 'center'}}>Title</th>
//  <th style={{width: '50px', textAlign: 'center'}}>Available Quantity</th>
//  <th style={{width: '50px', textAlign: 'center'}}>Sold Quantity</th>
//  <th style={{width: '100px',textAlign: 'center'}}>Price Range</th>
//  </tr>
// </thead>
// <tbody style={{ marginTop: "20%", paddingTop: "25%" }}>
//   {products.map((product) => {
//     // Check if product.variants exists
//     if (product.variants && product.variants.length > 0) {
//       // Calculate total inventory quantity
//       const totalInventoryQuantity = product.variants.reduce((total, variant) => total + variant.inventory_quantity, 0);

//       // Get price range

//       const prices = product.variants.flatMap(variant => variant.prices);
//       const minPrice = Math.min(...prices.map(price => price.amount));
//       const maxPrice = Math.max(...prices.map(price => price.amount));

//       // Get currency code

//       const currencyCode = prices[0].currency_code;

//       // Format minPrice and maxPrice with currency symbol
//       const minPriceFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(minPrice * 0.01);
//       const maxPriceFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(maxPrice * 0.01);

//       return (
//         <tr key={product.id} style={{ paddingTop: "10%", marginTop: "10%" }}>
//           <td style={{ width: '350px', textAlign: 'left', display: 'flex', alignItems: 'center' }}>
//             <img src={product.thumbnail} alt={product.title} width="25%" />
//             <p style={{ paddingLeft: "5%" }}>{product.title}</p>
//           </td>
//           <td style={{ width: '150px', textAlign: 'center' }}>{totalInventoryQuantity}</td>
//           {product.sales_quantity && (
//           <td style={{ width: '150px', textAlign: 'center' }}>{product.sales_quantity}</td>
//           )}
//           <td style={{ width: '200px', textAlign: 'center' }}>{minPriceFormatted} - {maxPriceFormatted}</td>
//         </tr>
//       );
//     } else {
//       // Handle the case where product.variants doesn't exist or is empty
//       return null;
//     }
//   })}
// </tbody>


//    </table>
//  </div>
//  );
// }

// export const config: WidgetConfig = {
//  zone: "product.list.after",
// }

// export default OrderWidget;
