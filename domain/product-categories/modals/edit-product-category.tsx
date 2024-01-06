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
      console.log('response', response.data.data[0].categorythumbnail)
      if(response && response.data && response.data.data[0])
      {
        setImageUrl(response.data.data[0].categorythumbnail || "");
        setImageUrlNav(response.data.data[0].navimage || "");
      }
    
    } catch (error) {
      console.error(`Error fetching image for category ${activeCategory.id}:`, error);
      // Handle error here, e.g., show an error notification
    }
  };

  // Call fetchImageUrls when component mounts or activeCategory changes
  useEffect(() => {
    if (activeCategory) {
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
  <InputField
    type="text"
    value={imageUrl}
    onChange={(e) => {
      setImageUrl(e.target.value)
    }}
    placeholder={t("modals-enter-image-url", "Enter image URL")}
    className="text-sm text-grey-90"
  />
</div>
<div className="mb-8">
  <label className="inter-base-semibold mb-2 block">
    {t("modals-image", " Navigation Bar Image URL")}
  </label>
  
  <InputField
  type="text"
  defaultValue={imageUrlNav}
  onChange={(e) => setImageUrlNav(e.target.value)}
  onFocus={() => trigger("description")} // Trigger when the field is focused
  placeholder={t("modals-enter-image-url_navbar", "Enter image URL for navigation bar")}
  className="text-sm text-grey-90"
/>

</div>

        </div>
      </div>
    </SideModal>
  )
}

export default EditProductCategoriesSideModal