import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Container, Box, TextField, Theme, Button } from "@mui/material";
import UserService from "../services/users";

const validationSchema = yup.object({
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

const Onboarding: React.FC = () => {
  const continueAuth = async () => {
    const auth0Domain = process.env.REACT_APP_AUTH0_DOMAIN;
    const urlParams = new URLSearchParams(window.location.search);
    const state = urlParams.get("state");
    window.location.href = `https://${auth0Domain}/continue?state=${state}`;
  };

  const formik = useFormik({
    initialValues: {
      names: "",
      surnames: "",
      address: "",
      province: "",
      city: "",
      postalCode: "",
      phoneNum: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      alert(JSON.stringify(values, null, 2));
      // TODO: hardcoding email and picPath because backend needs them
      const response = await UserService.create({
        ...values,
        email: "fake@email.com",
        picPath: "somePath",
      });
      console.log({ response });

      if (response.status !== 201) {
        alert("Something went wrong.");
        return;
      }

      continueAuth();
    },
  });

  return (
    <Container maxWidth="xl">
      <h2>Completar Perfil</h2>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          "& > *:not(:last-child)": {
            marginBottom: (theme: Theme) => theme.spacing(2),
          },
        }}
      >
        <TextField
          fullWidth
          id="names"
          name="names"
          label="Nombre"
          value={formik.values.names}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.names && Boolean(formik.errors.names)}
          helperText={formik.touched.names && formik.errors.names}
          variant="outlined"
        />
        <TextField
          fullWidth
          id="surnames"
          name="surnames"
          label="Apellido"
          value={formik.values.surnames}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.surnames && Boolean(formik.errors.surnames)}
          helperText={formik.touched.surnames && formik.errors.surnames}
          variant="outlined"
        />
        <TextField
          fullWidth
          id="address"
          name="address"
          label="Direccion"
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
          variant="outlined"
        />
        {/* TODO: make a dropdown? */}
        <TextField
          fullWidth
          id="province"
          name="province"
          label="Provincia"
          value={formik.values.province}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.province && Boolean(formik.errors.province)}
          helperText={formik.touched.province && formik.errors.province}
          variant="outlined"
        />
        {/* TODO: make a dropdown? */}
        <TextField
          fullWidth
          id="city"
          name="city"
          label="Ciudad"
          value={formik.values.city}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.city && Boolean(formik.errors.city)}
          helperText={formik.touched.city && formik.errors.city}
          variant="outlined"
        />
        <TextField
          fullWidth
          id="postalCode"
          name="postalCode"
          label="Codigo Postal"
          value={formik.values.postalCode}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.postalCode && Boolean(formik.errors.postalCode)}
          helperText={formik.touched.postalCode && formik.errors.postalCode}
          variant="outlined"
        />
        <TextField
          fullWidth
          id="phoneNum"
          name="phoneNum"
          label="Telefono"
          value={formik.values.phoneNum}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.phoneNum && Boolean(formik.errors.phoneNum)}
          helperText={formik.touched.phoneNum && formik.errors.phoneNum}
          variant="outlined"
        />
        <div>
          <Button type="submit" variant="outlined">
            Confirmar
          </Button>
        </div>
      </Box>
    </Container>
  );
};

export default Onboarding;
