import clsx from "clsx";
import React, { InputHTMLAttributes, useCallback } from "react";
import "./styles.scss";

interface InputGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
  error?: boolean;
  onChangeValue: (value: any) => void;
}

const InputGroup: React.FC<InputGroupProps> = ({
  icon = "fas fa-plus",
  error,
  type = "text",
  onChangeValue,
  onChange,
  disabled,
  ...props
}) => {
  const handleChangeValue = useCallback(
    ({ target: { value } }) => {
      let event = { target: { value: value } };
      if (type === "number") {
        event.target.value = parseInt(value);
      }
      onChangeValue(event);
    },
    [onChangeValue, type]
  );
  return (
    <div className="input-group">
      <div
        className={clsx("input-group-prepend", {
          ["input-group-prepend-error"]: error,
        })}
      >
        <i className={icon}></i>
      </div>
      <input
        type={type}
        onChange={onChange ? onChange : handleChangeValue}
        disabled={disabled}
        className={clsx(
          "form-control",
          { ["form-control-disabled"]: disabled },
          { ["form-control-error"]: error }
        )}
        {...props}
      />
    </div>
  );
};

export default InputGroup;
