import React from "react";
import { useFormik } from "formik";
import { TextField, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import UserService from "../services/users";
import { userOnboardingSchema } from "../utils/validationSchemas";
import FormWrapper from "../components/Form/FormWrapper";
import PageHeader from "../components/Typography/PageHeader";
import PageContainer from "../components/PageContainer/PageContainer";

interface ParamTypes {
  id: string;
}

const Onboarding: React.FC = () => {
  const { id: auth0Id } = useParams<ParamTypes>();
  const { enqueueSnackbar } = useSnackbar();

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
    validationSchema: userOnboardingSchema,
    onSubmit: async (values) => {
      // Sending email and picPath as empty since backend needs them
      const response = await UserService.create({
        ...values,
        uuid: auth0Id,
        email: "",
        picPath: "",
      });

      if (response.status !== 201) {
        enqueueSnackbar("Error al completar el perfil. Intente nuevamente.", {
          variant: "error",
        });
        return;
      }

      continueAuth();
    },
  });

  return (
    <PageContainer>
      <div className="spacing-sm">
        <PageHeader>Completar Perfil</PageHeader>
        <FormWrapper onSubmit={formik.handleSubmit}>
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
            label="Dirección"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
            variant="outlined"
          />
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
            label="Código Postal"
            value={formik.values.postalCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.postalCode && Boolean(formik.errors.postalCode)
            }
            helperText={formik.touched.postalCode && formik.errors.postalCode}
            variant="outlined"
          />
          <TextField
            fullWidth
            id="phoneNum"
            name="phoneNum"
            label="Teléfono"
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
        </FormWrapper>
      </div>
    </PageContainer>
  );
};

export default Onboarding;