import * as yup from "yup";

export const userProfileSchema = yup.object({
  names: yup
    .string()
    .matches(/^[a-zA-Z]+$/, "No puede contener numeros o simbolos.")
    .min(2, "Debe tener una longitud de entre 2 y 50 caracteres.")
    .max(50, "Debe tener una longitud de entre 2 y 50 caracteres.")
    .required("Requerido."),
  surnames: yup
    .string()
    .matches(/^[a-zA-Z]+$/, "No puede contener numeros o simbolos.")
    .min(2, "Debe tener una longitud de entre 2 y 50 caracteres.")
    .max(50, "Debe tener una longitud de entre 2 y 50 caracteres.")
    .required("Requerido."),
  province: yup.string().required("Requerido."),
  city: yup.string().required("Requerido."),
  postalCode: yup
    .string()
    .required("Requerido.")
    .min(4, "Debe tener una longitud de 4 caracteres.")
    .max(4, "Debe tener una longitud de 4 caracteres."),
  // TODO: find a better regex for phoneNum validation?
  phoneNum: yup
    .string()
    .matches(/^\d+$/, "Solo debe contener numeros.")
    .required("Requerido."),
});
