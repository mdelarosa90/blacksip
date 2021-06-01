import clsx from "clsx";
import React, { SelectHTMLAttributes, useCallback } from "react";
import "./styles.scss";

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  options: Array<any>;
  icon?: string;
  error?: boolean;
  labelClassname?: string;
  onChange?: (value) => void;
  onChangeValue?: (value) => void;
  label?: string;
  isNumber?: boolean;
  placeholderValue?: string | number;
  selectClassName?: string;
  size: "sm" | "default";
}

const Select: React.FC<SelectProps> = ({
  options,
  error,
  onChange,
  onChangeValue,
  label = "",
  labelClassname = "",
  icon = "fas fa-plus",
  value,
  isNumber,
  placeholder = "Selecciona opción",
  placeholderValue = "",
  name,
  className,
  selectClassName,
  size,
  disabled,
  ...props
}) => {
  const handleSelectChange = useCallback(
    ({ target: { value } }) => {
      let event = { target: { value: placeholderValue } };
      if (value === placeholder) {
        onChangeValue(event);
      } else {
        if (isNumber && value !== placeholderValue) {
          value = parseInt(value);
        }
        event.target.value = value;
        onChangeValue(event);
      }
    },
    [onChangeValue, isNumber, placeholder, placeholderValue]
  );

  return (
    <div className={clsx("input-group", className)}>
      <div
        className={clsx("input-group-prepend", {
          ["input-group-prepend-error"]: error,
        })}
      >
        <i className={icon}></i>
      </div>
      <select
        {...props}
        id={name}
        value={value}
        //defaultValue={value}
        disabled={disabled}
        onChange={onChange ? onChange : handleSelectChange}
        className={clsx(
          "form-control",
          selectClassName,
          {
            ["form-control-error"]: error == true,
          },
          { ["form-control-disabled"]: disabled }
        )}
      >
        <option value={placeholderValue} className="text-muted">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option value={opt.value} key={`option-${opt.value}`}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
