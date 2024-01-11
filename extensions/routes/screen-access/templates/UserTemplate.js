import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Medusa from "@medusajs/medusa-js";
import { useAdminGetSession } from "medusa-react"

const medusa = new Medusa({
  baseUrl: "http://localhost:9000",
  maxRetries: 3,
});

const UserTemplate = () => {
  const [users, setUsers] = useState([]);
  const { user, isLoading } = useAdminGetSession();
  const [checkboxStatuses, setCheckboxStatuses] = useState([]);
  const [showToast, setShowToast] = useState(false);


  useEffect(() => {
    medusa.admin.users.list()
      .then(({ users }) => {
        setUsers(users);
        // setCheckboxStatuses(users.map(() => ({})));
        setCheckboxStatuses(users.map(user => ({
          Users: user.user_access || false,
          Settings: user.settings_access || false,
          Discounts: user.discounts_access || false,
          Orders: user.order_access || false,
          Analytics: user.analytics_access || false,
          Giftcards: user.giftcards_access || false,
          Pricing: user.pricing_access || false,
          Products: user.products_access || false,
          Customers: user.customers_access || false,
        })));
      })
  }, []);

  // const permissions = ['Users', 'Orders', 'Products', 'Analytics', 'Giftcards', 'Pricing', 'Settings', 'Discounts', 'Customers'];
  const permissions = ['Users', 'Settings', 'Discounts', 'Orders', 'Analytics', 'Giftcards', 'Pricing', 'Products', 'Customers'];


  // Split permissions into rows of 3
  const permissionsRows = [];
  for (let i = 0; i < permissions.length; i += 3) {
    permissionsRows.push(permissions.slice(i, i + 3));
  }

  const handleCheckboxChange = (index, permission, checked) => {
    const updatedCheckboxStatuses = [...checkboxStatuses];
    const userPermissions = updatedCheckboxStatuses[index] || {};
    userPermissions[permission] = checked;
    updatedCheckboxStatuses[index] = userPermissions;
    setCheckboxStatuses(updatedCheckboxStatuses);
  };

return (
  <div style={{background:"#FFF"}}>
     
    {isLoading && <span>Loading...</span>}
    {user && (
      <span style={{ 
        display: "block", 
        // marginBottom: '20px', 
        marginLeft: '20px', 
        marginTop: '20px', 
        padding: '25px',
        fontWeight: 500
      }}>
        Logged in as {user.email}
      </span>
    )}
    {showToast && (
        <div style={{
          position: 'fixed',
          top: '90px',
          right: '10px',
          backgroundColor: 'green',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}>
          Access is set successfully!
        </div>
      )}
    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px", marginTop:"30px" }}>
      <thead style={{ backgroundColor: "#f8f9fa" }}>
        <tr>
          <th style={{ padding: "10px", border: "1px solid #dee2e6", width: "200px" }}>Email</th>
          <th style={{ padding: "10px", border: "1px solid #dee2e6" }}>Role</th>
          <th style={{ padding: "10px", border: "1px solid #dee2e6", width: "60%" }}>Permissions</th>
          <th style={{ padding: "10px", border: "1px solid #dee2e6", width: "20%" }}>Access Set</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, userIndex) => (
          <tr key={userIndex}>
            <td style={{ padding: "10px",  paddingBottom: "10px", textAlign:"center", borderBottom: "none",borderTop:"none" }}>{user.email}</td>
            <td style={{ padding: "10px",  textAlign:"center",borderBottom: "none", borderTop:"none" }}>{user.role}</td>
            <td style={{padding:"30px",  textAlign:"center"}}>
          {permissionsRows.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex', justifyContent: 'space-between' }}>
              {row.map((permission, permIndex) => (
                <div key={permIndex} style={{ display: 'flex', alignItems: 'center', justifyContent:"center" }}>
                  <input
                    type="checkbox"
                    id={`${permission}-${userIndex}`}
                    name={permission}
                    checked={checkboxStatuses[userIndex] && checkboxStatuses[userIndex][permission]}
                    onChange={(e) => handleCheckboxChange(userIndex, permission, e.target.checked)}
                    style={{ width: "10px", height: "10px", marginRight: "10px" }}
                  />
                  <label htmlFor={`${permission}-${userIndex}`}>{permission}</label>
                </div>
              ))}
            </div>
          ))}
        </td>
            <td style={{ padding: "10px", borderBottom: "none",borderTop:"none" }}>
              <button   className="access-set-button"
              style={{ width: "100%", padding: "10px", boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)", borderRadius: "10px" }} onClick={() => {
                 const reqBody = {
                   id: user.id,
                   user_access: checkboxStatuses[userIndex]?.['Users'] || false,
                   settings_access: checkboxStatuses[userIndex]?.['Settings'] || false,
                   discounts_access: checkboxStatuses[userIndex]?.['Discounts'] || false,
                   order_access: checkboxStatuses[userIndex]?.['Orders'] || false,
                   analytics_access: checkboxStatuses[userIndex]?.['Analytics'] || false,
                   giftcards_access: checkboxStatuses[userIndex]?.['Giftcards'] || false,
                   pricing_access: checkboxStatuses[userIndex]?.['Pricing'] || false,
                   products_access: checkboxStatuses[userIndex]?.['Products'] || false,
                   customers_access: checkboxStatuses[userIndex]?.['Customers'] || false,
                 };
 
                 axios.post('http://localhost:9000/store/screenaccess', reqBody)
                   .then(response => {
                    console.log(response.data);
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3000); // Hide the toast after 3 seconds
                  })
                   .catch(error => {
                     console.error('There was an error!', error);
                   });
                }}>Access Set</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <style>
        {`
          .access-set-button {
            width: 100%;
            padding: 10px;
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            border-radius: 10px;
            transition: transform 0.3s ease;
          }

          .access-set-button:hover {
            transform: scale(1.025);
          }
        `}
      </style>

  </div>
  )
 
 
             }
export default UserTemplate;
