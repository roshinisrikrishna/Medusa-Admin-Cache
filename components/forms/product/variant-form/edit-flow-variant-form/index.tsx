import CustomsForm, { CustomsFormType } from "../../customs-form"
import DimensionsForm, { DimensionsFormType } from "../../dimensions-form"
import MetadataForm, { MetadataFormType } from "../../../general/metadata-form"
import { UseFormReturn, useFieldArray } from "react-hook-form"
import VariantGeneralForm, {
  VariantGeneralFormType,
} from "../variant-general-form"
import VariantStockForm, { VariantStockFormType } from "../variant-stock-form"
import VariantSelectOptionsForm, {
  VariantOptionValueType,
  VariantSelectOptionsFormType,
} from "../variant-select-options-form"

import Accordion from "../../../../organisms/accordion"
import IconTooltip from "../../../../molecules/icon-tooltip"
import InputField from "../../../../molecules/input"
import { PricesFormType } from "../../../general/prices-form"
import { nestedForm } from "../../../../../utils/nested-form"
import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"
import { useParams } from 'react-router-dom';
import { useProduct } from "medusa-react"
import { ProductOption } from "@medusajs/medusa"
import InputError from "../../../../atoms/input-error"


export type EditFlowVariantFormType = {
  /**
   * Used to identify the variant during product create flow. Will not be submitted to the backend.
   */
  _internal_id?: string
  general: VariantGeneralFormType
  prices: PricesFormType
  stock: VariantStockFormType
  options: VariantSelectOptionsFormType
  customs: CustomsFormType
  dimensions: DimensionsFormType
  metadata: MetadataFormType
}

type Props = {
  form: UseFormReturn<EditFlowVariantFormType, any>
  isEdit?: boolean
  productId: string
  option: ProductOption
  onCreateOption: (optionId: string, value: string) => void
}

/**
 * Re-usable Product Variant form used to add and edit product variants.
 * @example
 * const MyForm = () => {
 *   const form = useForm<VariantFormType>()
 *   const { handleSubmit } = form
 *
 *   const onSubmit = handleSubmit((data) => {
 *     // do something with data
 *   })
 *
 *   return (
 *     <form onSubmit={onSubmit}>
 *       <VariantForm form={form} />
 *       <Button type="submit">Submit</Button>
 *     </form>
 *   )
 * }
 */
const EditFlowVariantForm = ({ form, isEdit, option, onCreateOption }: Props) => {
  const { isFeatureEnabled } = useFeatureFlag()
  const { fields } = useFieldArray({
    control: form.control,
    name: "options",
  })
  console.log('fields', fields)
  console.log('form', form)
  const showStockAndInventory = !isEdit || !isFeatureEnabled("inventoryService")

  const pathSegments = location.pathname.split('/');
  const productIdIndex = pathSegments.findIndex(segment => segment === 'products') + 1;
  const productId = pathSegments[productIdIndex];
    console.log('Product ID from URL:', productId);

    const { product, isLoading } = useProduct(productId)

   // Check if product and product.options are defined
  if (!product || !product?.options) {
    console.log('Product or product options are undefined', product?.options);
    return; // Or handle this case as needed
  }


 const productOptionsTemplate = fields.map(field => {
  // Check if product.options is defined and find the corresponding option
  const matchingOption = product?.options?.find(option => option.title === field.title);

  // If a matching option is found, map over its values
  if (matchingOption) {
    return matchingOption.values.map(value => ({
      label: value.value,
      value: value.value,
      option_id: field.option_id, // Adjust as needed to match your data structure
    }));
  }

  return [];
}).flat(); // Flatten the array of arrays into a single array

  

  console.log('product.', product.options)
  console.log('Product Options Template:', productOptionsTemplate);
console.log('fields', fields)
  // console.log('location.pathname', location.pathname)

  return (
    <Accordion type="multiple" defaultValue={["general"]}>
      <Accordion.Item title="General" value="general" required>
        <div>
          <VariantGeneralForm form={nestedForm(form, "general")} />
          <div className="mt-xlarge">
            <div className="mb-base gap-x-2xsmall flex items-center">
              <h3 className="inter-base-semibold">Options</h3>
              <IconTooltip
                type="info"
                content="Options are used to define the color, size, etc. of the variant."
              />
            </div>
            <VariantSelectOptionsForm
              form={nestedForm(form, "options")}
              options={productOptionsTemplate}
              onCreateOption={onCreateOption}
            />
            <InputError errors={form.formState.errors} name="options" />
       
            {/* <div className="gap-large pb-2xsmall grid grid-cols-2">
              {fields.map((field, index) => {
                return (
                  <InputField
                    required
                    key={field.id}
                    label={field.title}
                    {...form.register(`options.${index}.value`, {
                      required: `Option value for ${field.title} is required`,
                    })}
                    errors={form.formState.errors}
                  />
                )
              })}
            </div> */}
          </div>
        </div>
      </Accordion.Item>
      {showStockAndInventory && (
        <Accordion.Item title="Stock & Inventory" value="stock">
          <VariantStockForm form={nestedForm(form, "stock")} />
        </Accordion.Item>
      )}
      <Accordion.Item title="Shipping" value="shipping">
        <p className="inter-base-regular text-grey-50">
          Shipping information can be required depending on your shipping
          provider, and whether or not you are shipping internationally.
        </p>
        <div className="mt-large">
          <h3 className="inter-base-semibold mb-2xsmall">Dimensions</h3>
          <p className="inter-base-regular text-grey-50 mb-large">
            Configure to calculate the most accurate shipping rates.
          </p>
          <DimensionsForm form={nestedForm(form, "dimensions")} />
        </div>
        {showStockAndInventory && (
          <div className="mt-xlarge">
            <h3 className="inter-base-semibold mb-2xsmall">Customs</h3>
            <p className="inter-base-regular text-grey-50 mb-large">
              Configure if you are shipping internationally.
            </p>
            <CustomsForm form={nestedForm(form, "customs")} />
          </div>
        )}
      </Accordion.Item>
      <Accordion.Item title="Metadata" value="metadata">
        <p className="inter-base-regular text-grey-50 mb-base">
          Metadata can be used to store additional information about the
          variant.
        </p>
        <MetadataForm form={nestedForm(form, "metadata")} />
      </Accordion.Item>
    </Accordion>
  )
}

export default EditFlowVariantForm
