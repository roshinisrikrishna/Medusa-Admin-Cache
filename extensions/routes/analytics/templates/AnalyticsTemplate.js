import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, CardText, Row, Col } from 'reactstrap';
import { Container } from 'reactstrap';
import { HiUsers } from "react-icons/hi2";
import CardComponent from "./CardComponent";
import { GiPathDistance } from "react-icons/gi";
import { MdGasMeter } from "react-icons/md";
import { BsFillFuelPumpDieselFill } from "react-icons/bs";
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { FaFilter } from 'react-icons/fa';
// import { PieChart } from '@mui/x-charts/PieChart';
import { HiShoppingBag } from "react-icons/hi";
import { GiShoppingCart } from "react-icons/gi";
import { MdAssignment } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import HighestQuantityItemCard from './HighestQuantityItemCard';

import Medusa from "@medusajs/medusa-js";
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';





const medusa = new Medusa({
 baseUrl: "http://localhost:9000",
 maxRetries: 3,
});

function formatNumber(num) {
  if (num >= 1000) {
    return `${num / 1000}k`;
  }
  return num;
 }

 
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    // Extract the full title
    const fullTitle = label;
    console.log("custom tooltip ", fullTitle);

    return (
      <div className="custom-tooltip">
        <p>{active ? fullTitle : ''}</p>
      </div>
    );
  }

  return null;
}
 

 
const AnalyticsTemplate = () => {
 const [products, setProducts] = useState([]);
 let customerOrders = [];
 const [totalSalesValue, setTotalSalesValue] = useState(0);
 const [averageSalesValue, setAverageSalesValue] = useState(0);
 const [productCount, setProductCount] = useState(0);
 const [orderCount, setOrderCount] = useState(0);
 const [customerCount, setCustomerCount] = useState(0);
 const [barChartData, setBarChartData] = useState([]);
const [productDetails,setProductDetails] = useState([]);
const [sortOrder, setSortOrder] = useState('desc'); // 'desc' for descending, 'asc' for ascending
const [sortOrderSale, setSortOrderSale] = useState('desc'); // 'desc' for descending, 'asc' for ascending
const [filterState, setFilterState] = useState('all'); // 'all' for all products, 'top3' for top 3 products, 'bottom3' for bottom 3 products
const [showLowQuantity, setShowLowQuantity] = useState(false);
const [sortOrderFilter, setSortOrderFilter] = useState('desc'); // 'desc' for descending, 'asc' for ascending
const [showTopItems, setShowTopItems] = useState(true);
const [customerDetailsArray,setCustomerDetailsArray] = useState([]);
const [lineChartData, setlineChartData] = useState([]);
const [showWeekChart, setShowWeekChart] = useState(true);
const [showWeekChartRevenue, setShowWeekChartRevenue] = useState(true);


function filterDataItem() {
  const sortedData = [...barChartData].sort((a, b) => {
    return showTopItems ? b.quantity - a.quantity : a.quantity - b.quantity;
  });

  const slicedData = sortedData.slice(0, 5); // Slice the array to get only the first 3 items

  setBarChartData(slicedData);
}



function filterData() {
  if (sortOrderFilter === 'desc') {
    setSortOrderFilter('asc');
    const sortedDataFilter = [...productDetails].sort((a, b) => {
      return a.variantDetails.reduce((acc, variant) => acc + variant.inventory_quantity, 0) -
             b.variantDetails.reduce((acc, variant) => acc + variant.inventory_quantity, 0);
    });
    const slicedData = sortedDataFilter.slice(0, 5); // Slice the array to get only the first 3 items
    setProductDetails(slicedData);
  } else {
    setSortOrderFilter('desc');
    const sortedDataFilter = [...productDetails].sort((a, b) => {
      return b.variantDetails.reduce((acc, variant) => acc + variant.inventory_quantity, 0) -
             a.variantDetails.reduce((acc, variant) => acc + variant.inventory_quantity, 0);
    });
    const slicedData = sortedDataFilter.slice(-5); // Slice the array to get the last 3 items
    setProductDetails(slicedData);
  }
}

 

 function sortData() {
   if (sortOrder === 'desc') {
     setSortOrder('asc');
     const sortedData = [...productDetails].sort((a, b) => {
       return a.variantDetails.reduce((acc, variant) => acc + variant.inventory_quantity, 0) -
              b.variantDetails.reduce((acc, variant) => acc + variant.inventory_quantity, 0);
     });
     setProductDetails(sortedData);
   } else {
     setSortOrder('desc');
     const sortedData = [...productDetails].sort((a, b) => {
       return b.variantDetails.reduce((acc, variant) => acc + variant.inventory_quantity, 0) -
              a.variantDetails.reduce((acc, variant) => acc + variant.inventory_quantity, 0);
     });
     setProductDetails(sortedData);
   }
 }

 function sortDataItem() {
  if (sortOrderSale === 'desc') {
    setSortOrderSale('asc');
    const sortedDataSale = [...barChartData].sort((a, b) => {
      return a.quantity - b.quantity;
    });
    setBarChartData(sortedDataSale);
  } else {
    setSortOrderSale('desc');
    const sortedDataSale = [...barChartData].sort((a, b) => {
      return b.quantity - a.quantity;
    });
    setBarChartData(sortedDataSale);
  }
 }
 

 useEffect(() => {
   medusa.admin.products.list()
   .then(({ products, limit, offset, count }) => {
    console.log("products ",products)
    setProductCount(products.length);

    const productDetails = products.map(product => {
      const variantDetails = product.variants.map(variant => {
        const price = variant.prices.find(price => price.variant_id === variant.id);
        return {
          variant_id: variant.id,
          title: product.title,
          inventory_quantity: variant.inventory_quantity,
          price: price ? (price.amount * 0.01) : null,
          image: product.thumbnail // Add image to the variant details
        };
      });
      return {
        product_id: product.id,
        variantDetails
      };
     });
     
       
       console.log("product details ",productDetails);
       setProductDetails(productDetails);
       
    setProducts(products);
     });

     medusa.admin.salesChannels.list()
    .then(({ sales_channels, limit, offset, count }) => {
        console.log("sales channel ",sales_channels)
    console.log("count of sales ",sales_channels.length)
    })

    medusa.admin.orders.list()
    .then(({ orders, limit, offset, count }) => {
        console.log("orders ",orders)
        setOrderCount(orders.length);

        const totalSalesValue = orders.reduce((total, order) => {
        const orderTotal = order.payments.reduce((orderTotal, payment) => {
          return orderTotal + (payment.amount * 0.01);
        }, 0);
        return total + orderTotal;
       }, 0);
       
       setTotalSalesValue(totalSalesValue.toFixed(2));

      //  const averageSalesValue = totalSalesValue / orders.length;
      
      //  console.log("average sales value",averageSalesValue);
      //  setAverageSalesValue(averageSalesValue)

       const averageSalesValue = totalSalesValue / orders.length;
    const roundedAverageSalesValue = parseFloat(averageSalesValue.toFixed(2));
    setAverageSalesValue(roundedAverageSalesValue);


    const items = orders.reduce((acc, order) => {
      order.items.forEach(item => {
        const existingItem = acc.find(i => i.variant_id === item.variant_id);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          const image = item.thumbnail; // assuming order has a thumbnail attribute
          acc.push({
            variant_id: item.variant_id,
            title: item.title,
            quantity: item.quantity,
            image: image // add image to the item
          });
        }
      });
      return acc;
     }, []);
     
     console.log("items ",items);
     setBarChartData(items);

     // Format date without time
      const formatDate = (date) => {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
      
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
      
        return [year, month, day].join('-');
      }

     const itemsDate = orders.reduce((acc, order) => {
      order.items.forEach(item => {
        const existingItem = acc.find(i => i.created_at === item.created_at);
        if (existingItem) {
          existingItem.quantity += item.quantity;
          existingItem.amount += item.refundable;
        } else {
          const image = item.thumbnail; // assuming order has a thumbnail attribute
          const dateItem = order.created_at;
          acc.push({
            variant_id: item.variant_id,
            title: item.title,
            dateItem: dateItem,
            quantity: item.quantity,
            amount: item.refundable,
            image: image // add image to the item
          });
        }
      });
      return acc;
     }, []);
     
     setlineChartData(itemsDate);
     console.log("itemsDate ",itemsDate);
     

  let  customerDetails = orders.reduce((details, order) => {
      const customerId = order.customer_id;
      const fullName = `${order.customer.email.split("@")[0]}`;
      const orderTotal = order.payments.reduce((total, payment) => {
          return total + payment.amount;
      }, 0);
   
      if (details[customerId]) {
          details[customerId].totalAmount += orderTotal;
      } else {
          details[customerId] = {
              fullName: fullName,
              totalAmount: orderTotal
          };
      }
      return details;
    }, {});
     console.log("Customer details: ", customerDetails);
    setCustomerDetailsArray(customerDetails)
     
    })

    medusa.admin.customers.list()
    .then(({ customers, limit, offset, count }) => {
    console.log("customers ",customers)
    setCustomerCount(customers.length);
})
 }, []);

 const itemsQuantityArray = barChartData.map(item => item.quantity);
 const itemstitleArray = barChartData.map(item => item.title);

 
 const productQuantityArray = productDetails.map(product => {
  return product.variantDetails.map(variant => variant.inventory_quantity);
 }).flat();
 
 const productTitleArray = productDetails.map(product => {
  return product.variantDetails.map(variant => variant.title);
 }).flat();
 
 const productImageArray = productDetails.map(product => {
  return product.variantDetails.map(variant => variant.image);
 }).flat();
 


 const productSaleArray = barChartData.map(item => {
  const product = productDetails.find(product => 
    product.variantDetails.some(variant => variant.variant_id === item.variant_id)
  );
  if (product) {
    const variant = product.variantDetails.find(variant => variant.variant_id === item.variant_id);
    return {
      ...item,
      price: variant.price,
      title: item.title
    };
  }
  return null;
 }).filter(item => item !== null);

 console.log("product Sale array ",productSaleArray)
 const salePriceArray = productSaleArray.map(product => product.price);
 const saleQuantityArray = productSaleArray.map(product => product.quantity);
 const saleTitleArray = productSaleArray.map(product => product.title);
 
 const combinedData = saleQuantityArray.map((quantity, index) => {
  return {
    title: saleTitleArray[index],
    quantity: quantity,
    price: salePriceArray[index]
  };
 });

 console.log("combinedData",combinedData)
 
 console.log("customerDetailsArray 123",customerDetailsArray)

 // Sort the customer details array by totalAmount in descending order
