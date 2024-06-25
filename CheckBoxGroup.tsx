import { Controller, useFormContext } from "react-hook-form";
import { inputValidator } from "../../../../library/utilities/helperFunction";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { useState } from "react";
import { IFormFieldType } from "../../../../library/utilities/constant";
import { IFormProps } from "../formInterface/forms.model";
import { FormFieldError } from "../formFieldError/FormFieldError";

export const CheckBoxGroup = (props: IFormProps) => {
  const { attribute, form, fieldType } = props;
  const { label, options } = form[attribute];
  const { required, disabled } = form[attribute].rules;
  const {
    control,
    getValues,
    formState: { errors },
  } = useFormContext();

  let selectedValue: number[] = getValues(attribute) || [];
  const [selectedOptions, setSelectedOptions] =
    useState<number[]>(selectedValue);

  const getClassNames = () => {
    let labelClassName = "";
    let fieldClassName = "";
    let divClassName = "";

    switch (fieldType) {
      case IFormFieldType.NO_LABEL:
        labelClassName = "";
        fieldClassName = "field p-fluid";
        divClassName = "grid";
        break;
      case IFormFieldType.TOP_LABEL:
        labelClassName = "";
        fieldClassName = "field p-fluid";
        divClassName = "grid flex flex-column";
        break;
      default:
        labelClassName = "col-12 mb-3 md:col-3 md:mb-0";
        fieldClassName = "field grid";
        divClassName = "col-12 mt-3 md:col-9 grid relative";
        break;
    }

    return { labelClassName, fieldClassName, divClassName };
  };
  const { labelClassName, fieldClassName, divClassName } = getClassNames();

  const labelElement = (
    <label htmlFor={attribute} className={labelClassName}>
      {label} {required && "*"}
    </label>
  );

  const onChange = (e: CheckboxChangeEvent, field: any) => {
    const selectedValue = e.checked
      ? [...selectedOptions, e.value]
      : selectedOptions.filter((value) => value !== e.value);
    setSelectedOptions(selectedValue.map((value) => Number(value)));
    field.onChange(selectedValue.map((value) => Number(value)));
  };
  return (
    <div className={fieldClassName}>
      {fieldType !== IFormFieldType.NO_LABEL && labelElement}
      <div className={divClassName}>
        {options &&
          options.map((option) => {
            return (
              <div className="md:col-4" key={option.value}>
                <Controller
                  name={attribute}
                  control={control}
                  rules={inputValidator(form[attribute].rules, label)}
                  render={({ field }) => (
                    <Checkbox
                      inputId={option.label}
                      value={option.value}
                      onChange={(e) => onChange(e, field)}
                      checked={selectedOptions.includes(Number(option.value))}
                      className={errors[attribute] ? "p-invalid" : ""}
                      disabled={disabled}
                    />
                  )}
                />
                <label htmlFor={option.label} className="ml-2">
                  {option.label}
                </label>
              </div>
            );
          })}
        <FormFieldError data={{ errors, name: attribute }} />
      </div>
    </div>
  );
};
