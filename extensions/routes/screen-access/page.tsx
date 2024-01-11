import React, { useState, useEffect } from 'react';
import Medusa from "@medusajs/medusa-js";
import UserTemplate from './templates/UserTemplate';
import { RouteConfig } from "@medusajs/admin"
import { useAdminGetSession } from "medusa-react"


const UserPage = () => {

  const { user, isLoading } = useAdminGetSession();

  console.log("user ",user)

 return (
  <div>
  {user.role ==="admin" ? (
   <UserTemplate />
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
//       label: "User",
//     //   icon: CustomIcon,
//     },
//   }

export default UserPage;