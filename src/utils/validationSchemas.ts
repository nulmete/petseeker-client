import * as yup from "yup";

export const userOnboardingSchema = yup.object({
  names: yup
    .string()
    .matches(/^[a-zA-Z\s]+$/, "No puede contener numeros o simbolos.")
    .min(2, "Debe tener una longitud de entre 2 y 50 caracteres.")
    .max(50, "Debe tener una longitud de entre 2 y 50 caracteres.")
    .required("Requerido."),
  surnames: yup
    .string()
    .matches(/^[a-zA-Z\s]+$/, "No puede contener numeros o simbolos.")
    .min(2, "Debe tener una longitud de entre 2 y 50 caracteres.")
    .max(50, "Debe tener una longitud de entre 2 y 50 caracteres.")
    .required("Requerido."),
  address: yup.string().required("Requerido."),
  province: yup.string().required("Requerido."),
  city: yup.string().required("Requerido."),
  postal_code: yup
    .string()
    .required("Requerido.")
    .min(4, "Debe tener una longitud de 4 caracteres.")
    .max(4, "Debe tener una longitud de 4 caracteres."),
  phone_number: yup
    .string()
    .matches(/^\d+$/, "Solo debe contener numeros.")
    .required("Requerido."),
});

export const userProfileSchema = yup.object({
  address: yup.string().required("Requerido."),
  province: yup.string().required("Requerido."),
  city: yup.string().required("Requerido."),
  postal_code: yup
    .string()
    .required("Requerido.")
    .min(4, "Debe tener una longitud de 4 caracteres.")
    .max(4, "Debe tener una longitud de 4 caracteres."),
  phone_number: yup
    .string()
    .matches(/^\d+$/, "Solo debe contener numeros.")
    .required("Requerido."),
});

export const publicationSchema = yup.object({
  title: yup
    .string()
    .matches(/^[a-zA-Z\s]+$/, "No puede contener numeros o simbolos.")
    .required("Requerido."),
  pet_name: yup
    .string()
    .matches(/^[a-zA-Z\s]+$/, "No puede contener numeros o simbolos.")
    .min(2, "Debe tener una longitud de entre 2 y 50 caracteres.")
    .max(50, "Debe tener una longitud de entre 2 y 50 caracteres.")
    .required("Requerido."),
  pet_pic_url: yup
    .array()
    .of(yup.string())
    .min(1, "Debes elegir entre 1 y 5 imágenes")
    .max(5, "Debes elegir entre 1 y 5 imágenes"),
  pet_race: yup.string().required("Requerido."),
  pet_location: yup.string().required("Requerido."),
  pub_type: yup.string().required("Requerido."),
  description: yup
    .string()
    .notRequired()
    .min(10, "Debe tener una longitud de entre 10 y 3000 caracteres.")
    .max(3000, "Debe tener una longitud de entre 10 y 3000 caracteres."),
});
