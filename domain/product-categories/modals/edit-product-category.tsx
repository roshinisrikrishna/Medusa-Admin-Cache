import { useEffect, useState } from "react"
import { ProductCategory } from "@medusajs/medusa"
import { useAdminUpdateProductCategory } from "medusa-react"
import { TFunction } from "i18next"
import { useTranslation } from "react-i18next"

import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import InputField from "../../../components/molecules/input"
import TextArea from "../../../components/molecules/textarea"
import SideModal from "../../../components/molecules/modal/side-modal"
import { NextSelect } from "../../../components/molecules/select/next-select"
import useNotification from "../../../hooks/use-notification"
import { Option } from "../../../types/shared"
import { getErrorMessage } from "../../../utils/error-messages"
import TreeCrumbs from "../components/tree-crumbs"
import MetadataForm, {
  getSubmittableMetadata,
} from "../../../components/forms/general/metadata-form"
import { Controller, useForm } from "react-hook-form"
import { nestedForm } from "../../../utils/nested-form"
import { CategoryFormData, CategoryStatus, CategoryVisibility } from "./add-product-category"
import { getDefaultCategoryValues } from "../utils"
import axios from 'axios';


const visibilityOptions: (t: TFunction) => Option[] = (t) => [
  {
    label: "Public",
    value: CategoryVisibility.Public,
  },
  { label: "Private", value: CategoryVisibility.Private },
]

const statusOptions: (t: TFunction) => Option[] = (t) => [
  { label: "Active", value: CategoryStatus.Active },
  { label: "Inactive", value: CategoryStatus.Inactive },
]

type EditProductCategoriesSideModalProps = {
  activeCategory: ProductCategory
  close: () => void
  isVisible: boolean
  categories: ProductCategory[]
}
/**
 * Modal for editing product categories
 */
function EditProductCategoriesSideModal(
  props: EditProductCategoriesSideModalProps
) {
  const { isVisible, close, activeCategory, categories } = props

  const { t } = useTranslation()
  const notification = useNotification()

  const { mutateAsync: updateCategory } = useAdminUpdateProductCategory(
    activeCategory?.id
  )

  

  const form = useForm<CategoryFormData>({
    defaultValues: getDefaultCategoryValues(t, activeCategory),
    mode: "onChange",
  })

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    trigger,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = form

  useEffect(() => {
    if (activeCategory) {
      reset(getDefaultCategoryValues(t, activeCategory))
    }
  }, [activeCategory, reset])

  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);
