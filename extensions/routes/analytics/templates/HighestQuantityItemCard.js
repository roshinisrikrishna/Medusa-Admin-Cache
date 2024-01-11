import React from 'react';
import { Card, CardBody } from 'reactstrap';

const HighestQuantityItemCard = ({ title, quantity, image }) => (
    <Card style={{background:"#FFF", borderRadius: "10px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",position: 'relative', width: '70%', height: '200px'}}>
     <CardBody style={{position: 'absolute', left: '0', width: '50%', height: '100%', padding: '10px'}}>
       <h4 className='mt-5 pt-5' style={{fontWeight: 600,color: '#7d7d7d',fontSize: "26px", lineHeight: "1.2em", letterSpacing: "0.1em"}}>{title}</h4>
       <p className='mt-5 pt-5' style={{color:"#09db10",fontSize: "26px", paddingTop:"5px", lineHeight: "1.2em", letterSpacing: "0.1em"}}>{quantity}</p>
     </CardBody>
     <img src={image} alt={title} style={{position: 'absolute', right: '0', width: '50%', height: '100%', objectFit: 'cover'}}/>
    </Card>
   );
   

export default HighestQuantityItemCard;