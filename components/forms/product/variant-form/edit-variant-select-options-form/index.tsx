import { Controller, useFieldArray } from "react-hook-form"
import { NestedForm } from "../../../../../utils/nested-form"
import { NextCreateableSelect } from "../../../../molecules/select/next-select"

export type VariantOptionValueType = {
  option_id: string
  value: string
  label: string
  isDisabled?: boolean
}

export type VariantOptionType = {
  option_id: string
  title: string
  option: VariantOptionValueType | null
}

export type EditVariantSelectOptionsFormType = VariantOptionType[]

type Props = {
  form: NestedForm<EditVariantSelectOptionsFormType>
  options: VariantOptionValueType[]
  onCreateOption: (optionId: string, value: string) => void
  onOptionChange: (selectedOption: VariantOptionValueType, field: VariantOptionType) => void;

}

const EditVariantSelectOptionsForm = ({ form, options, onCreateOption, onOptionChange }: Props) => {
  const { control, path } = form

  const { fields } = useFieldArray({
    control: form.control,
    name: path(),
    keyName: "fieldId",
  })

  return (
    <div className="gap-large pb-2xsmall grid grid-cols-2">
      {fields.map((field, index) => {
  return (
    <Controller
      key={field.fieldId}
      control={control}
      name={path(`${index}.option`)}
      render={({ field: { value, onChange, onBlur, ref } }) => {
        // Custom onChange handler
        const handleChange = (selectedOption) => {
          // Call the callback passed from the parent component
          onOptionChange(selectedOption, field);
        
          // Original onChange function call
          onChange(selectedOption);
        };
        

        return (
          <NextCreateableSelect
            ref={ref}
            value={value}
            onChange={handleChange} // Use the custom onChange handler
            onBlur={onBlur}
            label={field.title}
            placeholder="Choose an option"
            required
            options={
              options.filter((o) => o.option_id === field.id) || []
            }
            onCreateOption={(value) => {
              const newOption = {
                option_id: field.option_id,
                value: value,
                label: value,
              };

              onCreateOption(field.option_id, value);

              // You might want to log here as well
              console.log("New Option Created:", newOption);

              onChange(newOption);
            }}
          />
        );
      }}
    />
  );
})}

    </div>
  )
}

export default EditVariantSelectOptionsForm
