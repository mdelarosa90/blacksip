import clsx from "clsx";
import React, { InputHTMLAttributes } from "react";
import "./styles.scss";

interface checkBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  onChangeValue?: (value: any) => void;
}

const Checkbox: React.FC<checkBoxProps> = ({
  label,
  className,
  id,
  checked,
  onChangeValue,
  children,
  ...props
}) => {
  return (
    <label className={clsx("form-check", className)}>
      <input
        type="checkbox"
        {...props}
        id={id}
        className={className}
        checked={checked}
      />
      <span className={clsx("form-check-label")}>
        {!!label ? label : children}
      </span>
    </label>
  );
};

export default Checkbox;
