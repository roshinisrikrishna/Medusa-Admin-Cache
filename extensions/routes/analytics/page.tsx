import React, { useState, useEffect } from 'react';
import Medusa from "@medusajs/medusa-js";
import AnalyticsTemplate from './templates/AnalyticsTemplate';
import { RouteConfig } from "@medusajs/admin"
import { useAdminGetSession } from "medusa-react"



const AnalyticsPage = () => {
  const { user, isLoading } = useAdminGetSession();

  console.log("user ",user)
  return (
    <div>
      {user.analytics_access ? (
        <AnalyticsTemplate />
      ) : (
        <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
        <p style={{fontWeight: 500, fontSize: "22px",paddingTop:"20%"}}>{user.email} is not authorized to access this page</p>
        </div>
      )}
    </div>
   );
   
};

// export const config: RouteConfig = {
  

//     link: {
//       label: "Analytics",
//     //   icon: CustomIcon,
//     },
//   }

export default AnalyticsPage;