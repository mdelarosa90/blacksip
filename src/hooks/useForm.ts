import { useState, useCallback } from "react";

interface Pattern {
  value: RegExp;
  message: string;
}

interface validations {
  required?: boolean;
  pattern?: Pattern;
  validate?: (value) => void;
}

export const useForm = <T>({
  defaultValues = {} as any,
  labels = {} as any,
  validations = {} as any,
}: {
  defaultValues: T;
  labels?: { [key in keyof T]: string };
  validations: { [key in keyof T]: validations };
}) => {
  if (!validations) {
    throw new Error("the option `validations` is required");
  }
  if (typeof validations !== "object") {
    throw new Error("the option `validations` should be an object");
  }
  const [values, setValues] = useState<T>(defaultValues);
  const [errors, setErrors] = useState<any>({});
  const [missing, setMissing] = useState([]);

  const validateField = useCallback(
    (name, value) => {
      // get the validation rules for the field
      const rules = validations[name] as any;
      // check if the rules exist, since a field can not have validations
      if (rules) {
        // if the required rule is registered
        if (rules.required) {
          // now we validate the value checking if it has a value
          // we are using trim, to strip whitespaces before and after the value
          if (
            (typeof value === "string" && !value.trim()) ||
            typeof value === "undefined"
          ) {
            return typeof rules.required === "string"
              ? rules.required
              : "required";
          }
        }
        // if the pattern rule is registered
        if (rules.pattern) {
          // we execute the regex
          if (!new RegExp(rules.pattern.value).exec(value)) {
            // if the value does not match with the regex pattern, we try to return
            // the custom message and fallback to the default message in case
            return rules.pattern.message || "invalid";
          }
        }
        // if it has a validation function and its type is a function
        if (rules.validate && typeof rules.validate === "function") {
          // we run the validate function with the field value
          const error = rules.validate(value);
          // if an error message was returned, we return it
          if (error) {
            return error;
          }
        }
      }
      // if there are no erros, we return an empty string
      return "";
    },
    [validations]
  );

  const handleChange = useCallback(
    (key) => (event) => {
      const { value } = event.target;
      setValues((data) => ({
        ...data,
        [key]: value,
      }));
      setErrors((state) => ({
        ...state,
        [key]: validateField(key, value),
      }));
      if (errors[key] == "" || !errors[key]) {
        setMissing((data) => {
          if (data.length) {
            const index = data.indexOf(key);
            if (index >= 0) {
              return data.slice(0, index).concat(data.slice(index + 1));
            }
          }
          return data;
        });
      }
    },
    [errors, validateField]
  );

  const handleChangeCheckbox = useCallback(
    (key) => (event) => {
      const { checked } = event.target;
      setValues((data) => ({
        ...data,
        [key]: checked,
      }));
      setErrors((state) => ({
        ...state,
        [key]: validateField(key, checked),
      }));
      if (errors[key] == "" || !errors[key]) {
        setMissing((data) => {
          if (data.length) {
            const index = data.indexOf(key);
            if (index >= 0) {
              return data.slice(0, index).concat(data.slice(index + 1));
            }
          }
          return data;
        });
      }
    },
    [errors, validateField]
  );

  const getProps = useCallback(
    (key: string, isRadio?: "R" | "C") => {
      if (!key) {
        throw new Error("The field name parameter is required");
      }
      if (key && typeof key !== "string") {
        throw new Error("The field name should be a string");
      }

      if (isRadio === "R") {
        return {
          selected: values[key],
          onChange: handleChange(key),
          error: missing.includes(key),
          name: key,
        } as any;
      } else if (isRadio === "C") {
        return {
          checked: values[key],
          onChange: handleChangeCheckbox(key),
          name: key,
          label: labels[key],
        };
      } else {
        return {
          value: values[key],
          onChangeValue: handleChange(key),
          error: missing.includes(key),
          label: labels[key],
          name: key,
        };
      }
    },
    [values, handleChange, missing]
  );

  const clearFields = useCallback(() => {
    setValues(defaultValues);
  }, [defaultValues]);

  const checkValidData = useCallback(() => {
    const hasErrors = Object.keys(validations).filter((key) =>
      Boolean(validateField(key, values[key]))
    );
    if (hasErrors.length) {
      setMissing([...hasErrors]);
      return false;
    }
    return true;
  }, [values, validations, validateField]);

  const addErrorField = useCallback((key: keyof T | (keyof T)[]) => {
    setMissing((data) => {
      if (Array.isArray(key)) {
        let newKeys = key.filter((f) => !data.includes(f));
        return [...data, ...newKeys];
      } else {
        if (!data.includes(key)) {
          return [...data, key];
        }
      }
      return data;
    });
  }, []);

  const removeErrorField = useCallback((key: keyof T | "All") => {
    if (key !== "All") {
      setMissing((data) => {
        if (data.length) {
          const index = data.indexOf(key);
          if (index >= 0) {
            return data.slice(0, index).concat(data.slice(index + 1));
          }
        }
        return data;
      });
    } else {
      setMissing([]);
    }
  }, []);

  return {
    values,
    errors,
    missing,
    validateField,
    handleChange,
    getProps,
    checkValidData,
    clearFields,
    addErrorField,
    removeErrorField,
    setValues,
  };
};
