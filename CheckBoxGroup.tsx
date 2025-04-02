import { Controller, useFormContext, useWatch } from "react-hook-form";
import { inputValidator } from "../../../../library/utilities/helperFunction";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { IFormFieldType } from "../../../../library/utilities/constant";
import { IFormProps } from "../formInterface/forms.model";
import { FormFieldError } from "../formFieldError/FormFieldError";
import { useMemo } from "react";

export const CheckBoxGroup = (props: IFormProps) => {
  const { attribute, form, fieldType } = props;
  const { label, options, extraLabelElementContent } = form[attribute];
  const { required, disabled, itemPerRow = 2 } = form[attribute].rules;
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const selectedValues: number[] = useWatch({
    name: attribute,
    defaultValue: [],
  });

  const { labelClassName, fieldClassName, divClassName } = useMemo(() => {
    switch (fieldType) {
      case IFormFieldType.NO_LABEL:
      case IFormFieldType.TOP_LABEL:
        return {
          labelClassName: "",
          fieldClassName: "field p-fluid",
          divClassName: "grid",
        };
      default:
        return {
          labelClassName: "col-12 mt-2 mb-3 md:col-3 md:mb-0",
          fieldClassName: "field grid",
          divClassName: "col-12 mt-2 md:col-9 grid relative",
        };
    }
  }, [fieldType]);

  const labelElement = (
    <label htmlFor={attribute} className={labelClassName}>
      <span className="capitalize-first">
        {label} {required && "*"}
      </span>
      {extraLabelElementContent && extraLabelElementContent}
    </label>
  );
  const widthStyle = { width: `${100 / itemPerRow}%` };

  const onChange = (e: CheckboxChangeEvent, field: any) => {
    const selectedValue = e.checked
      ? [...selectedValues, e.value]
      : selectedValues.filter((value) => value !== e.value);
    field.onChange(selectedValue.map((value) => Number(value)));
  };

  return (
    <div className={fieldClassName}>
      {fieldType !== IFormFieldType.NO_LABEL && labelElement}
      <div className={divClassName}>
        {options &&
          options.map((option) => {
            return (
              <div className="p-2" key={option.value} style={widthStyle}>
                <Controller
                  name={attribute}
                  control={control}
                  rules={inputValidator(form[attribute].rules, label)}
                  render={({ field }) => (
                    <Checkbox
                      inputId={option.label}
                      value={option.value}
                      onChange={(e) => onChange(e, field)}
                      checked={selectedValues.includes(Number(option.value))}
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
