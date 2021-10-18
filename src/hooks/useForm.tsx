import React, { useState, FormEvent, ChangeEvent } from "react";

const useForm = function <T>(callback: (state: T) => void, initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }
    callback(values);
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    event.persist();
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  return {
    handleSubmit,
    handleInputChange,
    values,
  };
};

export default useForm;