let customerDetailsArrayValues = Object.values(customerDetailsArray);
customerDetailsArrayValues.sort((a, b) => b.totalAmount - a.totalAmount);

// Check if the array is not empty before accessing the first element
let highestTotalAmountCustomerFullName = '';
let highestTotalAmountCustomerPrice = 0;

if (customerDetailsArrayValues.length > 0) {
  let highestTotalAmountCustomer = customerDetailsArrayValues[0];
  highestTotalAmountCustomerFullName = highestTotalAmountCustomer.fullName;
  highestTotalAmountCustomerPrice = (highestTotalAmountCustomer.totalAmount * 0.01).toFixed(2);


}

let highestQuantityItem;
if (barChartData.length > 0) {
 highestQuantityItem = barChartData.reduce((prev, current) => {
   return (prev.quantity > current.quantity) ? prev : current;
 });
} else {
 console.log('The barChartData array is empty.');
}
console.log("highest quantity item ",highestQuantityItem)
console.log("customer detail array ",customerDetailsArray)

const data = Object.entries(customerDetailsArray).map(([key, value]) => ({
  value: value.totalAmount,
  label: value.fullName,
 }));

 const size = {
  width: 380,
  height: 255,
 };
 
 console.log("lineChartData ",lineChartData)

 const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

 const dateQuantityMap = lineChartData.reduce((acc, item) => {
   const date = new Date(item.dateItem);
   const day = date.getDay();
   
   if (!acc[daysOfWeek[day]]) {
     acc[daysOfWeek[day]] = 0;
   }
   
   acc[daysOfWeek[day]] += item.quantity;
   return acc;
 }, {});
 
 const series = Object.entries(dateQuantityMap).map(([day, quantity]) => ({
   data: [{ x: day, y: quantity }],
   label: day,
 }));

