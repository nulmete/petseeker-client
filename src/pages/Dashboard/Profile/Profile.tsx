/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import {
  Button,
  Container,
  Grid,
  IconButton,
  TextField,
  Box,
} from "@mui/material";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import DashboardLayout from "../../../components/Dashboard/DashboardLayout";
import { useUserContext } from "../../../context/sessionContext";
import UserImage from "../../../assets/avatar.png";
import { userProfileSchema } from "../../../utils/validationSchemas";
import FormWrapper from "../../../components/Form/FormWrapper";
import FilesService from "../../../services/files";
import UserService from "../../../services/users";
import { IUser } from "../../../types/User";

const Profile: React.FC = () => {
  const { currentUser, setCurrentUser } = useUserContext();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      address: currentUser?.address || "",
      province: currentUser?.province || "",
      city: currentUser?.city || "",
      postalCode: currentUser?.postalCode || "",
      phoneNum: currentUser?.phoneNum || "",
    },
    validationSchema: userProfileSchema,
    onSubmit: async (values) => {
      // Also send email, id, uuid, names, surnames, picPath from currentUser
      const { id, uuid, names, surnames, email, picPath } = currentUser!;
      const allValues = {
        id,
        uuid,
        names,
        surnames,
        email,
        picPath,
        ...values,
      };
      try {
        const response = await UserService.update(allValues);
        if (response.status === 200) {
          enqueueSnackbar("Su información fue actualizada con éxito.", {
            variant: "success",
          });
          setCurrentUser(response.data as IUser);
          formik.resetForm();
        }
      } catch (error) {
        enqueueSnackbar(
          "Hubo un error actualizando su información,por favor reintente más tarde.",
          {
            variant: "error",
          }
        );
      }
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    console.log({ img });
    if (img != null) {
      console.log("not null");
      const formData = new FormData();
      formData.append("files", img);
      const response = await FilesService.upload(formData);
      console.log({ response });
    }
  };

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} container justifyContent="center">
            <label htmlFor="icon-button-file">
              <input
                accept="image/*"
                id="icon-button-file"
                type="file"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <img
                  src={UserImage}
                  alt="User"
                  style={{ display: "block", maxWidth: "160px" }}
                />
              </IconButton>
            </label>
          </Grid>
          <Grid item xs={12}>
            <FormWrapper onSubmit={formik.handleSubmit}>
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
                error={
                  formik.touched.province && Boolean(formik.errors.province)
                }
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
                error={
                  formik.touched.postalCode && Boolean(formik.errors.postalCode)
                }
                helperText={
                  formik.touched.postalCode && formik.errors.postalCode
                }
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
                error={
                  formik.touched.phoneNum && Boolean(formik.errors.phoneNum)
                }
                helperText={formik.touched.phoneNum && formik.errors.phoneNum}
                variant="outlined"
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button
                  type="submit"
                  variant="outlined"
                  disabled={!(formik.isValid && formik.dirty)}
                >
                  Confirmar
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={formik.handleReset}
                >
                  Cancelar
                </Button>
              </Box>
            </FormWrapper>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

export default Profile;
