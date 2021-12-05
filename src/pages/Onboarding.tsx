import React from "react";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import UserService from "../services/users";
import { userOnboardingSchema } from "../utils/validationSchemas";
import FormWrapper from "../components/Form/FormWrapper";
import PageHeader from "../components/Typography/PageHeader";
import PageContainer from "../components/PageContainer/PageContainer";
import CustomButton from "../components/Button/CustomButton";
import TextInput from "../components/Input/TextInput";

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
      postal_code: "",
      phone_number: "",
    },
    validationSchema: userOnboardingSchema,
    onSubmit: async (values) => {
      // Sending email and pic_path as empty since backend needs them
      try {
        const response = await UserService.create({
          ...values,
          user_uuid: auth0Id,
          email: "",
          pic_path: "",
        });
        if (response.status === 201) {
          enqueueSnackbar("Perfil completado con exito.", {
            variant: "success",
          });
          continueAuth();
        }
      } catch (error) {
        enqueueSnackbar("Error al completar el perfil. Intente nuevamente.", {
          variant: "error",
        });
      }
    },
  });

  return (
    <PageContainer>
      <div className="spacing-sm">
        <PageHeader>Completar Perfil</PageHeader>
        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            id="names"
            name="names"
            label="Nombre"
            value={formik.values.names}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.names && Boolean(formik.errors.names)}
            helperText={formik.touched.names && formik.errors.names}
          />
          <TextInput
            id="surnames"
            name="surnames"
            label="Apellido"
            value={formik.values.surnames}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.surnames && Boolean(formik.errors.surnames)}
            helperText={formik.touched.surnames && formik.errors.surnames}
          />
          <TextInput
            id="address"
            name="address"
            label="Dirección"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
          />
          <TextInput
            id="province"
            name="province"
            label="Provincia"
            value={formik.values.province}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.province && Boolean(formik.errors.province)}
            helperText={formik.touched.province && formik.errors.province}
          />
          <TextInput
            id="city"
            name="city"
            label="Ciudad"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.city && Boolean(formik.errors.city)}
            helperText={formik.touched.city && formik.errors.city}
          />
          <TextInput
            id="postal_code"
            name="postal_code"
            label="Código Postal"
            value={formik.values.postal_code}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.postal_code && Boolean(formik.errors.postal_code)
            }
            helperText={formik.touched.postal_code && formik.errors.postal_code}
          />
          <TextInput
            id="phone_number"
            name="phone_number"
            label="Teléfono"
            value={formik.values.phone_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.phone_number && Boolean(formik.errors.phone_number)
            }
            helperText={
              formik.touched.phone_number && formik.errors.phone_number
            }
          />
          <div>
            <CustomButton type="submit">Confirmar</CustomButton>
          </div>
        </FormWrapper>
      </div>
    </PageContainer>
  );
};

export default Onboarding;