const days = Object.keys(dateQuantityMap);
 const daysQuantity = Object.values(dateQuantityMap);
 
 const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const monthQuantityMap = lineChartData.reduce((acc, item) => {
 const date = new Date(item.dateItem);
 const month = date.getMonth();
 
 if (!acc[months[month]]) {
  acc[months[month]] = 0;
 }
 
 acc[months[month]] += item.quantity;
 return acc;
}, {});
 
console.log("monthQuantityMap ", monthQuantityMap);
const month = Object.keys(monthQuantityMap);
 const monthQuantity = Object.values(monthQuantityMap);


 const dateAmountMap = lineChartData.reduce((acc, item) => {
   const date = new Date(item.dateItem);
   const day = date.getDay();
   
   if (!acc[daysOfWeek[day]]) {
     acc[daysOfWeek[day]] = 0;
   }
   
   acc[daysOfWeek[day]] += (item.amount * 0.01);
   return acc;
 }, {});
 
 const seriesAmount = Object.entries(dateAmountMap).map(([day, quantity]) => ({
  data: [{ x: day, y: quantity }],
  label: day,
}));


const daysAm = Object.keys(dateAmountMap);
 const daysAmount = Object.values(dateAmountMap);
 

const monthAmountMap = lineChartData.reduce((acc, item) => {
 const date = new Date(item.dateItem);
 const month = date.getMonth();
 
 if (!acc[months[month]]) {
  acc[months[month]] = 0;
 }
 
 acc[months[month]] += (item.amount * 0.01);
 return acc;
}, {});
 