const [finalImageUrlNav, setFinalImageUrlNav] = useState<string | null>(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('myImage', file);

    console.log('formData', formData)
  
    // Replace this URL with your actual image upload endpoint
    const uploadUrl = 'http://localhost:9000/store/imageUpload';
  
    try {
      const response = await axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Extract and update the image URL
      const imageUrl = response.data.file.url;
      console.log('imageUrl', imageUrl)
      setImageUrl(imageUrl);
      setFinalImageUrl(imageUrl); // Update state with the new URL

    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  
  const handleImageUploadNav = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('myImage', file);

    console.log('formData', formData)
  
    // Replace this URL with your actual image upload endpoint
    const uploadUrl = 'http://localhost:9000/store/imageUpload';
  
    try {
      const response = await axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Extract and update the image URL
      const imageUrl = response.data.file.url;
      console.log('imageUrl', imageUrl)
      setImageUrlNav(imageUrl);
      setFinalImageUrlNav(imageUrlNav); // Update state with the new URL

    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleImageUpdate = async (finalImageUrl: string | null, finalImageUrlNav: string | null) => {
    try {
      
      const response = await axios.post('http://localhost:9000/store/categoryImage', {
        category_id: activeCategory.id,
        categorythumbnail: finalImageUrl,
        navimage: finalImageUrlNav
      });
  
      console.log('Image update successful:', response.data);
    } catch (error) {
      console.error('Error updating category image:', error);
    }
  };
  
  
  const onSave = async (data: CategoryFormData) => {
    try {
      const finalImageUrl = imageUrl.trim() === "" ? null : imageUrl;
      const finalImageUrlNav = imageUrlNav.trim() === "" ? null : imageUrlNav;
  
      console.log("Active Category ID:", activeCategory.id);
      console.log("image ", finalImageUrl);
  
      // Call the function to update the image
    
      if (finalImageUrl || finalImageUrlNav) {
        await handleImageUpdate(finalImageUrl, finalImageUrlNav);
      }
  
      await updateCategory({
        name: data.name,
        handle: data.handle,
        description: data.description,
        is_active: data.is_active.value === CategoryStatus.Active,
        is_internal: data.is_public.value === CategoryVisibility.Private,
        metadata: getSubmittableMetadata(data.metadata),
      })
  
      notification(
        t("modals-success", "Success"),
        t("modals-successfully-updated-the-category", "Successfully updated the category"),
        "success"
      )
      close()
    } catch (e) {
      const errorMessage = getErrorMessage(e) || 
        t("modals-failed-to-update-the-category", "Failed to update the category")
      notification(t("modals-error", "Error"), errorMessage, "error")
    }
  }
  

  const onClose = () => {
    close()
  }

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageUrlNav, setImageUrlNav] = useState<string>('');

  console.log('imageUrl', imageUrl)
  console.log('imageUrlNav', imageUrlNav)

 
  // Function to fetch image URLs
  const fetchImageUrls = async () => {
    try {
      const response = await axios.get(`http://localhost:9000/store/categoryImage`, {
        params: { category_id: activeCategory.id }
      });
      console.log('response.data.data[0].categorythumbnail', response.data.data[0].categorythumbnail)
      console.log('response.data.data[0].navimage', response.data.data[0].navimage)

      if (response && response.data && response.data.data[0]) {
        setImageUrl(response.data.data[0].categorythumbnail || "");
        setImageUrlNav(response.data.data[0].navimage || "");
      } else {
        // Set imageUrl and imageUrlNav to empty strings if no data is found
        setImageUrl("");
        setImageUrlNav("");
      }
    } catch (error) {
      console.error(`Error fetching image for category ${activeCategory.id}:`, error);
      setImageUrl("");
      setImageUrlNav("");
    }
  };
  
  

  // Call fetchImageUrls when component mounts or activeCategory changes

  useEffect(() => {
    if (activeCategory) {
      setFinalImageUrl(null);
      setFinalImageUrlNav(null);
      fetchImageUrls();
    }
  }, [activeCategory]);
  

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImageFile(file);
  };
  return (
    <SideModal close={onClose} isVisible={!!isVisible}>
      <div className="flex h-full flex-col justify-between overflow-auto">
        {/* === HEADER === */}
        <div className="flex items-center justify-between p-6">
          <Button
            size="small"
            variant="secondary"
            className="h-8 w-8 p-2"
            onClick={props.close}
          >
            <CrossIcon size={20} className="text-grey-50" />
          </Button>
          <div className="gap-x-small flex">
            <Button
              size="small"
              variant="primary"
              disabled={!isDirty || !isValid || isSubmitting}
              onClick={handleSubmit(onSave)}
              className="rounded-rounded"
            >
              {t("modals-save-category", "Save category")}
            </Button>
          </div>
        </div>
        <h3 className="inter-large-semibold flex items-center gap-2 text-xl text-gray-900 px-6">
          {t("modals-edit-product-category", "Edit product category")}
        </h3>
        {/* === DIVIDER === */}
        <div className="block h-[1px] bg-gray-200" />

        {activeCategory && (
          <div className="mt-[25px] px-6">
            <TreeCrumbs nodes={categories} currentNode={activeCategory} />
          </div>
        )}

        <div className="flex-grow px-6">
          <InputField
            required
            label={t("modals-name", "Name") as string}
            type="string"
            className="my-6"
            placeholder={
              t(
                "modals-give-this-category-a-name",
                "Give this category a name"
              ) as string
            }
            {...register("name", { required: true })}
          />

          <InputField
            label={t("modals-handle", "Handle") as string}
            className="my-6"
            type="string"
            placeholder={
              t("modals-custom-handle", "Custom handle") as string
            }
            {...register("handle")}
          />

          <TextArea
            label={t("modals-description", "Description")}
            className="my-6"
            placeholder={
              t(
                "modals-give-this-category-a-description",
                "Give this category a description"
              ) as string
            }
            {...register("description")}
          />

          <Controller
            name="is_active"
            control={control}
            rules={{ required: true }}
            render={({ field }) => {
              return (
                <NextSelect
                  {...field}
                  label={t("modals-status", "Status") as string}
                  placeholder="Choose status"
                  options={statusOptions(t)}
                  value={
                    statusOptions(t)[field.value?.value === CategoryStatus.Active ? 0 : 1]
                  }
                />
              )
            }}
          />

          <Controller
            name="is_public"
            control={control}
            rules={{ required: true }}
            render={({ field }) => {
              return (
                <NextSelect
                  {...field}
                  className="my-6"
                  label={t("modals-visibility", "Visibility") as string}
                  placeholder="Choose visibility"
                  options={visibilityOptions(t)}
                  value={
                    visibilityOptions(t)[field.value.value === CategoryVisibility.Public ? 0 : 1]
                  }
                />
              )
            }}
          />
          <div className="mt-small mb-xlarge">
            <h2 className="inter-base-semibold mb-base">
              {t("collection-modal-metadata", "Metadata")}
            </h2>
            <MetadataForm form={nestedForm(form, "metadata")} />
          </div>
          <div className="mb-8">
  <label className="inter-base-semibold mb-2 block">
    {t("modals-image", "Image URL")}
  </label>
  {/* Display image if imageUrl is not empty */}
  {imageUrl ? (
    <img
      src={imageUrl}
      alt="Category Image"
      style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }}
    />
  ):(
    <img
       src="data:image/png;base64,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"
      alt="Category Image"
      style={{ maxWidth: '20%', height: 'auto', marginBottom: '10px' }}
    />
  )}
  {/* <InputField
    type="text"
    value={imageUrl}
    onChange={(e) => setImageUrl(e.target.value)}
    placeholder={t("modals-enter-image-url", "Enter image URL")}
    className="text-sm text-grey-90"
  /> */}
  <InputField
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
  className="text-sm text-grey-90"
