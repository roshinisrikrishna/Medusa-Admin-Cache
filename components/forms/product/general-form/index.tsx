import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"
import InputField from "../../../molecules/input"
import TextArea from "../../../molecules/textarea"

export type GeneralFormType = {
  title: string
  subtitle: string
  handle: string
  material: string | null
  description: string
}

type Props = {
  form: NestedForm<GeneralFormType>
  requireHandle?: boolean
  isGiftCard?: boolean
}

const GeneralForm = ({ form, requireHandle = true, isGiftCard }: Props) => {
  const {
    register,
    path,
    formState: { errors },
  } = form

  return (
    <div>
      <div className="gap-x-large mb-small grid grid-cols-2">
        <InputField
          label="Title"
          placeholder={isGiftCard ? "Gift Card" : "Winter Jacket"}
          required
          {...register(path("title"), {
            required: "Title is required",
            minLength: {
              value: 1,
              message: "Title must be at least 1 character",
            },
            pattern: FormValidator.whiteSpaceRule("Title"),
          })}
          errors={errors}
        />
        <InputField
          label="Description"
          placeholder="Warm and cozy..."
          required
          {...register(path("subtitle"), {
            required: "Description is required",
            minLength: {
              value: 1,
              message: "Description must be at least 1 character",
            },
            pattern: FormValidator.whiteSpaceRule("Subtitle"),
          })}
          errors={errors}
        />
      </div>
      <p className="inter-base-regular text-grey-50 mb-large">
        Give your {isGiftCard ? "gift card" : "product"} a short and clear
        title.
        <br />
        50-60 characters is the recommended length for search engines.
      </p>
      <div className="gap-x-large mb-large grid grid-cols-2">
        <InputField
          label="Handle"
          tooltipContent={
            !requireHandle
              ? `The handle is the part of the URL that identifies the ${
                  isGiftCard ? "gift card" : "product"
                }. If not specified, it will be generated from the title.`
              : undefined
          }
          placeholder={isGiftCard ? "gift-card" : "winter-jacket-black-beauty"}
          required={requireHandle}
          {...register(path("handle"), {
            required: requireHandle ? "Handle is required" : undefined,
            minLength: FormValidator.minOneCharRule("Handle"),
            pattern: FormValidator.whiteSpaceRule("Handle"),
          })}
          prefix="/"
          errors={errors}
        />
        {/* <InputField
          label="Material"
          placeholder={isGiftCard ? "Paper" : "100% Cotton"}
          {...register(path("material"), {
            minLength: FormValidator.minOneCharRule("Material"),
            pattern: FormValidator.whiteSpaceRule("Material"),
          })}
          errors={errors}
        /> */}
      </div>
      <TextArea
        label="Product Details"
        required
        placeholder={
          isGiftCard ? "The gift card is..." : `          .100% Cotton
          .Imported...`
        }
        rows={3}
        className="mb-small"
        {...register(path("description"),{
          required: "Product Details is required",
          minLength: FormValidator.minOneCharRule("description"),
        })}
        errors={errors}
      />
      <p className="inter-base-regular text-grey-50">
        Give your {isGiftCard ? "gift card" : "product"} a list of details describing the product.
        <br />
        120-160 characters is the recommended length for search engines.
      </p>
    </div>
  )
}

export default GeneralForm