console.log("monthAmountMap ", monthAmountMap);
const monthAm = Object.keys(monthAmountMap);
 const monthAmount = Object.values(monthAmountMap);
 const formattedMonthAmount = monthAmount.map(amount => formatNumber(amount));


//  const series = Object.entries(dateQuantityMap).map(([date, quantity]) => ({
//   data: [{ x: new Date(date), y: quantity }],
//   label: date,
//  }));
 
//  const series1 = Object.keys(dateQuantityMap);
//  const series2 = Object.values(dateQuantityMap);
//  console.log("series ", series);
//  console.log("series1 ", series1);
//  console.log("series2 ",series2 );
 return (
  <Container>
     
    <div className="flex flex-col small:flex-row small:items-start py-6 gap-x-4">
    <CardComponent
            title="Number of Products"
            value={productCount}
            percentage={100}
            icon={<HiShoppingBag style={{ color: 'white', fontSize: '24px' }} />}
            />
           <CardComponent
            title="Number of Customers"
            value={customerCount}
            percentage={100}
            icon={<FaUsers style={{ color: 'white', fontSize: '24px' }} />}
            />
               <CardComponent
            title="Number of Orders"
            value={orderCount}
            percentage={100}
            icon={<MdAssignment style={{ color: 'white', fontSize: '24px' }} />}
            />

</div>
<div className="flex flex-col small:flex-row small:items-start py-6 gap-x-4">
<CardComponent
          title="Total Sales Value"
          value={"$ " + totalSalesValue}
          percentage={100}
          icon={<GiShoppingCart style={{ color: 'white', fontSize: '24px' }} />}
          />  
           
           <CardComponent
            title="Average Sales Value"
            value={"$ " + averageSalesValue}
            percentage={100}
            icon={<GiShoppingCart style={{ color: 'white', fontSize: '24px' }} />}
            />
           <CardComponent
            title="Highest Valued Customer"
            value={highestTotalAmountCustomerFullName+ " for $ " + highestTotalAmountCustomerPrice }
            percentage={100}
            icon={<FaUsers style={{ color: 'white', fontSize: '24px' }} />}
          />

    </div>
    <div className='' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', }}>
    <h4 className='' style={{fontWeight: 600,color: '#363636',fontSize: "28px", lineHeight: "1.2em", letterSpacing: "0.1em"}}>Highest Sold Product</h4>

     {highestQuantityItem && (
       <HighestQuantityItemCard 
         title={highestQuantityItem.title} 
         quantity={highestQuantityItem.quantity} 
         image={highestQuantityItem.image} 
       />
     )}
   </div>
        
    <Container className="mt-5" style={{ maxWidth: '800px' }}>
    <div className='mt-5 pt-5' style={{
 background:"#FFF", 
 borderRadius: "10px", 
 boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 maxWidth: '800px'
}}>

        {lineChartData.length > 0 && (

<div style={{ position: 'relative', maxWidth:"100%" }}>
<h4 className='ml-3 pt-5 pb-5' style={{textAlign:"center", fontWeight: 600, color: '#7d7d7d',fontSize: "26px", lineHeight: "1.2em", letterSpacing: "0.1em"}}>
  Varition in Sale by Quantity by Week/Month
</h4>
<button 
 onClick={() => setShowWeekChart(!showWeekChart)} 
 style={{ 
   position: 'absolute', 
   right: '0', // Place button at right end of div
   top: '120px', 
   padding:"15px",
   boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
  //  border: '1px solid #000', // Add border
   borderRadius: '10px', // Add rounded corners
   transition: 'transform 0.3s', // Add transition effect
 }}
 onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'} // Increase size on hover
 onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'} // Reset size when mouse is not over
>
 {showWeekChart ? 'Month' : 'Week'}
</button>


           {showWeekChart ? (

          <BarChart
          xAxis={[
            {
              id: 'barCategories',
              data: days.map(day => day.split(' ')[0]),
              scaleType: 'band',
              label: 'Days of the Week', // Add label to x-axis
            },
          ]}
          yAxis={[
            {
              id: 'quantity',
              label: 'Sold Quantity', // Add label to y-axis
            },
          ]}
          series={[
            {
              data: daysQuantity,
              yAxisKey: 'quantity', // Map series data to y-axis
              color:['#fa3ea2'] // Assign different colors to different bars
            },
          ]}
          width={500}
          height={300}
          tooltip={CustomTooltip}
          />
          
          

            
            ) : (
          <BarChart
          xAxis={[
            {
              id: 'barCategories',
              data: month.map(mon => mon.split(' ')[0]),
              scaleType: 'band',
              label: 'Months of the Year', // Add label to x-axis
            },
          ]}
          yAxis={[
            {
              id: 'quantity',
              label: 'Sold Quantity', // Add label to y-axis
            },
          ]}
          series={[
            {
              data: monthQuantity,
              yAxisKey: 'quantity', // Map series data to y-axis
              color:['#6b19cf'] // Assign different colors to different bars
            },
          ]}
          width={400}
          height={300}
          tooltip={CustomTooltip}
          />
          
          

            )}

        </div>
                      )}

</div>
<div className='mt-5 pt-5' style={{
 background:"#FFF", 
 borderRadius: "10px", 
 boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
 display: 'flex',
 justifyContent: 'center',
 alignItems: 'center',
 maxWidth: '800px'
}}>

        {lineChartData.length > 0 && (

<div style={{ position: 'relative', maxWidth:"100%" }}>
<h4 className='ml-3 pt-5 pb-5' style={{textAlign:"center", fontWeight: 600, color: '#7d7d7d',fontSize: "26px", lineHeight: "1.2em", letterSpacing: "0.1em"}}>
  Varition in Sale by Revenue by Week/Month
</h4>
<button 
 onClick={() => setShowWeekChartRevenue(!showWeekChartRevenue)} 
 style={{ 
   position: 'absolute', 
   right: '0', // Place button at right end of div
   top: '120px', 
   padding:"15px",
   boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
  //  border: '1px solid #000', // Add border
   borderRadius: '10px', // Add rounded corners
   transition: 'transform 0.3s', // Add transition effect
 }}
 onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'} // Increase size on hover
 onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'} // Reset size when mouse is not over
>
 {showWeekChartRevenue ? 'Month' : 'Week'}
</button>


           {showWeekChartRevenue ? (

          <BarChart
          xAxis={[
            {
              id: 'barCategories',
              data: daysAm.map(day => day.split(' ')[0]),
              scaleType: 'band',
              label: 'Days of the Week', // Add label to x-axis
            },
          ]}
          yAxis={[
            {
              id: 'quantity',
              label: 'Sold Revenue in Thousand Rupees', // Add label to y-axis
            },
          ]}
          series={[
            {
              data: daysAmount.map(am =>am/1000),
              yAxisKey: 'quantity', // Map series data to y-axis
              color:['#6b19cf'] // Assign different colors to different bars
            },
          ]}
          width={500}
          height={300}
          tooltip={CustomTooltip}
          />
          
          

            
            ) : (
          <BarChart
          xAxis={[
            {
              id: 'barCategories',
              data: monthAm.map(mon => mon.split(' ')[0]),
              scaleType: 'band',
              label: 'Months of the Year', // Add label to x-axis
            },
          ]}
          yAxis={[
            {
              id: 'quantity',
              label: 'Sold Revenue in Thousand Rupees', // Add label to y-axis
              fontSize: 8, // Adjust font size

            },
          ]}
          series={[
            {
              data: monthAmount.map(am =>am/1000),
              yAxisKey: 'quantity', // Map series data to y-axis
              color:['#fa3ea2'] // Assign different colors to different bars
            },
          ]}
          width={400}
          height={300}
          tooltip={CustomTooltip}
          />
          
          

            )}

        </div>
                      )}

</div>
    <div className="flex flex-col small:flex-row small:items-start py-6 gap-x-4">
    <div className='mt-5 pt-5' style={{ position: 'relative', background:"#FFF", borderRadius: "10px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)", width: "70%", }}>

    <h4 className='ml-3' style={{textAlign:"center", fontWeight: 600, color: '#7d7d7d',fontSize: "26px", lineHeight: "1.2em", letterSpacing: "0.1em"}}>
      Sales
    </h4>

        {barChartData.length > 0 && (
          <BarChart
          xAxis={[
            {
              id: 'barCategories',
              data: itemstitleArray.map(title => title.split(' ')[0]),
              scaleType: 'band',
              label: 'Sold Product Name', // Add label to x-axis
            },
          ]}
          yAxis={[
            {
              id: 'quantity',
              label: 'Sold Quantity', // Add label to y-axis
            },
          ]}
          series={[
            {
              data: itemsQuantityArray,
              yAxisKey: 'quantity', // Map series data to y-axis
              color:['purple'] // Assign different colors to different bars
            },
          ]}
          width={600}
          height={300}
          tooltip={CustomTooltip}
          />
          
          

            )}
       <button 
 className='pt-4' 
 onClick={() => { setShowTopItems(!showTopItems); filterDataItem(); }} 
 style={{ position: 'absolute', top: '40px', right: '60px' }}
 title="Top 5 sold items" // Add tooltip text
>
 <span style={{ marginLeft: '5px' }}>
   <FaFilter />
 </span>
</button>




        <button className='pt-4' onClick={sortDataItem}  title="Sort products by quantity" // Add tooltip text
style={{ position: 'absolute', top: '40px', right: "15px" }}><span style={{ marginLeft: '5px' }}>
        {sortOrderSale === 'asc' ? (
        <FaSortAmountUp />
        ) : (
        <FaSortAmountDown />
        )}
        </span></button>


        </div>
        <div className='mt-5' style={{background:"#FFF", borderRadius: "10px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",maxHeight:"40%", width: "60%"}}>
          <h4 className='ml-3 pt-5 pb-5' style={{textAlign:"center", fontWeight: 600, color: '#7d7d7d',fontSize: "23px", lineHeight: "1.2em", letterSpacing: "0.1em"}}>
      Share in Sales Value by each Customer   
      </h4>
      <PieChart 
 colors={['green', '#4dcdf7', 'purple']} // Use palette
 series={[
   {
     arcLabel: (item) => `${item.label}`,
     arcLabelMinAngle: 45,
     data,
   },
 ]}
 sx={{
   [`& .${pieArcLabelClasses.root}`]: {
     fill: 'white',
     fontWeight: 'bold',
     fontSize: '12px', // Set the font size here
   },
 }}
 {...size}
/>



          </div>
    </div>
                  
          
         

          <div className="flex flex-col small:flex-row small:items-start py-6 gap-x-4">
          <div className='mt-5 pt-5' style={{ background:"#FFF", borderRadius: "10px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",position: 'relative', width:"58%" }}>
          <h4 className='ml-3 pt-5 pb-5' style={{textAlign:"center", fontWeight: 600, color: '#7d7d7d',fontSize: "26px", lineHeight: "1.2em", letterSpacing: "0.1em"}}>
             Quantity of each Product in Inventory
                </h4>
          {productDetails.length > 0 && (
            
            <BarChart
            xAxis={[
              {
                id: 'barCategories',
                data: productTitleArray.map(title => title.split(' ')[0]), // Use only the first word
                scaleType: 'band',
                label: 'Product Name', // Add label to x-axis
              },
            ]}
            yAxis={[
              {
                id: 'quantity',
                label: 'Inventory Quantity', // Add label to y-axis
              },
            ]}
            series={[
              {
                data: productQuantityArray,
                yAxisKey: 'quantity', // Map series data to y-axis
                color:['#02a4d9'] // Assign different colors to different bars

              },
            ]}
            width={500}
            height={300}
            
            tooltip={CustomTooltip}
          />

)}

<button onClick={sortData} style={{ position: 'absolute', top: '160px', right: '15px' }}
 title="Sort products by quantity" // Add tooltip text
 >
<span style={{ marginLeft: '' }}>
    {sortOrder === 'asc' ? (
      <FaSortAmountUp />
    ) : (
      <FaSortAmountDown />
    )}
  </span></button>
  <button 
 onClick={filterData} 
 style={{ position: 'absolute', top: '160px', right: "60px" }}
 title="Bottom 5 products with least quantity" // Add tooltip text
>
 <span style={{ marginLeft: '' }}>
  <FaFilter />
 </span>
</button>




          </div>
          <div className='mt-5 pt-5' style={{marginTop:"", background:"#FFF", borderRadius: "10px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",position: 'relative', width:"60%"}}>
          <h4 className='ml-3 pt-5 pb-5' style={{textAlign:"center", fontWeight: 600, color: '#7d7d7d',fontSize: "26px", lineHeight: "1.2em", letterSpacing: "0.1em"}}>
             Relation between Products' Sale with Price
                </h4>
          {combinedData.length > 0 && (

<LineChart
width={500}
height={300}
series={[
  { data: combinedData.map(item => item.quantity), label: 'Quantity', yAxisKey: 'leftAxisId' },
  { data: combinedData.map(item => item.price), label: 'Price', yAxisKey: 'rightAxisId' },
]}
xAxis={[{ scaleType: 'point', data: combinedData.map(item => item.title.split(' ')[0]) }]}
yAxis={[
  { id: 'leftAxisId', label: 'Quantity' },
  { id: 'rightAxisId', label: 'Price', position: 'right' }
]}
/>

          )}
        
          </div>
        </div>
        
          
        </Container>



  </Container>
);

};

export default AnalyticsTemplate;