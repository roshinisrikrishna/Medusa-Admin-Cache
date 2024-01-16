import React from 'react';
import { Card, CardBody } from 'reactstrap';

const CardComponent = ({ title, value, percentage, icon }) => {
 return (
 <Card className="p-1 mb-4 mt-2" style={{background:"#FFF", width:"40%", borderRadius: "10px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)", position: "relative"}}>
   <CardBody className="" style={{textAlign:"center"}}>
     <div className="d-flex align-items-center">
       <div className="flex-grow-1" style={{ }}>
         <h4 className="mb-2 pt-3 ml-2" style={{textAlign:"left", color: '#7d7d7d', fontWeight: 600, fontSize:"18px" }}>
           {title}
         </h4>
         <div className="mb-2 mt-5 pt-1" style={{color:"#09db10",fontSize:"16px"}}>
           <h4>
             {value} 
           </h4>
         </div>
       </div>
       <div style={{ position: "absolute", top: "10px", right: "10px", backgroundImage: "linear-gradient(45deg, #FFA500, #FF4500)", borderRadius: "10px", padding: "10px" }}>
         {icon}
       </div>
     </div>
   </CardBody>
 </Card>
 );
};

export default CardComponent;