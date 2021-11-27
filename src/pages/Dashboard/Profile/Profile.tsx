/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import {
  Button,
  Container,
  Grid,
  Box,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { PhotoCamera } from "@mui/icons-material";
import DashboardLayout from "../../../components/Dashboard/DashboardLayout";
import { useUserContext } from "../../../context/sessionContext";
import { userProfileSchema } from "../../../utils/validationSchemas";
import FormWrapper from "../../../components/Form/FormWrapper";
import FilesService from "../../../services/files";
import UserService from "../../../services/users";
import { IUser } from "../../../types/User";
import PhotoPreviewModal from "../../../components/ImagePreviewModal/ImagePreviewModal";

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

  // Image upload
  const [selectedImage, setSelectedImage] = React.useState<File>();

  const [selectedImagePreview, setSelectedImagePreview] =
    React.useState<string>();

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (img != null) {
      setSelectedImage(img);
    }
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("file", selectedImage as Blob);
    formData.append("upload_preset", "c54c8msx");
    const data = await FilesService.upload(formData);
    // TODO: improve error handling here
    if (data) {
      // Update user's picPath
      const updatedUser = await UserService.update({
        ...currentUser!,
        picPath: data.secure_url,
      });
      if (updatedUser) {
        setCurrentUser(updatedUser.data as IUser);
        enqueueSnackbar("Su foto de perfil fue actualizada con éxito", {
          variant: "success",
        });
      }
    }
  };

  React.useEffect(() => {
    if (!selectedImage) {
      setSelectedImagePreview(undefined);
      return;
    }

    const objectURL = URL.createObjectURL(selectedImage);
    setSelectedImagePreview(objectURL);

    // eslint-disable-next-line consistent-return
    return () => URL.revokeObjectURL(objectURL);
  }, [selectedImage]);

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {selectedImagePreview && (
                <PhotoPreviewModal
                  image={selectedImagePreview}
                  modalTitle="Modificar foto de perfil"
                  onClose={handleImageUpload}
                />
              )}
              <div style={{ position: "relative" }}>
                <img
                  src={currentUser!.picPath}
                  alt="Foto de perfil"
                  style={{ display: "block", maxWidth: "140px" }}
                />
                <label
                  title="Modificar foto de perfil"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    zIndex: 1,
                    backgroundColor: "#ccc",
                    opacity: 0.5,
                    borderRadius: "100rem",
                  }}
                >
                  <input
                    accept="image/*"
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleImageSelection}
                  />
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                  >
                    <PhotoCamera />
                  </IconButton>
                </label>
              </div>
              <div>
                {/* TODO: crashing when refreshing page because of this */}
                <Typography>
                  {`${currentUser!.names}
                  ${currentUser!.surnames}`}
                </Typography>
              </div>
            </Box>
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
