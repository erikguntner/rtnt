import React from 'react';
import { useField, FieldInputProps } from 'formik';

interface Props extends FieldInputProps<''> {
  label: string;
}

const Input: React.FC<Props> = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <>
      <label>
        {label}
        <input {...field} {...props} />
      </label>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

export default Input;