/>
</div>

<div className="mb-8">
  <label className="inter-base-semibold mb-2 block">
    {t("modals-image", " Navigation Bar Image URL")}
  </label>
  {/* Display image if imageUrlNav is not empty */}
  {imageUrlNav ? (
    <img
      src={imageUrlNav}
      alt="Navigation Bar Image"
      style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }}
    />
  ):(
    <img
       src="data:image/png;base64,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"
      alt="Category Image"
      style={{ maxWidth: '20%', height: 'auto', marginBottom: '10px' }}
    />
  )}
  {/* <InputField
    type="text"
    value={imageUrlNav}
    onChange={(e) => setImageUrlNav(e.target.value)}
    placeholder={t("modals-enter-image-url_navbar", "Enter image URL for navigation bar")}
    className="text-sm text-grey-90"
  /> */}
  <InputField
  type="file"
  accept="image/*"
  onChange={handleImageUploadNav}
  className="text-sm text-grey-90"
/>
</div>

{/* <div>
<label className="inter-base-semibold mb-2 block">
  {t("modals-image", "Image")}
</label>
<InputField
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
  className="text-sm text-grey-90"
/>

</div>
<div>
<label className="inter-base-semibold mb-2 block">
  {t("modals-image", "Image Navbar")}
</label>
<InputField
  type="file"
  accept="image/*"
  onChange={handleImageUploadNav}
  className="text-sm text-grey-90"
/>

</div> */}

        </div>
      </div>
    </SideModal>
  )
}

export default EditProductCategoriesSideModal
