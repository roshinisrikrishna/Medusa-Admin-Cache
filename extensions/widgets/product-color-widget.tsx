import React, { useState, useEffect } from 'react';
import type { WidgetConfig, ProductDetailsWidgetProps } from "@medusajs/admin"
import { Product, ProductVariant } from "@medusajs/medusa"
// import TextField from '@mui/material/TextField';
import { TextField } from '@mui/material'
import axios from 'axios'
import { Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Input from '@mui/material';


const ProductWidget = ({ product, notify }: ProductDetailsWidgetProps) => {
    // Extract option id where title is "Color"
    const colorOptionId = product.options.find(option => option.title.toLowerCase() === "color")?.id;

    let colorValues = [];
    

    let modifiedUrl;

    const updateProductStatus = async () => {
      try {
        const response = await axios.post('http://localhost:9000/store/updateStatus', {
          id: product.id
        });
      //   console.log(response.data);
      //   notify.success("Success", "Product status updated successfully!");
      } catch (error) {
        console.error("Error updating product status:", error);
      //   notify.error("Error", "Failed to update product status.");
      }
    }

    if (colorOptionId) {
        colorValues = product.variants
            .map((variant: ProductVariant) => {
                const foundOptionValue = variant.options.find(optionValue => optionValue.option_id === colorOptionId);
                return foundOptionValue ? foundOptionValue.value : "";
            })
            .filter(value => value !== "") // Filter out empty values
            .filter((value, index, self) => self.indexOf(value) === index); // Filter out duplicates
    }
    const [imageUrls, setImageUrls] = useState({});
    const [thumbnailUrls, setThumbnailUrls] = useState({});
    const [count, setCount] = useState(0);

    // Fetch image URLs for each color
    const fetchImageUrls = async () => {
      let missingCount = 0;

      const urls = await Promise.all(colorValues.map(async (color) => {
          const modifiedOptionId = `${color.toLowerCase()}${colorOptionId}`;
          try {
              const response = await axios.get(`http://localhost:9000/store/colorImage`, {
                  params: { option_id: modifiedOptionId }
              });
  
              // Check if the response has data and a thumbnail
              const imageData = response.data.data && response.data.data[0];
              if (imageData && imageData.thumbnail) {
                  return { color, url: imageData.thumbnail };
              } else {
                missingCount++;
                  return { color, url: "" };
              }
          } catch (error) {
            missingCount++;
              console.error(`PRODUCT COLOR Error fetching image for color ${color}:`, error);
              return { color, url: "" };
          }
      }));
  
      setCount(missingCount);

      // Update the imageUrls state
      const newImageUrls = urls.reduce((acc, { color, url }) => {
          acc[color] = url;
          return acc;
      }, {});
      setThumbnailUrls(newImageUrls);
  };
  

  useEffect(() => {
    if (count > 0) {
      console.log('product status', count)
      updateProductStatus();
    }
  }, [count]); // Dependency array

    // Call fetchImageUrls when component mounts or colorValues change
    useEffect(() => {
        fetchImageUrls();
    }, [colorValues]); // Dependency array
    // State to store image URLs

    // Function to handle image URL change

    const handleImageChange = (color, file) => {
        setSelectedImages(prev => ({ ...prev, [color]: URL.createObjectURL(file) }));
        setSelectedFiles(prev => ({ ...prev, [color]: file }));
    };


    const updateThumbnailUrl = (color, url) => {
        setThumbnailUrls(prevUrls => ({ ...prevUrls, [color]: url }));
    };

    // Function to handle upload button click
    const handleUpload = (color) => {
        const thumbnailUrl = thumbnailUrls[color];

        if (!colorOptionId) {
            notify.error("Error", `Option ID not found for color ${color}`);
            return;
        }

        const modifiedOptionId = `${color.toLowerCase()}${colorOptionId}`;

        // console.log('modifiedUrl', modifiedUrl)
        const requestBody = {
            option_id: modifiedOptionId,
            color: color,
            thumbnail: modifiedUrl
        };

        // console.log('requestBody colorImage', requestBody)
        axios.post('http://localhost:9000/store/colorImage', requestBody)
            .then(response => {
                // console.log('Response:', response.data);
                setChangeImageClicked(prev => ({ ...prev, [color]: false }));
                notify.success("Success", `Image for color ${color} uploaded successfully`);
            })
            .catch(error => {
                console.error('Error:', error);
                notify.error("Error", `Failed to upload image for color ${color}`);
            });
    };


    const [changeImageClicked, setChangeImageClicked] = useState({});

    // Function to handle "Change Image" button click
    const handleChangeImageClick = (color) => {
        setChangeImageClicked(prev => ({ ...prev, [color]: true }));
    };

    const [uploading, setUploading] = useState(false)
    const [selectedImages, setSelectedImages] = useState({});
    const [selectedFiles, setSelectedFiles] = useState({});


    const handleImageUpload = async (color) => {
        setUploading(true);
        try {
            const selectedFile = selectedFiles[color];
            if (!selectedFile) return;
            const formData = new FormData();
            formData.append("myImage", selectedFile);

            const response = await axios.post("http://localhost:9000/store/imageUpload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // console.log('response imageUpload', response)
            const uploadedImageUrl = response.data.file.url;
            // console.log('Uploaded Image URL:', uploadedImageUrl);
            modifiedUrl =  uploadedImageUrl
            // Update the thumbnail URL for the specific color
            updateThumbnailUrl(color, uploadedImageUrl);

            // Call handleUpload after successful image upload
            handleUpload(color);
        } catch (error) {
            console.error('Error:', error);
            if (error.response) {
                console.error('Error Response:', error.response.data);
            }
        }
        setUploading(false);
    };


    return (
      <div className="bg-white p-8 border border-gray-200 rounded-lg">
        {colorValues.length > 0 && (
          <>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid gray', borderTop:'1px solid gray',padding:"2%" }}>Color</th>
                  <th style={{ borderBottom: '1px solid gray', borderTop:'1px solid gray',padding:"2%" }}>Image</th> {/* New column for image */}
                  <th style={{ borderBottom: '1px solid gray', borderTop:'1px solid gray',padding:"2%" }}>Add / Change Image</th>
                  <th style={{ borderBottom: '1px solid gray', borderTop:'1px solid gray',padding:"2%" }}>Upload</th>
                </tr>
              </thead>
              <tbody>
                {colorValues.map((color, index) => (
                  <tr key={index}>
                    <td style={{  color:"rgba(0,0,0,0.8)",padding:"3%" }}>{color}</td>
                    <td style={{  padding:"3%", justifyContent:"center",alignItems:"center",display:"flex" }}>
                      {thumbnailUrls[color] ? (
                        <img
                          src={thumbnailUrls[color]}
                          alt={`${color}`}
                          style={{ width: '20%', height: 'auto' }} // Adjust size as needed
                        />
                      ):(
                          <img
                          src="data:image/png;base64,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"
                          alt={`${color}`}
                          style={{ width: '30%', height: 'auto' }} // Adjust size as needed
                        />
                  
                      )}
                    </td>
                    {/* <td style={{  padding:"3%", justifyContent:"center",alignItems:"center",display:"flex" }}>
                      {thumbnailUrls[color] ? (
                        <img
                          src={thumbnailUrls[color]}
                          alt={`${color}`}
                          style={{ width: '100%', height: 'auto' }} // Adjust size as needed
                        />
                      ):(
                          <img
                          src="data:image/png;base64,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"
                          alt={`${color}`}
                          style={{ width: '60%', height: 'auto' }} // Adjust size as needed
                        />
                  
                      )}
                    </td> */}
                   <td>
    <label>
      <input type="file" hidden onChange={({ target }) => {
        if (target.files) {
          handleImageChange(color, target.files[0]);
        }
      }} />
      <div className="w-40 aspect-video rounded flex items-center justify-center 
      border-2 border-dashed cursor-pointer">
        {selectedImages[color] ? (
          <img src={selectedImages[color]} alt={color} style={{width:"25%", height:"auto"}}/>
        ) : (
          <span>{thumbnailUrls[color] ? "Change Image" : "Add Image"}</span> 
        )}
      </div>
    </label>
    
  </td>
  
                    <td style={{  padding:"3%" }}>
                      <Button variant="outlined" color='secondary' disabled={uploading} endIcon={<SendIcon />} onClick={() => handleImageUpload(color)} style={{ opacity: uploading ? ".5" : "1", padding:"3% 6%"}}>
                      {uploading ? "Uploading..." : "Upload"}
  
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    );
  };

export const config: WidgetConfig = {
    zone: "product.details.after",
};

export default ProductWidget;