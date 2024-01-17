import type { 
    WidgetConfig, 
    ProductDetailsWidgetProps,
  } from "@medusajs/admin"
  import axios from 'axios'
  import { Product, ProductVariant } from "@medusajs/medusa"
  import { useEffect,useState } from 'react'
  import Medusa from "@medusajs/medusa-js"


  const ProductWidget = ({
    product,
    notify,
  }: ProductDetailsWidgetProps) => {

    const medusa = new Medusa({ baseUrl: "http://localhost:9000", maxRetries: 3 })
    medusa.products.retrieve(product.id)
    .then(({ product }) => {
      console.log("product medusa ",product);
    })
    const colorOptionId = product.options.find(option => option.title.toLowerCase() === "color")?.id;

    let colorValues = [];

    if (colorOptionId) {
        colorValues = product.variants
            .map((variant: ProductVariant) => {
                const foundOptionValue = variant.options.find(optionValue => optionValue.option_id === colorOptionId);
                return foundOptionValue ? foundOptionValue.value : "";
            })
            .filter(value => value !== "") // Filter out empty values
            .filter((value, index, self) => self.indexOf(value) === index); // Filter out duplicates
    }

    // console.log('colorOptionId', colorOptionId)
    // console.log('colorValues', colorValues)
    
    // console.log('colorValues[0]', colorValues[0])

    // Function to create the handle
  const createHandle = () => {
    // if (colorValues.length > 0) {
    //   const title = product.title.toLowerCase().replace(/\s+/g, '-');
    //   const color = colorValues[0].toLowerCase().replace(/\s+/g, '-');
    //   return `${title}`;
    // }
    return product.title.toLowerCase().replace(/\s+/g, '-');
  }

  // Calling the function to get the handle
  const handle = createHandle();

  useEffect(() => {
    const updateHandle = async () => {
      if (product.handle === handle) {
        try {
          const response = await axios.post('http://localhost:9000/store/updateHandle', {
            id: product.id,
            color: colorValues[0],
          });
          // console.log('Response for updating handle:', response.data);
        } catch (error) {
          console.error('Error updating handle:', error);
        }
      }
    };

    updateHandle();
  }, [product, handle]); // Dependency array includes product and handle

  
  //   console.log("product sample ",product)

     // Create a new Set to track unique variant IDs
  const uniqueVariantIds = new Set();

  const allPrices = product.variants.reduce((acc, variant) => {
    // Check if the variant's ID has already been processed
    if (!uniqueVariantIds.has(variant.id)) {
      uniqueVariantIds.add(variant.id); // Add the variant ID to the Set

      if (variant.prices && Array.isArray(variant.prices)) {
        // console.log('variant prices', variant)
        // console.log('variant.prices', variant.prices)
        return acc.concat(variant.prices[0]);
      }
    }
    return acc;
  }, []);

      
    //   console.log("allprices ",allPrices);
    //   console.log("variants ",product.variants)
      const countUndefinedPrices = allPrices.filter(price => price === undefined).length;

//   console.log("Number of undefined prices:", countUndefinedPrices);

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

  // Check and call API if countUndefinedPrices > 0
  if (countUndefinedPrices > 0) {
    updateProductStatus();
  }

  const [thumbnailUrls, setThumbnailUrls] = useState({});
  const [count, setCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState(""); // New state for error message
// State to represent the condition
const [isConditionMet, setIsConditionMet] = useState(false);

// Update the condition state based on relevant dependencies
useEffect(() => {
  const condition = countUndefinedPrices === 0 && product.thumbnail && product.categories.length > 0 && product.images.length > 0 && product.status === "draft";
  setIsConditionMet(condition);
}, [countUndefinedPrices, product.thumbnail, product.categories.length, product.images.length, product.status]);


  // Fetch image URLs for each color
  const fetchImageUrls = async () => {
    let missingCount = 0;
    let errorMsg = "";

  
    const urls = await Promise.all(colorValues.map(async (color) => {
      const modifiedOptionId = `${color.toLowerCase()}${colorOptionId}`;
      try {
        const response = await axios.get(`http://localhost:9000/store/colorImage`, {
            params: { option_id: modifiedOptionId }
        });
  
        // Check if the response has data and a thumbnail
        const imageData = response.data.data[0];
        if (imageData && imageData.thumbnail) {
          return { color, url: imageData.thumbnail };
        } else {
          missingCount++;
          return { color, url: "" };
        }
      } catch (error) {
        missingCount++;
        errorMsg = `Error fetching images in product ${product.title}`; // Set error message
        console.error(`Error fetching image for color ${color}:`, error);
        console.log('errorMsg', errorMsg)
        return { color, url: "" };
      }
    }));
  
    // Update the count and imageUrls state
    setCount(missingCount);
    setErrorMessage(errorMsg); // Update error message state

  
    const newImageUrls = urls.reduce((acc, { color, url }) => {
      acc[color] = url;
      return acc;
    }, {});
  
    setThumbnailUrls(newImageUrls);
  };
  

  // Call fetchImageUrls when component mounts or colorValues change
  useEffect(() => {
    // Call fetchImageUrls when component mounts or colorValues change
    fetchImageUrls();
  }, []); // Adding colorValues as a dependency

 
  useEffect(() => {
    if (count > 0) {
      updateProductStatus();
    }
  }, [count]); // Dependency array

//   console.log('thumbnailUrls', thumbnailUrls)

useEffect(() => {
  if (product.images.length <= 0) {
    updateProductStatus();
  }
}, [product.images.length]); // Dependency array

useEffect(() => {
  if (!product.thumbnail) {
    updateProductStatus();
  }
}, [product.thumbnail]); // Dependency array

useEffect(() => {
  if (product.categories.length <= 0) {
    updateProductStatus();
  }
}, [product.categories.length]); // Dependency array
  
//   // Additional useEffect to call publishProduct API
  useEffect(() => {
    const publishProduct = async () => {
      try {
        console.log('product publish id', product.id)
        const response = await axios.post('http://localhost:9000/store/publishProduct', {
          id: product.id
        });
        // console.log("Product published successfully", response.data);
        // You can add notification or other actions here
      } catch (error) {
        console.error("Error publishing product:", error);
        // Add error handling or notification here
      }
    };

//     // Call the publishProduct function only when count and countUndefinedPrices are both zero
    if (count === 0 && countUndefinedPrices === 0 && product.images.length > 0
      && product.thumbnail && product.categories.length > 0) {
      publishProduct();
    }
  }, [count, countUndefinedPrices, product.id, product]);

  console.log('errorMessage', errorMessage)
  
return (
    <>
    {count>0 || product.images.length <= 0 || !product.thumbnail || product.categories.length <= 0  || countUndefinedPrices > 0 ? (
        <div style={{ background: "white", padding: '20px' }}>
          {errorMessage && (
        <div style={{ color: "red", padding: '20px',background:"green" }}>
          {errorMessage}
        </div>
      )}
      {/* {isConditionMet && (
          <div style={{ color: "red" }}>
        Error: Please assign images for each color of the product {product.title}
      </div>
      )} */}
      {count > 0 && (
        <div style={{ color: "red" }}>
          Error: Please assign images for each color of the product {product.title}
        </div>
      )}
      {countUndefinedPrices > 0 && (
        <div style={{ color: "red" }}>
          Error: Please add price for each variant of the product {product.title}
        </div>
      )}
        {product.categories.length <= 0 && (
        <div style={{ color: "red" }}>
          Error: Please add category for the product {product.title}
        </div>
      )}
      {!product.thumbnail  && (
        <div style={{ color: "red" }}>
          Error: Please add Thumbnail for the product {product.title}
        </div>
      )}
      {product.images.length <= 0 && (
        <div style={{ color: "red" }}>
          Error: Please add Media Images for the product {product.title}
        </div>
      )}
    </div>
    ):
    (
        <div style={{background:"transparent"}}>

        </div>
    )}
    
    </>
  );
};
  
  export const config: WidgetConfig = {
    zone: "product.details.before",
  }
  
  export default ProductWidget