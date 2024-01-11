import type { 
    WidgetConfig, 
    CustomerDetailsWidgetProps,
  } from "@medusajs/admin"
  import Button from '@mui/material/Button';
  import axios from 'axios';


  
  const CustomerWidget = ({
    customer,
    notify,
  }: CustomerDetailsWidgetProps) => {
    return (
      <div className="bg-white p-8 border border-gray-200 rounded-lg">
       <Button variant="contained" color="error" 
            className="p-2 text-white"
            onClick={() => {
            if (window.confirm(`Are you sure you want to delete ${customer.first_name}?`)) {
                notify.success("success", "Successfully Deleted the customer!");
                axios.post('http://localhost:9000/store/deleteCustomer', { id: customer.id })
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
            }
            }}
            >
            Delete {customer.first_name}
            </Button>


      </div>
    )
  }
  
  export const config: WidgetConfig = {
    zone: "customer.details.after",
  }
  
  export default CustomerWidget